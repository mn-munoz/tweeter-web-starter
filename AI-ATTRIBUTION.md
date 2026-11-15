## 2026-11-14: tweeter-server/template.yaml
- Tool: Claude Code
- Task: Add the endpoint and Lambda function definitions to template.yaml so GetFolloweesLambda deploys at POST /follow/followees/list.
- Review: DONE

## 2026-11-14: tweeter-shared/src/model/net/request/TweeterRequest.ts (new file), tweeter-shared/src/model/net/request/PagedUserItemRequest.ts, tweeter-shared/src/index.ts, tweeter-web/src/network/ClientCommunicator.ts (new file), tweeter-web/src/network/ServerFacade.ts (new file), tweeter-web/src/model.service/FollowService.ts
- Tool: Claude Code
- Task: Add a client network layer (ClientCommunicator and ServerFacade) and update the client FollowService so loadMoreFollowees calls the POST /follow/followees/list Web API instead of FakeData, with a protected factory method for the ServerFacade so it can be tested.
- Review: DONE
