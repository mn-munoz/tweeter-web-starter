// AI-assisted: see AI-ATTRIBUTION.md
import { UserAliasRequest } from "./UserAliasRequest";

// Get user only needs the auth token and the alias of the user being looked up.
export type GetUserRequest = UserAliasRequest;
