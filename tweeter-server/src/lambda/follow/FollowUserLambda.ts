// AI-assisted: see AI-ATTRIBUTION.md
import { ChangeFollowRequest, ChangeFollowResponse } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { FollowService } from "../../model/service/FollowService";
import { withErrorMapping } from "../withErrorMapping";
import { handleChangeFollowRequest } from "./ChangeFollowHandler";

export const handler = withErrorMapping(async (request: ChangeFollowRequest): Promise<ChangeFollowResponse> => {
    const followService = new FollowService(new DynamoDAOFactory());
    return handleChangeFollowRequest(request, (token, userAlias) =>
        followService.follow(token, userAlias),
    );
});
