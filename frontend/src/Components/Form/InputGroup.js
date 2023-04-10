import React from "react";
import { ComponentProps } from "..";

interface InputGroupProps extends ComponentProps {
  prepend?: any;
  append?: any;
}

const InputGroup: React.FunctionComponent<InputGroupProps> = (props) => {
  return <>
    <div className="input-group">
      {props.prepend && <div className="input-group-prepend">
        <span className="input-group-text">
          <i className={props.prepend}></i>
        </span>
      </div>}
      {props.children}

      {props.append && <div className="input-group-prepend">
        <span className="input-group-text">
          {props.append}
          <i className={props.append}></i>
        </span>
      </div>}
    </div>
  </>;
}

export default InputGroup;
