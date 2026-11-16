// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import {
  AuthToken,
  FollowCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

// Integration tests: these call the deployed server, which is assumed to be using FakeData.
describe("ServerFacade", () => {
  let serverFacade: ServerFacade;

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  describe("register", () => {
    const request: RegisterRequest = {
      firstName: "Test",
      lastName: "User",
      alias: "@testuser",
      password: "password",
      userImageBytes: "AQIDBA==", // base64 of the bytes [1, 2, 3, 4]
      imageFileExtension: "png",
    };

    it("returns Allen Anderson as the registered user", async () => {
      const [user] = await serverFacade.register(request);

      expect(user).toBeInstanceOf(User);
      expect(user.firstName).toBe("Allen");
      expect(user.lastName).toBe("Anderson");
      expect(user.name).toBe("Allen Anderson");
    });

    it("returns an auth token", async () => {
      const [, authToken] = await serverFacade.register(request);

      expect(authToken).toBeInstanceOf(AuthToken);
      expect(authToken.token.length).toBeGreaterThan(0);
    });
  });

  describe("getMoreFollowers", () => {
    const pageSize = 3;
    const firstPageRequest: PagedUserItemRequest = {
      token: "abc123",
      userAlias: "@allen",
      pageSize: pageSize,
      lastItem: null,
    };

    it("returns a non-empty page of users no larger than the page size", async () => {
      const [followers, hasMore] = await serverFacade.getMoreFollowers(firstPageRequest);

      expect(followers.length).toBeGreaterThan(0);
      expect(followers.length).toBeLessThanOrEqual(pageSize);
      expect(typeof hasMore).toBe("boolean");
      for (const follower of followers) {
        expect(follower).toBeInstanceOf(User);
        expect(follower.alias.length).toBeGreaterThan(0);
        expect(follower.firstName.length).toBeGreaterThan(0);
        expect(follower.lastName.length).toBeGreaterThan(0);
      }
    });

    it("returns a next page that starts after the last item of the previous page", async () => {
      const [firstPage] = await serverFacade.getMoreFollowers(firstPageRequest);
      const lastItem = firstPage[firstPage.length - 1];

      const [secondPage] = await serverFacade.getMoreFollowers({
        ...firstPageRequest,
        lastItem: lastItem.dto,
      });

      const firstPageAliases = firstPage.map((user) => user.alias);
      for (const follower of secondPage) {
        expect(firstPageAliases).not.toContain(follower.alias);
      }
    });
  });

  describe("follow counts", () => {
    const countRequest: FollowCountRequest = {
      token: "abc123",
      userAlias: "@allen",
    };

    it("getFollowerCount returns a whole number greater than zero", async () => {
      const count = await serverFacade.getFollowerCount(countRequest);

      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThan(0);
    });

    it("getFolloweeCount returns a whole number that is not negative", async () => {
      const count = await serverFacade.getFolloweeCount(countRequest);

      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
