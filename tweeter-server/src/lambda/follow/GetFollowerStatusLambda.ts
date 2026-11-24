// AI-assisted: see AI-ATTRIBUTION.md
import { FollowStatusRequest, FollowStatusResponse } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { FollowService } from "../../model/service/FollowService";
import { withErrorMapping } from "../withErrorMapping";

export const handler = withErrorMapping(async (request: FollowStatusRequest): Promise<FollowStatusResponse> => {
    const followService = new FollowService(new DynamoDAOFactory());
    const isFollower = await followService.getIsFollowerStatus(request.token, request.userAlias, request.selectedUserAlias);

    return {
        success: true,
        message: null,
        isFollower: isFollower,
    }
});
