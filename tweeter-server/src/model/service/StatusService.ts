// AI-assisted: see AI-ATTRIBUTION.md
import { Status, FakeData, StatusDto, UserDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { StatusDAO, StoredStatus } from "../dao/StatusDAO";
import { UserDAO } from "../dao/UserDAO";
import { AuthorizationService } from "./AuthorizationService";
import { AuthorizedService } from "./AuthorizedService";
import { badRequest, unauthorized } from "./ServiceErrors";

export class StatusService extends AuthorizedService {
  private readonly userDAO: UserDAO;
  private readonly storyDAO: StatusDAO;
  private readonly feedDAO: StatusDAO;
  private readonly followDAO: FollowDAO;

  // authorizationService is optional (see AuthorizedService).
  public constructor(
    daoFactory: DAOFactory,
    authorizationService?: AuthorizationService,
  ) {
    super(daoFactory, authorizationService);
    this.userDAO = daoFactory.getUserDAO();
    this.storyDAO = daoFactory.getStoryDAO();
    this.feedDAO = daoFactory.getFeedDAO();
    this.followDAO = daoFactory.getFollowDAO();
  }

  private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
      const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
      const dtos = items.map((status) => status.dto);
      return [dtos, hasMore];
  }

  // Shared by the story and feed lists: authorizes, loads a page of stored
  // statuses from statusDAO, then attaches each status's author.
  private async loadStatusPage(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
    statusDAO: StatusDAO,
  ): Promise<[StatusDto[], boolean]> {
    await this.authorize(authToken);
    const page = await statusDAO.getPage(userAlias, pageSize, lastItem?.timestamp ?? null);

    // One batch read for all authors on the page (a story has just one).
    const authors = await this.userDAO.getUsers(page.items.map((status) => status.authorAlias));
    const authorsByAlias = new Map<string, UserDto>(authors.map((user) => [user.alias, user]));

    const statuses: StatusDto[] = [];
    for (const stored of page.items) {
      const author = authorsByAlias.get(stored.authorAlias);
      if (author !== undefined) {
        statuses.push({ post: stored.post, user: author, timestamp: stored.timestamp });
      }
    }
    return [statuses, page.hasMore];
  }

  public async loadMoreFeedItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return this.loadStatusPage(authToken, userAlias, pageSize, lastItem, this.storyDAO);
  }

  public async postStatus(
    authToken: string,
    newStatus: StatusDto,
  ): Promise<void> {
    const currentAlias = await this.authorize(authToken);

    // Users may only post as themselves.
    if (newStatus?.user?.alias !== currentAlias) {
      throw unauthorized("You can only post statuses as yourself");
    }
    if (!newStatus.post || newStatus.post.trim() === "") {
      throw badRequest("A status cannot be empty");
    }
    if (typeof newStatus.timestamp !== "number") {
      throw badRequest("A status needs a numeric timestamp");
    }

    const stored: StoredStatus = {
      post: newStatus.post,
      authorAlias: currentAlias,
      timestamp: newStatus.timestamp,
    };
    await this.storyDAO.put(currentAlias, stored);
    await this.fanOutToFeeds(currentAlias, stored);
  }

  // Precomputes feeds: writes the new status into the feed of every user who
  // follows the author, so reading a feed is a single query. Kept separate so
  // Part B can move it to a queue without changing postStatus.
  private async fanOutToFeeds(authorAlias: string, status: StoredStatus): Promise<void> {
    const followers = await this.followDAO.getAllFollowers(authorAlias);
    if (followers.length > 0) {
      await this.feedDAO.batchPut(followers, status);
    }
  }
}
