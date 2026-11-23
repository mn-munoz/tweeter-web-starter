// AI-assisted: see AI-ATTRIBUTION.md
import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { UserService } from "../../model/service/UserService";
import { withErrorMapping } from "../withErrorMapping";

export const handler = withErrorMapping(async (request: GetUserRequest): Promise<GetUserResponse> => {
    const userService = new UserService(new DynamoDAOFactory());
    const user = await userService.getUser(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        user: user,
    };
});
