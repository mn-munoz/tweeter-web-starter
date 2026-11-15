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
