import { User, AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setDisplayedUser: (user: User) => void;
  navigate(path: string): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService = new FollowService();

  constructor(view: UserInfoView) {
    super(view);
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followee count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers count");
  }

  public async switchToLoggedInUser(
    currentUser: User,
    pathname: string,
  ): Promise<void> {
    this.view.setDisplayedUser(currentUser!);
    this.view.navigate(`${this.getBaseUrl(pathname)}/${currentUser!.alias}`);
  }

  public getBaseUrl(pathname: string): string {
    const segments = pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }

  public async changefollowStatus(
   displayedUser: User,
    authToken: AuthToken,
    isFollower: boolean,
    operation: (authToken: AuthToken, userToFollow: User) => Promise<[followerCount: number, followeeCount: number]>,
  ): Promise<void> {
    var followStatusUserToast = "";
    const followStatus: string = isFollower ? "Unfollowing" : "Following";
    const operationMessage: string = isFollower ? "unfollow" : "follow";

    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        followStatusUserToast = this.view.displayInfoMessage(
          `${followStatus} ${displayedUser!.name}...`,
          0,
        );

        const [followerCount, followeeCount] = await operation(
          authToken!,
          displayedUser!,
        );

        this.view.setIsFollower(!isFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      `${operationMessage} user`,
      () => {
        this.view.deleteMessage(followStatusUserToast);
        this.view.setIsLoading(false);
      },
    );
  }
  public async followDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.changefollowStatus(
      displayedUser,
      authToken,
      false,
      async (authToken: AuthToken, userToFollow: User) =>
        this.service.follow(authToken, userToFollow),
    );
  }

  public async unfollowDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.changefollowStatus(
      displayedUser,
      authToken,
      true,
      async (authToken: AuthToken, userToUnfollow: User) =>
        this.service.unfollow(authToken, userToUnfollow),
    );
  }
}
