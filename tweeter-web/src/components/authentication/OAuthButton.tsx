import { IconPrefix, IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface Props {
  displayInfoMessageWithDarkBackground: (message: string) => void;
  icon: [IconPrefix, IconName];
  label: string;
}

const OAuthButton = (props: Props) => {
  return (
    <>
      <button
        type="button"
        className="btn btn-link btn-floating mx-1"
        onClick={() =>
          props.displayInfoMessageWithDarkBackground(
            `${props.label} registration is not implemented.`,
          )
        }
      >
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`${props.label.toLowerCase()}Tooltip`}>
              {props.label}
            </Tooltip>
          }
        >
          <FontAwesomeIcon icon={props.icon} />
        </OverlayTrigger>
      </button>
    </>
  );
};

export default OAuthButton;
