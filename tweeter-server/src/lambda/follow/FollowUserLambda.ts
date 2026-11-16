// AI-assisted: see AI-ATTRIBUTION.md
import { ChangeFollowRequest, ChangeFollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: ChangeFollowRequest): Promise<ChangeFollowResponse> => {
    const followService = new FollowService();
    const [followerCount, followeeCount] = await followService.follow(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount,
    }
}