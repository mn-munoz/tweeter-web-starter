// AI-assisted: see AI-ATTRIBUTION.md
import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";

// Loads a follow count (followers or followees) for a user from a service.
export type LoadCount = (token: string, userAlias: string) => Promise<number>;

// Shared logic for lambdas that return a follow count (followee count, follower count).
export const handleFollowCountRequest = async (
    request: FollowCountRequest,
    loadCount: LoadCount,
): Promise<FollowCountResponse> => {
    const count = await loadCount(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        count: count,
    };
};
