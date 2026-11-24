// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, RegisterRequest, Status, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

// Helpers for the integration tests, which call the deployed server and its
// real database. Each test run registers its own users with unique aliases, so
// the tests never depend on (or collide with) data left by earlier runs.

// Network calls to the deployed server (including cold starts) can be slow.
export const INTEGRATION_TIMEOUT_MS = 60_000;

export interface TestSession {
  user: User;
  authToken: AuthToken;
}

// A new alias on every call, e.g. "@it_main_lzx3k9_ab12".
export function uniqueAlias(label: string): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 6);
  return `@it_${label}_${time}_${random}`;
}

export function registerRequest(alias: string, firstName: string, lastName: string): RegisterRequest {
  return {
    firstName,
    lastName,
    alias,
    password: "password",
    userImageBytes: "AQIDBA==", // base64 of the bytes [1, 2, 3, 4]
    imageFileExtension: "png",
  };
}

export async function registerTestUser(
  serverFacade: ServerFacade,
  label: string,
): Promise<TestSession> {
  const [user, authToken] = await serverFacade.register(
    registerRequest(uniqueAlias(label), "Test", label),
  );
  return { user, authToken };
}

// Registers followerCount new users and has each of them follow followee.
export async function addFollowers(
  serverFacade: ServerFacade,
  followee: User,
  followerCount: number,
): Promise<TestSession[]> {
  const followers: TestSession[] = [];
  for (let i = 0; i < followerCount; i++) {
    const follower = await registerTestUser(serverFacade, `follower${i}`);
    await serverFacade.follow({ token: follower.authToken.token, userAlias: followee.alias });
    followers.push(follower);
  }
  return followers;
}

// Posts statusCount statuses as session's user, each with a distinct timestamp.
export async function postStatuses(
  serverFacade: ServerFacade,
  session: TestSession,
  statusCount: number,
): Promise<void> {
  const start = Date.now();
  for (let i = 0; i < statusCount; i++) {
    const status = new Status(`Integration test status ${i}`, session.user, start + i);
    await serverFacade.postStatus({ token: session.authToken.token, newStatus: status.dto });
  }
}

// Ends the sessions the tests created. Failures are ignored, since the tokens
// also expire on their own.
export async function logoutAll(serverFacade: ServerFacade, sessions: TestSession[]): Promise<void> {
  await Promise.all(
    sessions.map((session) =>
      serverFacade.logout({ token: session.authToken.token }).catch(() => undefined),
    ),
  );
}
