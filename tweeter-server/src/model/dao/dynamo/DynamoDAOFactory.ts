// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DAOFactory } from "../DAOFactory";
import { FollowDAO } from "../FollowDAO";
import { ImageDAO } from "../ImageDAO";
import { S3ImageDAO } from "../s3/S3ImageDAO";
import { StatusDAO } from "../StatusDAO";
import { UserDAO } from "../UserDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

// Concrete factory: DynamoDB for tables, S3 for images.
export class DynamoDAOFactory implements DAOFactory {
  public getUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }

  public getAuthTokenDAO(): AuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  public getFollowDAO(): FollowDAO {
    return new DynamoFollowDAO();
  }

  public getStoryDAO(): StatusDAO {
    return new DynamoStatusDAO("story", "author_alias");
  }

  public getFeedDAO(): StatusDAO {
    throw new Error("Feed DAO is not implemented yet");
  }

  public getImageDAO(): ImageDAO {
    return new S3ImageDAO();
  }
}
