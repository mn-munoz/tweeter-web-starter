import { UserAliasRequest } from "./UserAliasRequest";

export interface FollowStatusRequest extends UserAliasRequest {
    readonly selectedUserAlias: string;
}