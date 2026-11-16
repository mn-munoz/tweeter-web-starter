// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

// Not an AuthenticatedRequest: the user has no token until login succeeds.
export interface LoginRequest extends TweeterRequest {
    readonly alias: string;
    readonly password: string;
}
