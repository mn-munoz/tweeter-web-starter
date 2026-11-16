import { UserAliasRequest } from "./UserAliasRequest";

export interface FollowCountRequest extends UserAliasRequest {
    readonly token: string;
    readonly userAlias: string;
}