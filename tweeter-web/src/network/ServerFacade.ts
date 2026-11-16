// AI-assisted: see AI-ATTRIBUTION.md
import {
  FollowCountRequest,
  FollowCountResponse,
  PagedItemRequest,
  PagedItemResponse,
  PagedStatusItemRequest,
  PagedUserItemRequest,
  Status,
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

  // Posts a paged request, converts the returned DTOs to domain objects, and handles errors.
  private async getMoreItems<DTO, T>(
    request: PagedItemRequest<DTO>,
    endpoint: string,
    fromDto: (dto: DTO) => T | null,
    itemDescription: string,
  ): Promise<[T[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<DTO>,
      PagedItemResponse<DTO>
    >(request, endpoint);

    // Convert the DTO array returned by ClientCommunicator to a domain object array
    const items: T[] | null =
      response.success && response.items
        ? response.items.map((dto) => fromDto(dto) as T)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${itemDescription} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFolloweeCount(request: FollowCountRequest): Promise<number> {
    return this.getCount(request, "/follow/followees/count");
  }

  public async getFollowerCount(request: FollowCountRequest): Promise<number> {
    return this.getCount(request, "/follow/followers/count");
  }

  private async getCount(request: FollowCountRequest, endpoint:string): Promise<number> {
    const response = await this.clientCommunicator.doPost<FollowCountRequest, FollowCountResponse>(request, endpoint);

    // Handle errors
    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }
}
