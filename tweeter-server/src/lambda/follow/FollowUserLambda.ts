// AI-assisted: see AI-ATTRIBUTION.md
import { ChangeFollowRequest, ChangeFollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleChangeFollowRequest } from "./ChangeFollowHandler";

export const handler = async (request: ChangeFollowRequest): Promise<ChangeFollowResponse> => {
    const followService = new FollowService();
    return handleChangeFollowRequest(request, (token, userAlias) =>
        followService.follow(token, userAlias),
    );
}