// AI-assisted: see AI-ATTRIBUTION.md
import { AuthenticatedRequest } from "./AuthenticatedRequest";

// Logout only needs the auth token being invalidated.
export type LogoutRequest = AuthenticatedRequest;
