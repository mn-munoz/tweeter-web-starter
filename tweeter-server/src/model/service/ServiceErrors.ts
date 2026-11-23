// AI-assisted: see AI-ATTRIBUTION.md

// The bracketed tags match the error regexes in template.yaml, so API Gateway
// returns the right status code (400, 401 or 500) with CORS headers.
export const BAD_REQUEST = "[bad-request]";
export const UNAUTHORIZED = "[unauthorized]";
export const INTERNAL_SERVER_ERROR = "[internal-server-error]";

export const badRequest = (message: string): Error => new Error(`${BAD_REQUEST} ${message}`);

export const unauthorized = (message: string): Error => new Error(`${UNAUTHORIZED} ${message}`);

export const internalServerError = (message: string): Error =>
  new Error(`${INTERNAL_SERVER_ERROR} ${message}`);

export const isTaggedError = (message: string): boolean =>
  [BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR].some((tag) => message.includes(tag));
