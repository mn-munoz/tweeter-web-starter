// AI-assisted: see AI-ATTRIBUTION.md
import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { StatusService } from "../../model/service/StatusService";
import { withErrorMapping } from "../withErrorMapping";
import { handlePagedItemRequest } from "../PagedItemHandler";

export const handler = withErrorMapping(async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService(new DynamoDAOFactory());
    return handlePagedItemRequest(request, (token, userAlias, pageSize, lastItem) =>
        statusService.loadMoreStoryItems(token, userAlias, pageSize, lastItem),
    );
});
