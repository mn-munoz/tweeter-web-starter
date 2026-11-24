// AI-assisted: see AI-ATTRIBUTION.md
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { DataPage } from "../DataPage";
import { FollowDAO } from "../FollowDAO";
import { DynamoBase } from "./DynamoBase";

// follow table: partition key follower_handle, sort key followee_handle.
// follow_index (GSI): partition key followee_handle, sort key follower_handle.
export class DynamoFollowDAO extends DynamoBase implements FollowDAO {
  private readonly followerAttr = "follower_handle";
  private readonly followeeAttr = "followee_handle";
  private readonly followIndex = "follow_index";

  public constructor() {
    super("follow");
  }

  public async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    throw new Error("putFollow is not implemented yet");
  }

  public async deleteFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    throw new Error("deleteFollow is not implemented yet");
  }

  // The table's key is (follower, followee), so this is a single key lookup.
  public async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const output = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { [this.followerAttr]: followerAlias, [this.followeeAttr]: followeeAlias },
      }),
    );
    return output.Item !== undefined;
  }

  // Queries the table itself: every row for this follower is a user they follow,
  // sorted by followee alias.
  public async getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<DataPage<string>> {
    return this.getPageOfAliases(
      this.followerAttr,
      this.followeeAttr,
      undefined,
      followerAlias,
      pageSize,
      lastFolloweeAlias,
    );
  }

  // Queries follow_index, where rows are grouped by followee: every row for this
  // followee is one of their followers, sorted by follower alias.
  public async getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<DataPage<string>> {
    return this.getPageOfAliases(
      this.followeeAttr,
      this.followerAttr,
      this.followIndex,
      followeeAlias,
      pageSize,
      lastFollowerAlias,
    );
  }

  // Shared by both lists. Finds the rows whose keyAttr equals alias (in the table,
  // or in indexName if given) and returns each row's resultAttr.
  private async getPageOfAliases(
    keyAttr: string,
    resultAttr: string,
    indexName: string | undefined,
    alias: string,
    pageSize: number,
    lastResultAlias: string | null,
  ): Promise<DataPage<string>> {
    // The start key is the last row's full key: both attributes. (For the GSI that
    // covers both the index key and the table key, since they are the same two.)
    const startKey =
      lastResultAlias === null ? undefined : { [keyAttr]: alias, [resultAttr]: lastResultAlias };

    return this.queryPage(
      {
        IndexName: indexName,
        KeyConditionExpression: "#key = :alias",
        ExpressionAttributeNames: { "#key": keyAttr },
        ExpressionAttributeValues: { ":alias": alias },
      },
      pageSize,
      startKey,
      (item) => item[resultAttr] as string,
    );
  }

  public async getAllFollowers(followeeAlias: string): Promise<string[]> {
    throw new Error("getAllFollowers is not implemented yet");
  }
}
