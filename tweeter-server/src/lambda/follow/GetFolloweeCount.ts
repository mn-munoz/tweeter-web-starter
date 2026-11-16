// AI-assisted: see AI-ATTRIBUTION.md
import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleFollowCountRequest } from "./FollowCountHandler";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
    const followService = new FollowService();
    return handleFollowCountRequest(request, (token, userAlias) =>
        followService.getFolloweeCount(token, userAlias),
    );
};
