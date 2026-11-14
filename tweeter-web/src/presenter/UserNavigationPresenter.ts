import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private service = new UserService();

  constructor(view: UserNavigationView) {
    super(view);
  }

  public async navigateToUser(authToken: AuthToken, href: string, target:string): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const featureUrl = href.substring(0, href.lastIndexOf("/"));
      const alias = this.extractAlias(target);
      const toUser = await this.service.getUser(authToken!, alias);

      if (toUser) {
        this.view.setDisplayedUser(toUser);
        this.view.navigate(`${featureUrl}/${toUser.alias}`);
      }
    }, "navigate to user");
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}
