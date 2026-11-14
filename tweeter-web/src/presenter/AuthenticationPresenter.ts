import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

// The template method is a way we can avoid code duplication by adding repeptitive logic to a base class and allow subclasses implement the unique parts of their respective programs/algorithms/ and functions.

// The way that it was used in this project is that I realized that both Login and register have kind of the similar logic that consisted of having a a failure report, then an auth operation login/register, and then a funciton that notifies the view of where to navigate.  In this case, subclasses will implement a notify view function and a intem description function, which are the areas unique to each subclass.


export interface AuthenticationView extends View {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
  navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter<V extends AuthenticationView> extends Presenter<V> {
  private _service: UserService = new UserService();

  public constructor(view: V) {
    super(view);
  }

  protected get service() {
    return this._service;
  }

  protected async doAuthenticationOperation(
    authenticationOperation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await authenticationOperation();

        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.notifyView(user, originalUrl);
      },
      this.itemDescription(),
      () => {
        this.view.setIsLoading(false);
      },
    );
  }
  protected abstract notifyView(user: User, originalUrl?: string): void;
  protected abstract itemDescription(): string;
}
