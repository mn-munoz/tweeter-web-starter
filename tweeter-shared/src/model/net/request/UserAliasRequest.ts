import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface UserAliasRequest extends AuthenticatedRequest {
    readonly userAlias: string;
}