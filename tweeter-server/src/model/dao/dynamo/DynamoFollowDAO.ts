// AI-assisted: see AI-ATTRIBUTION.md
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

  public async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
    throw new Error("isFollower is not implemented yet");
  }

  // Queries the table itself: every row for this follower is a user they follow,
  // sorted by followee alias.
  public async getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<DataPage<string>> {
    const startKey =
      lastFolloweeAlias === null
        ? undefined
        : { [this.followerAttr]: followerAlias, [this.followeeAttr]: lastFolloweeAlias };

    return this.queryPage(
      {
        KeyConditionExpression: "#follower = :follower",
        ExpressionAttributeNames: { "#follower": this.followerAttr },
        ExpressionAttributeValues: { ":follower": followerAlias },
      },
      pageSize,
      startKey,
      (item) => item[this.followeeAttr] as string,
    );
  }

  // Queries follow_index, where rows are grouped by followee: every row for this
  // followee is one of their followers, sorted by follower alias.
  public async getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<DataPage<string>> {
    // A GSI's start key needs both the index key and the table key; here they
    // are the same two attributes.
    const startKey =
      lastFollowerAlias === null
        ? undefined
        : { [this.followeeAttr]: followeeAlias, [this.followerAttr]: lastFollowerAlias };

    return this.queryPage(
      {
        IndexName: this.followIndex,
        KeyConditionExpression: "#followee = :followee",
        ExpressionAttributeNames: { "#followee": this.followeeAttr },
        ExpressionAttributeValues: { ":followee": followeeAlias },
      },
      pageSize,
      startKey,
      (item) => item[this.followerAttr] as string,
    );
  }

  public async getAllFollowers(followeeAlias: string): Promise<string[]> {
    throw new Error("getAllFollowers is not implemented yet");
  }
}
