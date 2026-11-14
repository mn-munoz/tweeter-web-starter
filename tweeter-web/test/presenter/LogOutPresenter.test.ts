import { AuthToken } from "tweeter-shared";
import {
  LogOutPresenter,
  LogOutView,
} from "../../src/presenter/LogOutPresenter";
import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/model.service/UserService";

describe("LogOutPresenter", () => {
  let mockLogOutPresenterView: LogOutView;
  let logOutPresenter: LogOutPresenter;
  let mockService: UserService;

  const authToken = new AuthToken("abc123", Date.now());
  beforeEach(() => {
    mockLogOutPresenterView = mock<LogOutView>();
    const mockLogOutPresenterViewInstance = instance(mockLogOutPresenterView);

    when(mockLogOutPresenterView.displayInfoMessage(anything(), 0)).thenReturn(
      "message123",
    );

    const logOutPresenterSpy = spy(
      new LogOutPresenter(mockLogOutPresenterViewInstance),
    );
    logOutPresenter = instance(logOutPresenterSpy);

    mockService = mock<UserService>();
    when(logOutPresenterSpy.service).thenReturn(instance(mockService));
  });
  it("tells the view to display a logging out message.", async () => {
    await logOutPresenter.logOut(authToken);

    verify(
      mockLogOutPresenterView.displayInfoMessage("Logging Out...", 0),
    ).once();
  });
  it("calls logout on the user service with the correct auth token.", async () => {
    await logOutPresenter.logOut(authToken);

    verify(mockService.logout(authToken)).once();

    // let [capturedAuthToken] = capture(mockService.logout).last();
    // expect(capturedAuthToken).toEqual(authToken);
  });
  it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page when succesful", async () => {
    await logOutPresenter.logOut(authToken);

    verify(mockLogOutPresenterView.deleteMessage("message123")).once();
    verify(mockLogOutPresenterView.clearUserInfo()).once();
    verify(mockLogOutPresenterView.navigate("/login")).once();

    verify(
      mockLogOutPresenterView.displayErrorMessage(
        "Failed to log user out because of exception: Error: An error occured",
      ),
    ).never();
  });
  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when unsuccesful", async () => {
    let error = new Error("An error occured");
    when(mockService.logout(authToken)).thenThrow(error);

    await logOutPresenter.logOut(authToken);

    verify(
      mockLogOutPresenterView.displayErrorMessage(
        "Failed to log user out because of exception: Error: An error occured",
      ),
    ).once();
    verify(mockLogOutPresenterView.deleteMessage("message123")).never();
    verify(mockLogOutPresenterView.clearUserInfo()).never();
    verify(mockLogOutPresenterView.navigate("/login")).never();
  });
});
