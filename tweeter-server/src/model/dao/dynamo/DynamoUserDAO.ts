// AI-assisted: see AI-ATTRIBUTION.md
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand, BatchGetCommandOutput, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { UserDto } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { DynamoBase } from "./DynamoBase";

// BatchGetItem accepts at most 100 keys per request.
const BATCH_GET_LIMIT = 100;

export class DynamoUserDAO extends DynamoBase implements UserDAO {
  private readonly aliasAttr = "alias";
  private readonly firstNameAttr = "first_name";
  private readonly lastNameAttr = "last_name";
  private readonly imageUrlAttr = "image_url";
  private readonly passwordHashAttr = "password_hash";
  private readonly followerCountAttr = "follower_count";
  private readonly followeeCountAttr = "followee_count";

  public constructor() {
    super("user");
  }

  public async getUser(alias: string): Promise<UserDto | null> {
    const item = await this.getItem(alias);
    return item === undefined ? null : this.toUserDto(item);
  }

  public async getUsers(aliases: string[]): Promise<UserDto[]> {
    const unique = [...new Set(aliases)];
    const users: UserDto[] = [];

    for (let i = 0; i < unique.length; i += BATCH_GET_LIMIT) {
      let keys: Record<string, any>[] | undefined = unique
        .slice(i, i + BATCH_GET_LIMIT)
        .map((alias) => ({ [this.aliasAttr]: alias }));

      // Keep requesting until DynamoDB has returned every key.
      while (keys !== undefined && keys.length > 0) {
        const output: BatchGetCommandOutput = await this.client.send(
          new BatchGetCommand({ RequestItems: { [this.tableName]: { Keys: keys } } }),
        );
        const items = output.Responses?.[this.tableName] ?? [];
        users.push(...items.map((item) => this.toUserDto(item)));
        keys = output.UnprocessedKeys?.[this.tableName]?.Keys;
      }
    }

    return users;
  }

  public async getPasswordHash(alias: string): Promise<string | null> {
    const item = await this.getItem(alias);
    return item === undefined ? null : item[this.passwordHashAttr];
  }

  public async createUser(user: UserDto, passwordHash: string): Promise<boolean> {
    try {
      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: {
            [this.aliasAttr]: user.alias,
            [this.firstNameAttr]: user.firstName,
            [this.lastNameAttr]: user.lastName,
            [this.imageUrlAttr]: user.imageUrl,
            [this.passwordHashAttr]: passwordHash,
            [this.followerCountAttr]: 0,
            [this.followeeCountAttr]: 0,
          },
          ConditionExpression: "attribute_not_exists(#alias)",
          ExpressionAttributeNames: { "#alias": this.aliasAttr },
        }),
      );
      return true;
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        return false;
      }
      throw error;
    }
  }

  public async getFollowerCount(alias: string): Promise<number> {
    const item = await this.getItem(alias);
    return item?.[this.followerCountAttr] ?? 0;
  }

  public async getFolloweeCount(alias: string): Promise<number> {
    const item = await this.getItem(alias);
    return item?.[this.followeeCountAttr] ?? 0;
  }

  public async incrementCounts(alias: string, followerDelta: number, followeeDelta: number): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { [this.aliasAttr]: alias },
        UpdateExpression: "ADD #followers :followerDelta, #followees :followeeDelta",
        ExpressionAttributeNames: {
          "#followers": this.followerCountAttr,
          "#followees": this.followeeCountAttr,
        },
        ExpressionAttributeValues: {
          ":followerDelta": followerDelta,
          ":followeeDelta": followeeDelta,
        },
      }),
    );
  }

  private async getItem(alias: string): Promise<Record<string, any> | undefined> {
    const output = await this.client.send(
      new GetCommand({ TableName: this.tableName, Key: { [this.aliasAttr]: alias } }),
    );
    return output.Item;
  }

  private toUserDto(item: Record<string, any>): UserDto {
    return {
      alias: item[this.aliasAttr],
      firstName: item[this.firstNameAttr],
      lastName: item[this.lastNameAttr],
      imageUrl: item[this.imageUrlAttr],
    };
  }
}
