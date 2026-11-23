// AI-assisted: see AI-ATTRIBUTION.md
import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { FollowService } from "../../model/service/FollowService";
import { handlePagedItemRequest } from "../PagedItemHandler";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    const followService = new FollowService(new DynamoDAOFactory());
    return handlePagedItemRequest(request, (token, userAlias, pageSize, lastItem) =>
        followService.loadMoreFollowers(token, userAlias, pageSize, lastItem),
    );
};
