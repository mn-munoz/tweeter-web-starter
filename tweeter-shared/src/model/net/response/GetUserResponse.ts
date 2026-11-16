// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

// Response for the get user endpoint. user is null when no user has the requested alias.
export interface GetUserResponse extends TweeterResponse {
    readonly user: UserDto | null;
}
