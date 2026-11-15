// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterResponse } from "./TweeterResponse";

// Generic response containing a page of items of type T (e.g. UserDto, StatusDto).
export interface PagedItemResponse<T> extends TweeterResponse {
    readonly items: T[] | null;
    readonly hasMore: boolean;
}
