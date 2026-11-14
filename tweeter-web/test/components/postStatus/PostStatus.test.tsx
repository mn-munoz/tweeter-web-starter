import { userEvent } from "@testing-library/user-event";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("Post Status Component", () => {
  const mockUserInstance = instance(mock<User>());
  const mockAuthTokenInstance = instance(mock(AuthToken));

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });
  it("starts with the post status and clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
  it("enables both the post status and clear buttons if the text area has text", async () => {
    await addToTextArea();
  });
  it("disables both the post status and clear buttons if the text area is cleared", async () => {
    const { postStatusButton, clearButton, postStatusTextArea, user } = await addToTextArea(); 

    await user.clear(postStatusTextArea);
    
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
  it("calls the presenter's submitPost method with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock(PostStatusPresenter);
    const mockPresenterInstance = instance(mockPresenter);

    const post = "Hello World";
    const { postStatusButton, user, postStatusTextArea } = renderPostStatusAndGetElement(mockPresenterInstance);

    await user.type(postStatusTextArea, post);

    await user.click(postStatusButton);

    verify(mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)).once();
  });
});

async function addToTextArea() {
  const { postStatusButton, clearButton, user, postStatusTextArea } =
    renderPostStatusAndGetElement();

  await user.type(postStatusTextArea, "Hello World");

  expect(postStatusButton).toBeEnabled();
  expect(clearButton).toBeEnabled();

  return { postStatusButton, clearButton, user, postStatusTextArea };
}

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(<PostStatus presenter={presenter} />);
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post-Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postStatusTextArea = screen.getByRole("textbox", {
    name: /post-status-text-area/i,
  });

  return { postStatusButton, clearButton, postStatusTextArea, user };
}
