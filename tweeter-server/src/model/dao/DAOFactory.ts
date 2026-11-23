// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDAO } from "./AuthTokenDAO";
import { FollowDAO } from "./FollowDAO";
import { ImageDAO } from "./ImageDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

// Abstract Factory: services get their DAOs from here and never
// know which database is behind them.
export interface DAOFactory {
  getUserDAO(): UserDAO;
  getAuthTokenDAO(): AuthTokenDAO;
  getFollowDAO(): FollowDAO;
  getStoryDAO(): StatusDAO;
  getFeedDAO(): StatusDAO;
  getImageDAO(): ImageDAO;
}
