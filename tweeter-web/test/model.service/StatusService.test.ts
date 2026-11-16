// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

// Integration test: the real StatusService calls the deployed server, which is assumed to be using FakeData.
describe("StatusService", () => {
  let statusService: StatusService;
  const authToken = new AuthToken("abc123", Date.now());
  const userAlias = "@allen";
  const pageSize = 3;

  beforeEach(() => {
    statusService = new StatusService();
  });

  describe("loadMoreStoryItems", () => {
    it("returns a non-empty page of statuses no larger than the page size", async () => {
      const [story, hasMore] = await statusService.loadMoreStoryItems(
        authToken,
        userAlias,
        pageSize,
        null,
      );

      expect(story.length).toBeGreaterThan(0);
      expect(story.length).toBeLessThanOrEqual(pageSize);
      expect(typeof hasMore).toBe("boolean");
      for (const status of story) {
        expect(status).toBeInstanceOf(Status);
        expect(status.post.length).toBeGreaterThan(0);
        expect(status.user).toBeInstanceOf(User);
        expect(status.user.alias.length).toBeGreaterThan(0);
        expect(typeof status.timestamp).toBe("number");
      }
    });

    it("returns a next page that starts after the last item of the previous page", async () => {
      const [firstPage] = await statusService.loadMoreStoryItems(
        authToken,
        userAlias,
        pageSize,
        null,
      );
      const lastItem = firstPage[firstPage.length - 1];

      const [secondPage] = await statusService.loadMoreStoryItems(
        authToken,
        userAlias,
        pageSize,
        lastItem,
      );

      for (const status of secondPage) {
        expect(firstPage.some((previous) => previous.equals(status))).toBe(false);
      }
    });
  });
});
