import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
    const followService = new FollowService();
    const count = await followService.getFolloweeCount(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        count: count,
    }

}