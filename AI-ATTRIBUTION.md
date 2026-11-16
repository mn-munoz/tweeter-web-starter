## 2026-11-14: tweeter-server/template.yaml
- Tool: Claude Code
- Task: Add the endpoint and Lambda function definitions to template.yaml so GetFolloweesLambda deploys at POST /follow/followees/list.
- Review: DONE

## 2026-11-14: tweeter-shared/src/model/net/request/TweeterRequest.ts (new file), tweeter-shared/src/model/net/request/PagedUserItemRequest.ts, tweeter-shared/src/index.ts, tweeter-web/src/network/ClientCommunicator.ts (new file), tweeter-web/src/network/ServerFacade.ts (new file), tweeter-web/src/model.service/FollowService.ts
- Tool: Claude Code
- Task: Add a client network layer (ClientCommunicator and ServerFacade) and update the client FollowService so loadMoreFollowees calls the POST /follow/followees/list Web API instead of FakeData, with a protected factory method for the ServerFacade so it can be tested.
- Review: DONE

## 2026-11-15: tweeter-shared/src/model/net/request/PagedItemRequest.ts (new file), tweeter-shared/src/model/net/response/PagedItemResponse.ts (new file), tweeter-shared/src/model/net/request/PagedUserItemRequest.ts, tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts, tweeter-shared/src/model/net/response/PagedUserItemResponse.ts, tweeter-shared/src/model/net/response/PagedStatusItemResponse.ts, tweeter-shared/src/index.ts
- Tool: Claude Code
- Task: Refactor PagedUserItem/PagedStatusItem Request and Response in tweeter-shared to remove duplication using generics, without changing behavior or exported names, so the code is ready for refactoring the lambda layer in tweeter-server.
- Review: DONE

## 2026-11-15: tweeter-server/src/lambda/follow/PagedFollowHandler.ts (new file), tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts
- Tool: Claude Code
- Task: Refactor the duplicated logic between GetFolloweesLambda.ts and GetFollowersLambda.ts.
- Review: DONE

## 2026-11-15: tweeter-server/src/lambda/PagedItemHandler.ts (new file), tweeter-server/src/lambda/follow/PagedFollowHandler.ts (deleted), tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts, tweeter-server/src/lambda/status/GetFeedLambda.ts, tweeter-server/src/lambda/status/GetStoryLambda.ts
- Tool: Claude Code
- Task: Generalize the shared paged-lambda logic into one generic handler used by the followees, followers, feed, and story lambdas.
- Review: DONE

## 2026-11-15: tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts, tweeter-server/src/lambda/status/GetFeedLambda.ts, tweeter-server/src/lambda/status/GetStoryLambda.ts
- Tool: Claude Code
- Task: Make the paged lambdas consistent by using named parameters instead of (...args), and change StatusService to take StatusDto so the lambdas no longer convert lastItem themselves.
- Review: DONE

## 2026-11-15: tweeter-web/src/network/ServerFacade.ts
- Tool: Claude Code
- Task: Remove the duplicated request/convert/error-handling code in ServerFacade.ts in tweeter-web.
- Review: DONE

## 2026-11-15: tweeter-server/src/lambda/follow/FollowCountHandler.ts (new file), tweeter-server/src/lambda/follow/GetFolloweeCount.ts, tweeter-server/src/lambda/follow/GetFollowerCount.ts
- Tool: Claude Code
- Task: Refactor the near-identical GetFolloweeCount and GetFollowerCount lambdas to remove duplicated code.
- Review: DONE

## 2026-11-15: tweeter-server/src/lambda/follow/FollowUserLambda.ts
- Tool: Claude Code
- Task: Import ChangeFollowRequest into FollowUserLambda.
- Review: DONE

## 2026-11-15: tweeter-server/template.yaml
- Tool: Claude Code
- Task: Fix the SAM deploy failure (AWS::EarlyValidation::ResourceExistenceCheck) when deploying the lambdas.
- Review: DONE

## 2026-11-15: tweeter-web/src/network/ServerFacade.ts, tweeter-server/src/lambda/follow/FollowUserLambda.ts
- Tool: Claude Code
- Task: Fix "Client communicator POST failed: Load failed" errors when following and unfollowing users.
- Review: DONE

## 2026-11-15: tweeter-shared/src/model/dto/AuthTokenDto.ts (new file), tweeter-shared/src/model/net/request/RegisterRequest.ts (new file), tweeter-shared/src/model/net/response/AuthenticationResponse.ts (new file), tweeter-shared/src/model/domain/AuthToken.ts, tweeter-shared/src/index.ts, tweeter-server/src/lambda/auth/RegisterLambda.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts
- Tool: Claude Code
- Task: Add the /auth/user/register endpoint, including the lambda, the template entry, and the client-side code so the web app calls it.
- Review: DONE 

## 2026-11-15: tweeter-shared/src/model/net/request/LoginRequest.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/lambda/auth/LoginLambda.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts
- Tool: Claude Code
- Task: Add the /auth/user/login endpoint, including the lambda, the template entry, and the client-side code so the web app calls it.
- Review: DONE
