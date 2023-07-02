import classNames from "classnames";
import { ComponentProps } from "../index";

interface GroupProps extends ComponentProps {
  hasIconLeft?: boolean;
  hasIconRight?: boolean;
}

const Group: React.FunctionComponent<GroupProps> = (props) => {
  return <fieldset className={classNames('form-group', props.className, props.hasIconLeft ? 'position-relative has-icon-left' : '', props.hasIconRight ? 'position-relative has-icon-right' : '')}
    style={props.style}>
    {props.children}
  </fieldset>
}

export default Group;
