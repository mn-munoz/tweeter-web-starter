import { User } from "tweeter-shared";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  protected notifyView(user: User, originalUrl: string | undefined): void {
    if (!!originalUrl) {
      this.view.navigate(originalUrl);
    } else {
      this.view.navigate(`/feed/${user.alias}`);
    }
  }
  protected itemDescription(): string {
    return "log user in";
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    await this.doAuthenticationOperation(
      async () => this.service.login(alias, password),
      rememberMe,
      originalUrl,
    );
  }
}
