// AI-assisted: see AI-ATTRIBUTION.md
import { internalServerError, isTaggedError } from "../model/service/ServiceErrors";

// Wraps a lambda handler so any error without a status tag becomes a 500.
// Without this, API Gateway would match no error pattern and return 200.
export const withErrorMapping = <REQ, RES>(handler: (request: REQ) => Promise<RES>) => {
  return async (request: REQ): Promise<RES> => {
    try {
      return await handler(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (isTaggedError(message)) {
        throw error;
      }
      console.error(error);
      throw internalServerError(message);
    }
  };
};
