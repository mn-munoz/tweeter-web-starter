// AI-assisted: see AI-ATTRIBUTION.md
import { User, FakeData, UserDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { UserDAO } from "../dao/UserDAO";
import { AuthorizationService } from "./AuthorizationService";
import { Service } from "./Service";

export class FollowService implements Service {
  private readonly userDAO: UserDAO;
  private readonly authorizationService: AuthorizationService;

  // authorizationService can be passed in (e.g. a mock in tests); by default
  // it is built from the same factory.
  public constructor(
    daoFactory: DAOFactory,
    authorizationService: AuthorizationService = new AuthorizationService(daoFactory),
  ) {
    this.userDAO = daoFactory.getUserDAO();
    this.authorizationService = authorizationService;
  }

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

  // The count is stored on the user's item and kept up to date by follow/unfollow.
  public async getFolloweeCount(
    authToken: string,
    userAlias: string,
  ): Promise<number> {
    await this.authorizationService.authorize(authToken);
    return this.userDAO.getFolloweeCount(userAlias);
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
