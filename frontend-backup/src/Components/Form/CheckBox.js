import React from 'react';
import utils from '../../Utils';
import { ComponentProps } from "../index";

interface CheckBoxProps extends ComponentProps {
  id?: string;
  name?: string;
  checked?: boolean;
  onChange?: Function;
  disabled?: boolean;
  label?: string;
}

const CheckBox: React.FunctionComponent<CheckBoxProps> = (props) => {
  const {
    id = utils.newGuid(),
    name,
    checked,
    onChange,
    disabled,
    label,
  } = props;

  return <React.Fragment>
    <div className="custom-control custom-checkbox">
      <input type="checkbox"
        className="custom-control-input"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="custom-control-label" htmlFor={id}>{label}</label>
    </div>
  </React.Fragment>
}

export default CheckBox
