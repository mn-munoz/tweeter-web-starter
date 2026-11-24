// AI-assisted: see AI-ATTRIBUTION.md
import { DataPage } from "./DataPage";

export interface FollowDAO {
  // Returns false (and changes nothing) if the follow already existed.
  putFollow(followerAlias: string, followeeAlias: string): Promise<boolean>;

  // Returns false (and changes nothing) if there was no such follow.
  deleteFollow(followerAlias: string, followeeAlias: string): Promise<boolean>;

  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;

  // Returns a page of aliases of the users that followerAlias follows.
  getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<DataPage<string>>;

  // Returns a page of aliases of the users that follow followeeAlias.
  getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<DataPage<string>>;

  // Returns every follower's alias (used to fan a new status out to feeds).
  getAllFollowers(followeeAlias: string): Promise<string[]>;
}
