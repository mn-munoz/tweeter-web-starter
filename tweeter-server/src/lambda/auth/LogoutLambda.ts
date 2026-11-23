// AI-assisted: see AI-ATTRIBUTION.md
import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { UserService } from "../../model/service/UserService";
import { withErrorMapping } from "../withErrorMapping";

export const handler = withErrorMapping(async (request: LogoutRequest): Promise<LogoutResponse> => {
    const userService = new UserService(new DynamoDAOFactory());
    await userService.logout(request.token);

    return {
        success: true,
        message: null,
    };
});
