// AI-assisted: see AI-ATTRIBUTION.md
import { DAOFactory } from "../dao/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import { Service } from "./Service";

// Base class for services with operations that require a logged-in user.
// It owns the AuthorizationService so each service doesn't repeat that wiring.
export abstract class AuthorizedService implements Service {
  private readonly authorizationService: AuthorizationService;

  // authorizationService can be passed in (e.g. a mock in tests); by default
  // it is built from the same factory as the service's DAOs.
  protected constructor(
    daoFactory: DAOFactory,
    authorizationService: AuthorizationService = new AuthorizationService(daoFactory),
  ) {
    this.authorizationService = authorizationService;
  }

  // Returns the alias of the user who owns the token.
  // Throws an "[unauthorized]" error (401) if the token is missing, unknown or expired.
  protected authorize(token: string): Promise<string> {
    return this.authorizationService.authorize(token);
  }
}
