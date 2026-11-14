import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import {
  PostStatusView,
  PostStatusPresenter,
} from "../../src/presenter/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const currentUser = new User(
    "Test",
    "User",
    "user123",
    "https://example.com/profile.jpg",
  );

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(
      mockPostStatusPresenterView,
    );

    when(
      mockPostStatusPresenterView.displayInfoMessage(anything(), 0),
    ).thenReturn("message123");

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusPresenterViewInstance),
    );

    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  });
  it(" tells the view to display a posting status message.", async () => {
    await postStatusPresenter.submitPost(
      "Hello, world!",
      currentUser,
      authToken,
    );

    verify(
      mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0),
    ).once();
  });
  it("calls postStatus on the post status service with the correct status string and auth token.", async () => {
    await postStatusPresenter.submitPost(
      "Hello, world!",
      currentUser,
      authToken,
    );

    let [capturedAuthToken, capturedStatus] = capture(
      mockService.postStatus,
    ).last();

    verify(mockService.postStatus(capturedAuthToken, capturedStatus)).once();
  });
  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when succesful", async () => {
    await postStatusPresenter.submitPost(
      "Hello, world!",
      currentUser,
      authToken,
    );

    verify(mockPostStatusPresenterView.deleteMessage("message123")).once();
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000),
    ).once();
  });
  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccesful", async () => {
    let error = new Error("An error occured");
    when(mockService.postStatus(authToken, anything())).thenReject(error);

    await postStatusPresenter.submitPost(
      "Hello, world!",
      currentUser,
      authToken,
    );

    verify(mockPostStatusPresenterView.deleteMessage("message123")).once();
    verify(mockPostStatusPresenterView.displayErrorMessage("Failed to post status because of exception: Error: An error occured")).once();

    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
