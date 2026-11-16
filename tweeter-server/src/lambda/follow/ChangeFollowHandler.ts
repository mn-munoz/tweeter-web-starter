import { ChangeFollowRequest, ChangeFollowResponse } from "tweeter-shared";

export type ChangeFollow = (token: string, userAlias: string) => Promise<[followerCount: number, followeeCount: number]>;

export const handleChangeFollowRequest = async (
    request: ChangeFollowRequest,
    changeFollow: ChangeFollow,
): Promise<ChangeFollowResponse> => {
    const [followerCount, followeeCount] = await changeFollow(request.token, request.userAlias);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount,
    };
}