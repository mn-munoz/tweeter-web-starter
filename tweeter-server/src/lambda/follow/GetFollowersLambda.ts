// AI-assisted: see AI-ATTRIBUTION.md
import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handlePagedItemRequest } from "../PagedItemHandler";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    const followService = new FollowService();
    return handlePagedItemRequest(request, (token, userAlias, pageSize, lastItem) =>
        followService.loadMoreFollowers(token, userAlias, pageSize, lastItem),
    );
};
