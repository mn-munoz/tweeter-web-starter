// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDto, UserDto, FakeData } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
  public async getUser(
    token: string,
    alias: string,
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling the database
    const user = FakeData.instance.findUserByAlias(alias);
    return user === null ? null : user.dto;
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
