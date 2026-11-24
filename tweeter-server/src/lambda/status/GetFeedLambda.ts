// AI-assisted: see AI-ATTRIBUTION.md
import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { StatusService } from "../../model/service/StatusService";
import { handlePagedItemRequest } from "../PagedItemHandler";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
    const statusService = new StatusService(new DynamoDAOFactory());
    return handlePagedItemRequest(request, (token, userAlias, pageSize, lastItem) =>
        statusService.loadMoreFeedItems(token, userAlias, pageSize, lastItem),
    );
};
