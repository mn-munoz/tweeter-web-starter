import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {

  private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

  public async loadMoreFollowees(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]>{
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  };

  public async loadMoreFollowers(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]>{
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  };

  public async getIsFollowerStatus(
    authToken: string,
    userAlias: string,
    selectedUserAlias: string,
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  public async getFolloweeCount(
    authToken: string,
    userAlias: string,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(userAlias);
  };

  public async getFollowerCount(
    authToken: string,
    userAlias: string,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(userAlias);
  };

  public async follow(
    authToken: string,
    userAliasToFollow: string,
  ): Promise<[followerCount: number, followeeCount: number]>{
    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userAliasToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userAliasToFollow);

    return [followerCount, followeeCount];
  };

  public async unfollow(
    authToken: string,
    userAliasToUnfollow: string,
  ): Promise<[followerCount: number, followeeCount: number]>{

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userAliasToUnfollow);
    const followeeCount = await this.getFolloweeCount(authToken, userAliasToUnfollow);

    return [followerCount, followeeCount];
  };
}
