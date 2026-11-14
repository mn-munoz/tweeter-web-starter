import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface LogOutView extends MessageView {
  clearUserInfo: () => void;
  navigate: (url: string) => void;
}

export class LogOutPresenter extends Presenter<LogOutView> {
  private _service = new UserService();

  public constructor(view: LogOutView) {
    super(view);
  }

  public get service(): UserService {
    return this._service;
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation( async () => {
       await this.service.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");

    }, "log user out");
  }
}
