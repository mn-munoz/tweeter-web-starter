// AI-assisted: see AI-ATTRIBUTION.md
import { Buffer } from "buffer";
import { AuthToken, AuthTokenDto, User, UserDto, FakeData } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the database
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    // userImageBytes is a base64-encoded string sent by the client.
    // TODO: Replace with the result of calling the database
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async logout(token: string): Promise<void> {
    // TODO: Invalidate the auth token in the database
  }
}
