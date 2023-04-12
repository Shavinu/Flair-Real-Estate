import React from 'react';
import { ComponentProps } from "../index";

interface LabelProps extends ComponentProps {
  for?: string;
}

const Label: React.FunctionComponent<LabelProps> = (props) => {
  return <React.Fragment>
    <label className={props.className} htmlFor={props.for} style={props.style}>
      {props.children}
    </label>
  </React.Fragment>
}

export default Label
