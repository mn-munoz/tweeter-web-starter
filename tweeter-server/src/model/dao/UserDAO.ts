// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<UserDto | null>;

  // Returns the users that exist for the given aliases (in any order).
  getUsers(aliases: string[]): Promise<UserDto[]>;

  getPasswordHash(alias: string): Promise<string | null>;

  createUser(user: UserDto, passwordHash: string): Promise<void>;

  getFollowerCount(alias: string): Promise<number>;

  getFolloweeCount(alias: string): Promise<number>;

  // Adds the deltas (which may be negative) to the user's stored counts.
  incrementCounts(alias: string, followerDelta: number, followeeDelta: number): Promise<void>;
}
