// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

// Generic request for a page of items of type T (e.g. UserDto, StatusDto).
export interface PagedItemRequest<T> extends TweeterRequest {
    readonly token: string;
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: T | null;
}
