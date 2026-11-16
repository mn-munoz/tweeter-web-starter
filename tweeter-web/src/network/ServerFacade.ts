// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  AuthenticationResponse,
  ChangeFollowRequest,
  ChangeFollowResponse,
  FollowCountRequest,
  FollowCountResponse,
  FollowStatusRequest,
  FollowStatusResponse,
  PagedItemRequest,
  PagedItemResponse,
  PagedStatusItemRequest,
  PagedUserItemRequest,
  LoginRequest,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  Status,
  TweeterRequest,
  TweeterResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://kgipwcic95.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    return this.getMoreItems(request, "/follow/followees/list", User.fromDto, "followees");
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    return this.getMoreItems(request, "/follow/followers/list", User.fromDto, "followers");
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    return this.getMoreItems(request, "/status/feed/list", Status.fromDto, "feed posts");
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    return this.getMoreItems(request, "/status/story/list", Status.fromDto, "story posts");
  }

  public async getFolloweeCount(request: FollowCountRequest): Promise<number> {
    return this.getCount(request, "/follow/followees/count");
  }

  public async getFollowerCount(request: FollowCountRequest): Promise<number> {
    return this.getCount(request, "/follow/followers/count");
  }

  public async getIsFollowerStatus(request: FollowStatusRequest): Promise<boolean> {
    const response = await this.post<FollowStatusRequest, FollowStatusResponse>(request, "/follow/followers/status");
    return response.isFollower;
  }

  public async follow(request: ChangeFollowRequest): Promise<[followerCount: number, followeeCount: number]> {
    return this.changeFollow(request, "/follow/followees/add");
  }

  public async unfollow(request: ChangeFollowRequest): Promise<[followerCount: number, followeeCount: number]> {
    return this.changeFollow(request, "/follow/followees/remove");
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    return this.authenticate(request, "/auth/user/register", "Invalid registration");
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    return this.authenticate(request, "/auth/user/login", "Invalid alias or password");
  }

  public async logout(request: LogoutRequest): Promise<void> {
    await this.post<LogoutRequest, LogoutResponse>(request, "/auth/user/logout");
  }

  // Posts a request and returns the response, logging and throwing the server's message if it was unsuccessful.
  private async post<REQ extends TweeterRequest, RES extends TweeterResponse>(
    request: REQ,
    endpoint: string,
  ): Promise<RES> {
    const response = await this.clientCommunicator.doPost<REQ, RES>(request, endpoint);

    // Handle errors
    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    return response;
  }

  // Posts a paged request and converts the returned DTOs to domain objects.
  private async getMoreItems<DTO, T>(
    request: PagedItemRequest<DTO>,
    endpoint: string,
    fromDto: (dto: DTO) => T | null,
    itemDescription: string,
  ): Promise<[T[], boolean]> {
    const response = await this.post<PagedItemRequest<DTO>, PagedItemResponse<DTO>>(request, endpoint);

    // Convert the DTO array returned by ClientCommunicator to a domain object array
    const items: T[] | null = response.items
      ? response.items.map((dto) => fromDto(dto) as T)
      : null;

    if (items == null) {
      throw new Error(`No ${itemDescription} found`);
    }

    return [items, response.hasMore];
  }

  private async getCount(request: FollowCountRequest, endpoint: string): Promise<number> {
    const response = await this.post<FollowCountRequest, FollowCountResponse>(request, endpoint);
    return response.count;
  }

  private async changeFollow(request: ChangeFollowRequest, endpoint: string): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.post<ChangeFollowRequest, ChangeFollowResponse>(request, endpoint);
    return [response.followerCount, response.followeeCount];
  }

  // Posts a register or login request and converts the returned DTOs to domain objects.
  private async authenticate<REQ extends TweeterRequest>(
    request: REQ,
    endpoint: string,
    invalidMessage: string,
  ): Promise<[User, AuthToken]> {
    const response = await this.post<REQ, AuthenticationResponse>(request, endpoint);

    // Convert the DTOs returned by ClientCommunicator to domain objects
    const user: User | null = User.fromDto(response.user);
    const authToken: AuthToken | null = AuthToken.fromDto(response.authToken);

    if (user == null || authToken == null) {
      throw new Error(invalidMessage);
    }

    return [user, authToken];
  }
}
