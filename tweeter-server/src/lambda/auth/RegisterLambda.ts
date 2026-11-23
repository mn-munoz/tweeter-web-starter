// AI-assisted: see AI-ATTRIBUTION.md
import { AuthenticationResponse, RegisterRequest } from "tweeter-shared";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { UserService } from "../../model/service/UserService";
import { withErrorMapping } from "../withErrorMapping";

export const handler = withErrorMapping(async (request: RegisterRequest): Promise<AuthenticationResponse> => {
    const userService = new UserService(new DynamoDAOFactory());
    const [user, authToken] = await userService.register(
        request.firstName,
        request.lastName,
        request.alias,
        request.password,
        request.userImageBytes,
        request.imageFileExtension,
    );

    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken,
    };
});
