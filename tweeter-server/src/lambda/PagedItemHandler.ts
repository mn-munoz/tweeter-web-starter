// AI-assisted: see AI-ATTRIBUTION.md
import { PagedItemRequest, PagedItemResponse } from "tweeter-shared";

// Loads one page of items of type T (e.g. UserDto, StatusDto) from a service.
export type LoadPage<T> = (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: T | null,
) => Promise<[T[], boolean]>;

// Shared logic for lambdas that return a page of items (followees, followers, feed, story).
export const handlePagedItemRequest = async <T>(
    request: PagedItemRequest<T>,
    loadPage: LoadPage<T>,
): Promise<PagedItemResponse<T>> => {
    const [items, hasMore] = await loadPage(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore,
    };
};
