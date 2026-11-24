// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";
import { ServerFacade } from "../../src/network/ServerFacade";
import {
  INTEGRATION_TIMEOUT_MS,
  TestSession,
  logoutAll,
  postStatuses,
  registerTestUser,
} from "../network/integrationTestData";

// Integration test: the real StatusService calls the deployed server and its
// real database. beforeAll registers a fresh user and posts to their story.
jest.setTimeout(INTEGRATION_TIMEOUT_MS);

const STATUS_COUNT = 4;

describe("StatusService", () => {
  const serverFacade = new ServerFacade();
  const pageSize = 3;
  let session: TestSession;
  let statusService: StatusService;

  beforeAll(async () => {
    session = await registerTestUser(serverFacade, "story");
    await postStatuses(serverFacade, session, STATUS_COUNT);
  });

  afterAll(async () => {
    await logoutAll(serverFacade, [session]);
  });

  beforeEach(() => {
    statusService = new StatusService();
  });

  describe("loadMoreStoryItems", () => {
    it("returns a full first page of statuses and reports that there are more", async () => {
      const [story, hasMore] = await statusService.loadMoreStoryItems(
        session.authToken,
        session.user.alias,
        pageSize,
        null,
      );

      expect(story.length).toBe(pageSize);
      expect(hasMore).toBe(true);
      for (const status of story) {
        expect(status).toBeInstanceOf(Status);
        expect(status.post.length).toBeGreaterThan(0);
        expect(status.user).toBeInstanceOf(User);
        expect(status.user.alias).toBe(session.user.alias);
        expect(typeof status.timestamp).toBe("number");
      }
    });

    it("returns statuses newest first", async () => {
      const [story] = await statusService.loadMoreStoryItems(
        session.authToken,
        session.user.alias,
        pageSize,
        null,
      );

      for (let i = 1; i < story.length; i++) {
        expect(story[i - 1].timestamp).toBeGreaterThan(story[i].timestamp);
      }
    });

    it("returns a next page that starts after the last item of the previous page", async () => {
      const [firstPage] = await statusService.loadMoreStoryItems(
        session.authToken,
        session.user.alias,
        pageSize,
        null,
      );
      const lastItem = firstPage[firstPage.length - 1];

      const [secondPage] = await statusService.loadMoreStoryItems(
        session.authToken,
        session.user.alias,
        pageSize,
        lastItem,
      );

      expect(secondPage.length).toBe(STATUS_COUNT - pageSize);
      for (const status of secondPage) {
        expect(firstPage.some((previous) => previous.equals(status))).toBe(false);
      }
    });
  });
});
