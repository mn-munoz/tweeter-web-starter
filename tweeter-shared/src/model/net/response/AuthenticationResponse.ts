// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

// Response for endpoints that authenticate a user (register, and later login).
export interface AuthenticationResponse extends TweeterResponse {
    readonly user: UserDto;
    readonly authToken: AuthTokenDto;
}
