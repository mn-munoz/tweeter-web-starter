// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

// Not an AuthenticatedRequest: the user has no token until registration succeeds.
export interface RegisterRequest extends TweeterRequest {
    readonly firstName: string;
    readonly lastName: string;
    readonly alias: string;
    readonly password: string;
    // Base64-encoded image bytes (a Uint8Array does not survive JSON serialization).
    readonly userImageBytes: string;
    readonly imageFileExtension: string;
}
