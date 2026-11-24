// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../DataPage";

export const REGION = "us-east-1";

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
}
