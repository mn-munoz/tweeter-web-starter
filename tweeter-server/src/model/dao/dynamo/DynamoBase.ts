// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const REGION = "us-east-1";

// One client shared by every DynamoDB DAO (created once per lambda container).
const sharedClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});

// Base class for DynamoDB DAOs. The paged-query and batch-write helpers
// will be added here when the follow and status DAOs need them.
export abstract class DynamoBase {
  protected readonly client: DynamoDBDocumentClient = sharedClient;

  protected constructor(protected readonly tableName: string) {}
}
