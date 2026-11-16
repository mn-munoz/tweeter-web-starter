import { FollowStatusRequest, FollowStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowStatusRequest): Promise<FollowStatusResponse> => {
    const followService = new FollowService();
    const isFollower = await followService.getIsFollowerStatus(request.token, request.userAlias, request.selectedUserAlias);

    return {
        success: true,
        message: null,
        isFollower: isFollower,
    }
}