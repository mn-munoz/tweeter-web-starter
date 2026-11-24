// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { DataPage } from "../dao/DataPage";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDAO } from "../dao/UserDAO";
import { AuthorizationService } from "./AuthorizationService";
import { Service } from "./Service";
import { badRequest } from "./ServiceErrors";

export class FollowService implements Service {
  private readonly userDAO: UserDAO;
  private readonly followDAO: FollowDAO;
  private readonly authorizationService: AuthorizationService;

  // authorizationService can be passed in (e.g. a mock in tests); by default
  // it is built from the same factory.
  public constructor(
    daoFactory: DAOFactory,
    authorizationService: AuthorizationService = new AuthorizationService(daoFactory),
  ) {
    this.userDAO = daoFactory.getUserDAO();
    this.followDAO = daoFactory.getFollowDAO();
    this.authorizationService = authorizationService;
  }

  // Shared by the followees and followers lists: authorizes, loads a page of
  // aliases with pageFunction, then loads those users (in the same order).
  private async loadUserPage(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    pageFunction: (alias: string, pageSize: number, lastAlias: string | null) => Promise<DataPage<string>>,
  ): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(authToken);
    const page = await pageFunction(userAlias, pageSize, lastItem?.alias ?? null);
    const users = await this.userDAO.getUsers(page.items);
    return [users, page.hasMore];
  }

  private async getCount(authToken: string, userAlias: string, countFunction: (alias: string) => Promise<number>): Promise<number> {
    await this.authorizationService.authorize(authToken);
    return countFunction(userAlias);
  }

  // A user's [followerCount, followeeCount], without re-authorizing.
  private async getCountsOf(alias: string): Promise<[followerCount: number, followeeCount: number]> {
    const followerCount = await this.userDAO.getFollowerCount(alias);
    const followeeCount = await this.userDAO.getFolloweeCount(alias);
    return [followerCount, followeeCount];
  }

  public async loadMoreFollowees(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]>{
    return this.loadUserPage(authToken, userAlias, pageSize, lastItem, (alias, size, lastAlias) =>
      this.followDAO.getPageOfFollowees(alias, size, lastAlias),
    );
  };

  public async loadMoreFollowers(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]>{
    return this.loadUserPage(authToken, userAlias, pageSize, lastItem, (alias, size, lastAlias) =>
      this.followDAO.getPageOfFollowers(alias, size, lastAlias),
    );
  };

  // Whether userAlias (the logged-in user) follows selectedUserAlias (the displayed user).
  public async getIsFollowerStatus(
    authToken: string,
    userAlias: string,
    selectedUserAlias: string,
  ): Promise<boolean> {
    await this.authorizationService.authorize(authToken);
    return this.followDAO.isFollower(userAlias, selectedUserAlias);
  };

  // The count is stored on the user's item and kept up to date by follow/unfollow.
  public async getFolloweeCount(
    authToken: string,
    userAlias: string,
  ): Promise<number> {
    return this.getCount(authToken, userAlias, (alias) => this.userDAO.getFolloweeCount(alias));
  };

  public async getFollowerCount(
    authToken: string,
    userAlias: string,
  ): Promise<number> {
    return this.getCount(authToken, userAlias, (alias) => this.userDAO.getFollowerCount(alias));
  };

  // The logged-in user (from the token, not the request) follows userAliasToFollow.
  // Returns the followed user's new counts, which the client displays.
  public async follow(
    authToken: string,
    userAliasToFollow: string,
  ): Promise<[followerCount: number, followeeCount: number]>{
    return this.changeFollow(authToken, userAliasToFollow, 1, (follower, followee) =>
      this.followDAO.putFollow(follower, followee),
    );
  };

  // The logged-in user stops following userAliasToUnfollow.
  // Returns the unfollowed user's new counts, which the client displays.
  public async unfollow(
    authToken: string,
    userAliasToUnfollow: string,
  ): Promise<[followerCount: number, followeeCount: number]>{
    return this.changeFollow(authToken, userAliasToUnfollow, -1, (follower, followee) =>
      this.followDAO.deleteFollow(follower, followee),
    );
  };

  // Shared by follow and unfollow. changeRow adds or deletes the follow row and
  // returns whether anything changed; only then are both users' counts moved by
  // delta (+1 or -1), so a double click can't count twice.
  private async changeFollow(
    authToken: string,
    targetAlias: string,
    delta: number,
    changeRow: (followerAlias: string, followeeAlias: string) => Promise<boolean>,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentAlias = await this.authorizationService.authorize(authToken);

    if (currentAlias === targetAlias) {
      throw badRequest("You cannot follow or unfollow yourself");
    }
    if ((await this.userDAO.getUser(targetAlias)) === null) {
      throw badRequest(`User ${targetAlias} does not exist`);
    }

    if (await changeRow(currentAlias, targetAlias)) {
      await this.userDAO.incrementCounts(currentAlias, 0, delta);  // current user's followees
      await this.userDAO.incrementCounts(targetAlias, delta, 0);   // target user's followers
    }

    return this.getCountsOf(targetAlias);
  }
}
