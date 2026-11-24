// AI-assisted: see AI-ATTRIBUTION.md
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../DataPage";
import { StatusDAO, StoredStatus } from "../StatusDAO";
import { DynamoBase } from "./DynamoBase";

// One class for both status tables. Each has partition key = owner alias and
// sort key = timestamp (N), plus post and author_alias attributes:
//   story: owner is the author ("author_alias" is the partition key)
//   feed:  owner is the user whose feed it is ("owner_alias" is the partition key)
export class DynamoStatusDAO extends DynamoBase implements StatusDAO {
  private readonly timestampAttr = "timestamp";
  private readonly postAttr = "post";
  private readonly authorAttr = "author_alias";

  public constructor(tableName: string, private readonly ownerAttr: string) {
    super(tableName);
  }

  public async getPage(
    ownerAlias: string,
    pageSize: number,
    lastTimestamp: number | null,
  ): Promise<DataPage<StoredStatus>> {
    const startKey =
      lastTimestamp === null
        ? undefined
        : { [this.ownerAttr]: ownerAlias, [this.timestampAttr]: lastTimestamp };

    return this.queryPage(
      {
        KeyConditionExpression: "#owner = :owner",
        ExpressionAttributeNames: { "#owner": this.ownerAttr },
        ExpressionAttributeValues: { ":owner": ownerAlias },
        ScanIndexForward: false, // newest first
      },
      pageSize,
      startKey,
      (item) => ({
        post: item[this.postAttr],
        authorAlias: item[this.authorAttr],
        timestamp: item[this.timestampAttr],
      }),
    );
  }

  public async put(ownerAlias: string, status: StoredStatus): Promise<void> {
    await this.client.send(new PutCommand({ TableName: this.tableName, Item: this.toItem(ownerAlias, status) }));
  }

  // In the story table the owner and author attributes are the same
  // ("author_alias"), so this just sets it once.
  private toItem(ownerAlias: string, status: StoredStatus): Record<string, any> {
    return {
      [this.authorAttr]: status.authorAlias,
      [this.ownerAttr]: ownerAlias,
      [this.timestampAttr]: status.timestamp,
      [this.postAttr]: status.post,
    };
  }

  public async batchPut(ownerAliases: string[], status: StoredStatus): Promise<void> {
    throw new Error("batchPut is not implemented yet");
  }
}
