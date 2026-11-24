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

## 2026-11-15: tweeter-shared/src/model/net/request/LogoutRequest.ts (new file), tweeter-shared/src/model/net/response/LogoutResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/lambda/auth/LogoutLambda.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts
- Tool: Claude Code
- Task: Add the /auth/user/logout endpoint, including the lambda, the template entry, and the client-side code so the web app calls it.
- Review: DONE

## 2026-11-15: tweeter-web/src/network/ServerFacade.ts
- Tool: Claude Code
- Task: Refactor ServerFacade to remove duplicated response and error handling, leaving lambda error mapping for a later part of the project.
- Review: DONE

## 2026-11-15: tweeter-shared/src/model/net/request/GetUserRequest.ts (new file), tweeter-shared/src/model/net/response/GetUserResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/lambda/user/GetUserLambda.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts
- Tool: Claude Code
- Task: Add the /user/get endpoint, including the lambda, the template entry, and the client-side code so the web app calls it.
- Review: DONE

## 2026-11-15: tweeter-shared/src/model/net/request/PostStatusRequest.ts (new file), tweeter-shared/src/model/net/response/PostStatusResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts (new file), tweeter-server/src/model/service/StatusService.ts, tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/StatusService.ts
- Tool: Claude Code
- Task: Add the /status/story/add endpoint, including the lambda, the template entry, and the client-side code so the web app calls it.
- Review: DONE

## 2026-11-16: tweeter-web/test/network/ServerFacade.test.ts (new file), tweeter-web/package.json, package-lock.json
- Tool: Claude Code
- Task: Write integration tests for the register endpoint in tweeter-web's ServerFacade, checking that the server returns Allen Anderson, and install isomorphic-fetch so the tests can call fetch.
- Review: DONE

## 2026-11-16: tweeter-web/test/network/ServerFacade.test.ts
- Tool: Claude Code
- Task: Write integration tests for getFollowers (getMoreFollowers) in tweeter-web's ServerFacade.
- Review: DONE

## 2026-11-16: tweeter-web/test/network/ServerFacade.test.ts
- Tool: Claude Code
- Task: Write integration tests for getFollowerCount and getFolloweeCount in tweeter-web's ServerFacade.
- Review: DONE

## 2026-11-16: tweeter-web/test/model.service/StatusService.test.ts (new file)
- Tool: Claude Code
- Task: Write an integration test for the client-side StatusService that checks a successful story retrieval (loadMoreStoryItems) against the server.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/dao/DataPage.ts (new file), tweeter-server/src/model/dao/UserDAO.ts (new file), tweeter-server/src/model/dao/AuthTokenDAO.ts (new file), tweeter-server/src/model/dao/FollowDAO.ts (new file), tweeter-server/src/model/dao/StatusDAO.ts (new file), tweeter-server/src/model/dao/ImageDAO.ts (new file), tweeter-server/src/model/dao/DAOFactory.ts (new file)
- Tool: Claude Code
- Task: Step 1 of the Milestone 4A plan: create database-agnostic DAO interfaces (user, auth token, follow, status, S3 image), a DataPage class, and the DAOFactory abstract factory interface.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/dao/dynamo/DynamoBase.ts (new file), tweeter-server/src/model/dao/dynamo/DynamoUserDAO.ts (new file), tweeter-server/src/model/dao/dynamo/DynamoAuthTokenDAO.ts (new file), tweeter-server/src/model/dao/dynamo/DynamoDAOFactory.ts (new file), tweeter-server/src/model/dao/s3/S3ImageDAO.ts (new file), tweeter-server/src/model/service/ServiceErrors.ts (new file), tweeter-server/src/lambda/withErrorMapping.ts (new file), tweeter-server/src/model/dao/UserDAO.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/auth/RegisterLambda.ts, tweeter-server/src/lambda/auth/LoginLambda.ts, tweeter-server/src/lambda/auth/LogoutLambda.ts, tweeter-server/src/lambda/user/GetUserLambda.ts, tweeter-server/template.yaml, tweeter-server/layer/nodejs/node_modules/bcryptjs/ (new, copied from node_modules)
- Tool: Claude Code
- Task: Implement register end to end: DynamoDB user and authtoken DAOs, S3 image DAO, DynamoDAOFactory, bcrypt password hashing in UserService.register, error-tag mapping for API Gateway, and the user/authtoken tables in template.yaml.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/service/UserService.ts
- Tool: Claude Code
- Task: Normalize the alias in register so it always starts with "@" (e.g. "bob" becomes "@bob").
- Review: DONE

## 2026-11-23: tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/auth/LogoutLambda.ts
- Tool: Claude Code
- Task: Implement logout by deleting the user's auth token from the authtoken table, and map logout errors to API Gateway status codes.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/auth/LoginLambda.ts
- Tool: Claude Code
- Task: Implement login: normalize the alias, check the password with bcrypt against the stored hash, and create a new auth token; map login errors to API Gateway status codes.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/service/AuthorizationService.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/user/GetUserLambda.ts, tweeter-server/src/model/dao/dynamo/DynamoAuthTokenDAO.ts
- Tool: Claude Code
- Task: Implement AuthorizationService (token lookup, 60-minute idle timeout, session refresh) and use it to implement getUser from DynamoDB; stop AuthTokenDAO.touch from recreating deleted tokens.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/lambda/follow/GetFolloweeCount.ts, tweeter-server/src/lambda/follow/FollowUserLambda.ts, tweeter-server/src/lambda/follow/UnfollowUserLambda.ts, tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts, tweeter-server/src/lambda/follow/GetFollowerCount.ts, tweeter-server/src/lambda/follow/GetFollowerStatusLambda.ts
- Tool: Claude Code
- Task: Implement getFolloweeCount: authorize the token and read the stored followee count from the user table. Give FollowService a DAOFactory constructor and pass the factory in from every follow lambda.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/dao/dynamo/DynamoFollowDAO.ts (new file), tweeter-server/src/model/dao/dynamo/DynamoBase.ts, tweeter-server/src/model/dao/dynamo/DynamoDAOFactory.ts, tweeter-server/src/model/dao/dynamo/DynamoUserDAO.ts, tweeter-server/src/model/dao/UserDAO.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/lambda/follow/GetFolloweesLambda.ts
- Tool: Claude Code
- Task: Implement the followees list from DynamoDB: a generic paged-query helper in DynamoBase, DynamoFollowDAO.getPageOfFollowees, and FollowService.loadMoreFollowees; make UserDAO.getUsers return users in the requested order.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/dao/dynamo/DynamoFollowDAO.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts
- Tool: Claude Code
- Task: Implement the followers list from DynamoDB by querying follow_index, sharing one paging helper between the followees and followers lists in FollowService.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/dao/dynamo/DynamoFollowDAO.ts
- Tool: Claude Code
- Task: Refactor the duplicated followees and followers queries in DynamoFollowDAO into one shared private helper.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/dao/dynamo/DynamoFollowDAO.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/lambda/follow/GetFollowerStatusLambda.ts
- Tool: Claude Code
- Task: Implement follower status: check the follow table for a (follower, followee) row with DynamoFollowDAO.isFollower and use it in FollowService.getIsFollowerStatus.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/dao/FollowDAO.ts, tweeter-server/src/model/dao/dynamo/DynamoFollowDAO.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/lambda/follow/FollowUserLambda.ts
- Tool: Claude Code
- Task: Implement follow: the logged-in user (from the token) follows another user, the follow row is added only if new, both users' counts are updated, and the followed user's new counts are returned.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/dao/FollowDAO.ts, tweeter-server/src/model/dao/dynamo/DynamoFollowDAO.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/lambda/follow/UnfollowUserLambda.ts
- Tool: Claude Code
- Task: Implement unfollow (delete the follow row only if it exists and decrement both users' counts), sharing one helper with follow in FollowService.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/dao/dynamo/DynamoStatusDAO.ts (new file), tweeter-server/src/model/dao/dynamo/DynamoDAOFactory.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/lambda/status/GetStoryLambda.ts, tweeter-server/src/lambda/status/GetFeedLambda.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts, tweeter-server/template.yaml
- Tool: Claude Code
- Task: Implement the story list from DynamoDB: add the story table, a DynamoStatusDAO (reusable for the feed) with newest-first paging, a DAOFactory constructor for StatusService, and loadMoreStoryItems.
- Review: DONE

## 2026-11-23: tweeter-server/src/model/service/AuthorizedService.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/model/service/StatusService.ts
- Tool: Claude Code
- Task: Move the AuthorizationService dependency out of the three services into a shared abstract AuthorizedService base class with a protected authorize method.
- Review: DONE

## 2026-11-24: tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/model/dao/dynamo/DynamoStatusDAO.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts
- Tool: Claude Code
- Task: Implement posting a status to the author's story: authorize, check the author is the logged-in user and the post is valid, and store it with DynamoStatusDAO.put. Feed fan-out is left for the next step.
- Review: DONE

## 2026-11-24: tweeter-server/template.yaml
- Tool: Claude Code
- Task: Add the feed DynamoDB table (partition key owner_alias, sort key timestamp) to template.yaml.
- Review: DONE

## 2026-11-24: tweeter-server/src/model/dao/dynamo/DynamoFollowDAO.ts
- Tool: Claude Code
- Task: Implement DynamoFollowDAO.getAllFollowers by repeatedly calling the paged followers query until every follower has been read.
- Review: DONE

## 2026-11-24: tweeter-server/src/model/dao/dynamo/DynamoBase.ts, tweeter-server/src/model/dao/dynamo/DynamoStatusDAO.ts
- Tool: Claude Code
- Task: Add a batch-write helper to DynamoBase (chunks of 25, retrying unprocessed items with backoff) and use it to implement DynamoStatusDAO.batchPut.
- Review: DONE

## 2026-11-24: tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/model/dao/dynamo/DynamoDAOFactory.ts
- Tool: Claude Code
- Task: Implement the feed fan-out in postStatus: after saving to the story, get all of the author's followers and batch-write the status into each follower's feed; make DAOFactory return the real feed DAO.
- Review: DONE

## 2026-11-24: tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/lambda/status/GetFeedLambda.ts
- Tool: Claude Code
- Task: Implement the feed list by reading each user's precomputed feed from the feed table through the shared loadStatusPage helper, and remove the last FakeData use from the server.
- Review: DONE
