// AI-assisted: see AI-ATTRIBUTION.md
import { AuthenticationResponse, LoginRequest } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { UserService } from "../../model/service/UserService";
import { withErrorMapping } from "../withErrorMapping";

export const handler = withErrorMapping(async (request: LoginRequest): Promise<AuthenticationResponse> => {
    const userService = new UserService(new DynamoDAOFactory());
    const [user, authToken] = await userService.login(request.alias, request.password);

    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken,
    };
});
