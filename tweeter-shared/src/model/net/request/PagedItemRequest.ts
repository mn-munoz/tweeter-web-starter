// AI-assisted: see AI-ATTRIBUTION.md
import { AuthenticatedRequest } from "./AuthenticatedRequest";

// Generic request for a page of items of type T (e.g. UserDto, StatusDto).
export interface PagedItemRequest<T> extends AuthenticatedRequest {
    readonly pageSize: number;
    readonly lastItem: T | null;
}
