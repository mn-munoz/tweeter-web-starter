// AI-assisted: see AI-ATTRIBUTION.md
import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AuthTokenDto } from "tweeter-shared";
import { AuthTokenDAO, Session } from "../AuthTokenDAO";
import { DynamoBase } from "./DynamoBase";

// DynamoDB's TTL deletes abandoned tokens this long after their last use.
// This is only cleanup: the idle timeout itself is enforced by the service.
const TTL_SECONDS = 24 * 60 * 60;

export class DynamoAuthTokenDAO extends DynamoBase implements AuthTokenDAO {
  private readonly tokenAttr = "token";
  private readonly aliasAttr = "alias";
  private readonly lastUsedAttr = "last_used";
  private readonly expiresAtAttr = "expires_at";

  public constructor() {
    super("authtoken");
  }

  public async create(authToken: AuthTokenDto, alias: string): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          [this.tokenAttr]: authToken.token,
          [this.aliasAttr]: alias,
          [this.lastUsedAttr]: authToken.timestamp,
          [this.expiresAtAttr]: this.expiresAt(authToken.timestamp),
        },
      }),
    );
  }

  public async get(token: string): Promise<Session | null> {
    const output = await this.client.send(
      new GetCommand({ TableName: this.tableName, Key: { [this.tokenAttr]: token } }),
    );
    if (output.Item === undefined) {
      return null;
    }
    return { alias: output.Item[this.aliasAttr], lastUsed: output.Item[this.lastUsedAttr] };
  }

  public async touch(token: string, now: number): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { [this.tokenAttr]: token },
        UpdateExpression: "SET #lastUsed = :now, #expiresAt = :expiresAt",
        ExpressionAttributeNames: { "#lastUsed": this.lastUsedAttr, "#expiresAt": this.expiresAtAttr },
        ExpressionAttributeValues: { ":now": now, ":expiresAt": this.expiresAt(now) },
      }),
    );
  }

  public async delete(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({ TableName: this.tableName, Key: { [this.tokenAttr]: token } }),
    );
  }

  // TTL attributes must be in seconds since the epoch.
  private expiresAt(millis: number): number {
    return Math.floor(millis / 1000) + TTL_SECONDS;
  }
}
