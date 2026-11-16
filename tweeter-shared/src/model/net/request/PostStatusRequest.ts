// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "../../dto/StatusDto";
import { AuthenticatedRequest } from "./AuthenticatedRequest";

// Post status needs the auth token and the status being added to the user's story.
export interface PostStatusRequest extends AuthenticatedRequest {
    readonly newStatus: StatusDto;
}
