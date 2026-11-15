import { PagedStatusItemRequest, PagedStatusItemResponse, Status } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService();
    const [items, hasMore] = await statusService.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, Status.fromDto(request.lastItem));

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore,
    }
}