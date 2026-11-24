// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../DataPage";

export const REGION = "us-east-1";

// BatchWriteItem accepts at most 25 items per request.
const BATCH_WRITE_LIMIT = 25;
// Retry delays for unprocessed items: 50 ms, 100 ms, 200 ms, ... up to 2 s.
const BASE_RETRY_DELAY_MS = 50;
const MAX_RETRY_DELAY_MS = 2000;
const MAX_BATCH_RETRIES = 10;

type BatchWriteRequests = NonNullable<BatchWriteCommandInput["RequestItems"]>[string];

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// One client shared by every DynamoDB DAO (created once per lambda container).
const sharedClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

// The parts of a query that callers choose; queryPage sets the paging fields.
export type PageQuery = Omit<QueryCommandInput, "TableName" | "Limit" | "ExclusiveStartKey">;

// Base class for DynamoDB DAOs.
export abstract class DynamoBase {
  protected readonly client: DynamoDBDocumentClient = sharedClient;

  protected constructor(protected readonly tableName: string) {}

  // Runs one page of a query. startKey is the full primary key of the last item
  // on the previous page (undefined for the first page). Shared by every paged
  // DAO method (followees, followers, story, feed).
  protected async queryPage<T>(
    query: PageQuery,
    pageSize: number,
    startKey: Record<string, any> | undefined,
    mapItem: (item: Record<string, any>) => T,
  ): Promise<DataPage<T>> {
    const output = await this.client.send(
      new QueryCommand({
        ...query,
        TableName: this.tableName,
        Limit: pageSize,
        ExclusiveStartKey: startKey,
      }),
    );

    const items = (output.Items ?? []).map(mapItem);
    // DynamoDB sets LastEvaluatedKey whenever it stopped at the Limit.
    return new DataPage<T>(items, output.LastEvaluatedKey !== undefined);
  }

  // Writes any number of items to this table using BatchWriteItem, which takes
  // at most 25 items per request. Items DynamoDB couldn't write (usually because
  // the table's write capacity was exceeded) come back as UnprocessedItems and
  // are retried with an increasing delay.
  protected async batchWriteChunked(items: Record<string, any>[]): Promise<void> {
    for (let i = 0; i < items.length; i += BATCH_WRITE_LIMIT) {
      let requests: BatchWriteRequests | undefined = items
        .slice(i, i + BATCH_WRITE_LIMIT)
        .map((item) => ({ PutRequest: { Item: item } }));

      for (let attempt = 0; requests !== undefined && requests.length > 0; attempt++) {
        if (attempt > MAX_BATCH_RETRIES) {
          throw new Error(`Batch write to ${this.tableName} still had unprocessed items after retrying`);
        }
        if (attempt > 0) {
          await sleep(Math.min(BASE_RETRY_DELAY_MS * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS));
        }

        const output: BatchWriteCommandOutput = await this.client.send(
          new BatchWriteCommand({ RequestItems: { [this.tableName]: requests } }),
        );
        requests = output.UnprocessedItems?.[this.tableName];
      }
    }
  }
}
