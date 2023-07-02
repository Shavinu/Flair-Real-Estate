import React from "react";
import { ComponentProps } from "./index";
import classNames from "classnames";

interface AlertProps extends ComponentProps {
  type?: 'primary' | 'success' | 'danger' | 'warning' | 'dark' | 'info' | 'white';
  icon?: React.ReactNode;
  message?: string;
}

const Alert: React.FunctionComponent<AlertProps> = (props) => {
  return <>
    <div className={classNames(`alert alert-${props.type}`, props.className)} role="alert">
      {props.icon}
      <span>
        {props.message}
      </span>
    </div>
  </>
}

export default Alert;
