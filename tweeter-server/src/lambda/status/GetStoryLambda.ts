// AI-assisted: see AI-ATTRIBUTION.md
import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { handlePagedItemRequest } from "../PagedItemHandler";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService();
    return handlePagedItemRequest(request, (token, userAlias, pageSize, lastItem) =>
        statusService.loadMoreStoryItems(token, userAlias, pageSize, lastItem),
    );
};
