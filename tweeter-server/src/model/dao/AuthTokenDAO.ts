// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDto } from "tweeter-shared";

// A stored session: which user owns the token and when it was last used.
export interface Session {
  readonly alias: string;
  readonly lastUsed: number;
}

export interface AuthTokenDAO {
  create(authToken: AuthTokenDto, alias: string): Promise<void>;

  get(token: string): Promise<Session | null>;

  // Records that the token was used at the given time (milliseconds since epoch).
  touch(token: string, now: number): Promise<void>;

  delete(token: string): Promise<void>;
}
