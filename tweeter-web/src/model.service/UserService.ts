// AI-assisted: see AI-ATTRIBUTION.md
import { Buffer } from "buffer";
import { AuthToken, User, FakeData, LoginRequest, LogoutRequest, RegisterRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
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
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias: alias,
      password: password,
    };
    return this.serverFacade.login(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };
    return this.serverFacade.register(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token,
    };
    return this.serverFacade.logout(request);
  }
}
