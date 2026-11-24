// AI-assisted: see AI-ATTRIBUTION.md
import bcrypt from "bcryptjs";
import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { DAOFactory } from "../dao/DAOFactory";
import { ImageDAO } from "../dao/ImageDAO";
import { UserDAO } from "../dao/UserDAO";
import { AuthorizationService } from "./AuthorizationService";
import { AuthorizedService } from "./AuthorizedService";
import { badRequest } from "./ServiceErrors";

const SALT_ROUNDS = 10;

export class UserService extends AuthorizedService {
  private readonly userDAO: UserDAO;
  private readonly authTokenDAO: AuthTokenDAO;
  private readonly imageDAO: ImageDAO;

  // authorizationService is optional (see AuthorizedService).
  public constructor(
    daoFactory: DAOFactory,
    authorizationService?: AuthorizationService,
  ) {
    super(daoFactory, authorizationService);
    this.userDAO = daoFactory.getUserDAO();
    this.authTokenDAO = daoFactory.getAuthTokenDAO();
    this.imageDAO = daoFactory.getImageDAO();
  }

  // Returns null if no user has the alias (the client then stays on the current page).
  public async getUser(
    token: string,
    alias: string,
  ): Promise<UserDto | null> {
    await this.authorize(token);
    return this.userDAO.getUser(this.normalizeAlias(alias ?? ""));
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    alias = this.normalizeAlias(alias ?? "");
    if (alias === "@" || !password) {
      throw badRequest("Alias and password are required");
    }

    // Same message for an unknown alias and a wrong password, so the
    // response doesn't reveal which aliases exist.
    const passwordHash = await this.userDAO.getPasswordHash(alias);
    if (passwordHash === null || !(await bcrypt.compare(password, passwordHash))) {
      throw badRequest("Invalid alias or password");
    }

    const user = await this.userDAO.getUser(alias);
    if (user === null) {
      throw badRequest("Invalid alias or password");
    }

    return [user, await this.startSession(alias)];
  }

  // Creates and stores a new auth token for the user.
  private async startSession(alias: string): Promise<AuthTokenDto> {
    const authToken = AuthToken.Generate().dto;
    await this.authTokenDAO.create(authToken, alias);
    return authToken;
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
    alias = this.normalizeAlias(alias ?? "");
    if (!firstName || !lastName || alias === "@" || !password || !userImageBytes || !imageFileExtension) {
      throw badRequest("All registration fields are required");
    }

    // Check first so we don't upload an image for an alias that is taken.
    if ((await this.userDAO.getUser(alias)) !== null) {
      throw badRequest(`Alias ${alias} is already taken`);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const imageUrl = await this.imageDAO.putImage(
      this.imageFileName(alias, imageFileExtension),
      userImageBytes,
    );

    const user: UserDto = { firstName, lastName, alias, imageUrl };
    // createUser also refuses duplicates, in case two registrations race.
    if (!(await this.userDAO.createUser(user, passwordHash))) {
      throw badRequest(`Alias ${alias} is already taken`);
    }

    return [user, await this.startSession(alias)];
  }

  // Aliases are stored with a leading "@" (mentions and navigation rely on it),
  // so "bob", " bob " and "@bob" all become "@bob".
  private normalizeAlias(alias: string): string {
    const trimmed = alias.trim();
    return trimmed.startsWith("@") ? trimmed : "@" + trimmed;
  }

  // S3 key for a user's profile image, e.g. "@bob" + "png" -> "bob.png".
  private imageFileName(alias: string, extension: string): string {
    const safeAlias = alias.replace(/^@/, "").replace(/[^A-Za-z0-9_-]/g, "_");
    return `${safeAlias}.${extension.replace(/^\./, "")}`;
  }

  // Deleting the token ends the session. Logging out with a token that is
  // already gone (expired, or logged out in another tab) still succeeds.
  public async logout(token: string): Promise<void> {
    if (!token) {
      throw badRequest("An auth token is required to log out");
    }
    await this.authTokenDAO.delete(token);
  }
}
