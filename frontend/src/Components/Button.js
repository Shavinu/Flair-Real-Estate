import React from 'react'
import Loader from './Loader';
import { ComponentProps } from "../index";

interface ButtonProps extends ComponentProps {
  id?: string;
  isLoading?: boolean;
  onClick?: Function;
  disabled?: boolean;
  icon?: any;
  type?: "button" | "submit" | "reset";
}

const Button: React.FunctionComponent<ButtonProps> = (props) => {
  return <React.Fragment>
    <button type={props.type ?? 'button'}
      id={props.id}
      className={props.className}
      disabled={props.disabled || props.isLoading}
      onClick={props.onClick}
      style={props.style}
      data-toggle={props.dataToggle}
      aria-haspopup={!!props.dataToggle}
      aria-expanded={!props.dataToggle}
    >
      {props.isLoading
        ? <span className="mr-1"><Loader /></span>
        : props.icon && <i className={`${props.icon} mr-1`}></i>}
      {props.children}
    </button>
  </React.Fragment>
}

export default Button
