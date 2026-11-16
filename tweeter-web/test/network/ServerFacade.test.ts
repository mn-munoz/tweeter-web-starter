// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { AuthToken, RegisterRequest, User } from "tweeter-shared";
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

  
});
