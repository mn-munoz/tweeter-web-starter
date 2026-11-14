import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { Status } from "tweeter-shared/dist/model/domain/Status";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { User } from "tweeter-shared/dist/model/domain/User";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { StatusService } from "./model.service/StatusService";
import { FollowService } from "./model.service/FollowService";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();


  // Functions as parameters:

  // For ItemScroller there are two functions that are passed as parameters or props. In this case, they are factory functions. By having functions as parameters, we can personalized the ItemScroller component to behave differently based on what type of function is passed in. 

  // In this case Item scroller takes a lamda function that aids to generate an approprate presenter, and itemComponentFactory generates the appropriate component for the item type. 

  const userItemComponentFactory = (
    user: User,
    featureUrl: string,
  ): JSX.Element => {
    return <UserItem user={user} featureUrl={featureUrl} />;
  };

  const statusItemComponentFactory = (
    status: Status,
    featureUrl: string,
  ): JSX.Element => {
    return <StatusItem status={status} featurePath={featureUrl} />;
  };


  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <ItemScroller<Status, StatusService>
              key={`feed-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              itemComponentFactory={(status: Status) =>
                statusItemComponentFactory(status, "/feed")
              }
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <ItemScroller<Status, StatusService>
              key={`story-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              itemComponentFactory={(status: Status) =>
                statusItemComponentFactory(status, "/story")
              }
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <ItemScroller<User, FollowService>
              key={`followees-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemComponentFactory={(user: User) =>
                userItemComponentFactory(user, "/followees")
              }
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <ItemScroller<User, FollowService>
              key={`followers-${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemComponentFactory={(user: User) =>
                userItemComponentFactory(user, "/followers")
              }
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
