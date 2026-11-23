// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { DAOFactory } from "../dao/DAOFactory";
import { unauthorized } from "./ServiceErrors";

// A session ends after this long without any request.
export const SESSION_IDLE_TIMEOUT_MS = 60 * 60 * 1000;

// Checks auth tokens for every service operation that requires a logged-in user.
export class AuthorizationService {
  private readonly authTokenDAO: AuthTokenDAO;

  public constructor(daoFactory: DAOFactory) {
    this.authTokenDAO = daoFactory.getAuthTokenDAO();
  }

  // Returns the alias of the user who owns the token, and extends the session.
  // Throws an "[unauthorized]" error (401) if the token is missing, unknown or expired.
  public async authorize(token: string): Promise<string> {
    if (!token) {
      throw unauthorized("An auth token is required");
    }

    const session = await this.authTokenDAO.get(token);
    if (session === null) {
      throw unauthorized("Invalid auth token, please log in again");
    }

    const now = Date.now();
    if (now - session.lastUsed > SESSION_IDLE_TIMEOUT_MS) {
      await this.authTokenDAO.delete(token);
      throw unauthorized("Session expired, please log in again");
    }

    await this.authTokenDAO.touch(token, now);
    return session.alias;
  }
}
