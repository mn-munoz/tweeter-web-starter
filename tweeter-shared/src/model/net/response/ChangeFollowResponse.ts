import { TweeterResponse } from "./TweeterResponse";

export interface ChangeFollowResponse extends TweeterResponse {
    followerCount: number;
    followeeCount: number;
}