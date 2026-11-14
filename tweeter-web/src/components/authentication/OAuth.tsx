import OAuthButton from "./OAuthButton";

interface Props {
    displayInfoMessageWithDarkBackground: (message: string) => void;
}

const OAuth = (props: Props) => {
  return (
    <>
      <div className="text-center mb-3">
        <OAuthButton
          displayInfoMessageWithDarkBackground={
            props.displayInfoMessageWithDarkBackground
          }
          icon={["fab", "google"]}
          label="Google"
        />

        <OAuthButton
          displayInfoMessageWithDarkBackground={
            props.displayInfoMessageWithDarkBackground
          }
          icon={["fab", "facebook"]}
          label="Facebook"
        />

        <OAuthButton
          displayInfoMessageWithDarkBackground={
            props.displayInfoMessageWithDarkBackground
          }
          icon={["fab", "twitter"]}
          label="Twitter"
        />

        <OAuthButton
          displayInfoMessageWithDarkBackground={
            props.displayInfoMessageWithDarkBackground
          }
          icon={["fab", "linkedin"]}
          label="LinkedIn"
        />

        <OAuthButton
          displayInfoMessageWithDarkBackground={
            props.displayInfoMessageWithDarkBackground
          }
          icon={["fab", "github"]}
          label="GitHub"
        />
      </div>
    </>
  );
};

export default OAuth;
