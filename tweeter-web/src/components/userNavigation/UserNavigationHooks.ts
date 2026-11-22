import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useNavigate } from "react-router-dom";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";
import { useRef } from "react";

export const useUserNavigation = () => {
  const { displayErrorMessage } = useMessageActions();
  const { authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  const listener: UserNavigationView = {
    setDisplayedUser,
    navigate,
    displayErrorMessage,
  };

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (presenterRef.current === null) {
    presenterRef.current = new UserNavigationPresenter(listener);
  }

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    const href = (event.currentTarget as HTMLAnchorElement).getAttribute(
      "href",
    )!;
    presenterRef.current!.navigateToUser(authToken!, href, event.target.toString());
  };

    return { navigateToUser };
};
