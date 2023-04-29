import classNames from 'classnames';
import React from 'react';
import { ComponentProps } from "../index";

export interface InputProps extends ComponentProps {
  value?: any;
  defaultValue?: any;
  type: 'text' | 'password' | 'email' | 'hidden' | 'number';
  error?: string;
  name?: string;
  multiple?: boolean;
  accept?: string;
  placeholder?: string;
  min?: number;
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autoFocus?: boolean;
  icon?: string;
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
}

const Input: React.FunctionComponent<InputProps> = (props) => {
  return (
    <React.Fragment>
      <input
        type={props.type ?? 'text'}
        className={classNames(
          `form-control${props.readonly ? '-plaintext' : ''}`,
          props.error ? 'is-invalid' : '',
          props.className
        )}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        onBlur={props.onBlur}
        min={props.min}
        checked={props.checked}
        disabled={props.disabled}
        readOnly={props.readonly}
        style={props.style}
        autoFocus={props.autoFocus ?? false}
        multiple={props.type === 'file' && props.multiple}
        accept={props.type === 'file' ? props.accept : undefined}
      />
      {props.icon && (
        <div className="form-control-position">
          <i className={props.icon}></i>
        </div>
      )}
      {props.error && <div className="invalid-feedback">{props.error}</div>}
    </React.Fragment>
  );
};

export default Input
