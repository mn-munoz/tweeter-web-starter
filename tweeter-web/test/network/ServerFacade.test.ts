// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import {
  AuthToken,
  FollowCountRequest,
  PagedUserItemRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import {
  INTEGRATION_TIMEOUT_MS,
  TestSession,
  addFollowers,
  logoutAll,
  registerRequest,
  registerTestUser,
  uniqueAlias,
} from "./integrationTestData";

// Integration tests: these call the deployed server and its real database.
// beforeAll creates the data the tests need (a user with followers), using
// fresh aliases on every run.
jest.setTimeout(INTEGRATION_TIMEOUT_MS);

const FOLLOWER_COUNT = 4;

describe("ServerFacade", () => {
  const serverFacade = new ServerFacade();
  const sessions: TestSession[] = [];
  let mainUser: TestSession;

  beforeAll(async () => {
    mainUser = await registerTestUser(serverFacade, "main");
    sessions.push(mainUser);
    sessions.push(...(await addFollowers(serverFacade, mainUser.user, FOLLOWER_COUNT)));
  });

  afterAll(async () => {
    await logoutAll(serverFacade, sessions);
  });

  describe("register", () => {
    const alias = uniqueAlias("register");
    const request = registerRequest(alias, "Allen", "Anderson");
    let registeredUser: User;
    let authToken: AuthToken;

    beforeAll(async () => {
      [registeredUser, authToken] = await serverFacade.register(request);
      sessions.push({ user: registeredUser, authToken });
    });

    it("returns the registered user", () => {
      expect(registeredUser).toBeInstanceOf(User);
      expect(registeredUser.alias).toBe(alias);
      expect(registeredUser.firstName).toBe("Allen");
      expect(registeredUser.lastName).toBe("Anderson");
      expect(registeredUser.name).toBe("Allen Anderson");
      expect(registeredUser.imageUrl.length).toBeGreaterThan(0);
    });

    it("returns an auth token", () => {
      expect(authToken).toBeInstanceOf(AuthToken);
      expect(authToken.token.length).toBeGreaterThan(0);
    });

    it("rejects an alias that is already taken", async () => {
      await expect(serverFacade.register(request)).rejects.toThrow("already taken");
    });
  });

  describe("getMoreFollowers", () => {
    const pageSize = 3;
    let firstPageRequest: PagedUserItemRequest;

    beforeAll(() => {
      firstPageRequest = {
        token: mainUser.authToken.token,
        userAlias: mainUser.user.alias,
        pageSize: pageSize,
        lastItem: null,
      };
    });

    it("returns a full first page of users and reports that there are more", async () => {
      const [followers, hasMore] = await serverFacade.getMoreFollowers(firstPageRequest);

      expect(followers.length).toBe(pageSize);
      expect(hasMore).toBe(true);
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

      expect(secondPage.length).toBe(FOLLOWER_COUNT - pageSize);
      const firstPageAliases = firstPage.map((user) => user.alias);
      for (const follower of secondPage) {
        expect(firstPageAliases).not.toContain(follower.alias);
      }
    });

    it("rejects an invalid auth token", async () => {
      await expect(
        serverFacade.getMoreFollowers({ ...firstPageRequest, token: "not-a-real-token" }),
      ).rejects.toThrow("unauthorized");
    });
  });

  describe("follow counts", () => {
    let countRequest: FollowCountRequest;

    beforeAll(() => {
      countRequest = {
        token: mainUser.authToken.token,
        userAlias: mainUser.user.alias,
      };
    });

    it("getFollowerCount returns the number of followers", async () => {
      const count = await serverFacade.getFollowerCount(countRequest);

      expect(count).toBe(FOLLOWER_COUNT);
    });

    it("getFolloweeCount returns zero for a user who follows no one", async () => {
      const count = await serverFacade.getFolloweeCount(countRequest);

      expect(count).toBe(0);
    });
  });
});
