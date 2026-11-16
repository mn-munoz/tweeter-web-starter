// AI-assisted: see AI-ATTRIBUTION.md
import { UserAliasRequest } from "./UserAliasRequest";

// Generic request for a page of items of type T (e.g. UserDto, StatusDto).
export interface PagedItemRequest<T> extends UserAliasRequest {
    readonly pageSize: number;
    readonly lastItem: T | null;
}
