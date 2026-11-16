// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, Status, FakeData, PostStatusRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  private _serverFacade: ServerFacade | null = null;

  // Factory method so tests can override it to supply a mock ServerFacade.
  protected createServerFacade(): ServerFacade {
    return new ServerFacade();
  }

  protected get serverFacade(): ServerFacade {
    if (this._serverFacade === null) {
      this._serverFacade = this.createServerFacade();
    }
    return this._serverFacade;
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreFeedItems({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    });
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getMoreStoryItems({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    });
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    const request: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus.dto,
    };
    return this.serverFacade.postStatus(request);
  }
}
