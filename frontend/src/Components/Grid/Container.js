import classNames from "classnames";
import React from "react";
import { ComponentProps } from "../index";

interface ContainerProps extends ComponentProps {
  fluid?: boolean;
}

const Container: React.FunctionComponent<ContainerProps> = (props) => {
  return <div className={classNames(`container${props.fluid ? '-fluid' : ''}`, props.className)} style={props.style}>
    {props.children}
  </div>
}
export default Container;
