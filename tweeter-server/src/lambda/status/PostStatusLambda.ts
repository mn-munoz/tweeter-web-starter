// AI-assisted: see AI-ATTRIBUTION.md
import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
    const statusService = new StatusService(new DynamoDAOFactory());
    await statusService.postStatus(request.token, request.newStatus);

    return {
        success: true,
        message: null,
    };
}
