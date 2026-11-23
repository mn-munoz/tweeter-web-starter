// AI-assisted: see AI-ATTRIBUTION.md
import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { FollowService } from "../../model/service/FollowService";
import { handleFollowCountRequest } from "./FollowCountHandler";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
    const followService = new FollowService(new DynamoDAOFactory());
    return handleFollowCountRequest(request, (token, userAlias) =>
        followService.getFollowerCount(token, userAlias),
    );
};
