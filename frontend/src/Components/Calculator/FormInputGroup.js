import React from "react";
import "./Form.css";

function FormInputGroup({
  text,
  icon,
  placeholder,
  value,
  onInput,
  onKeyUp,
  readOnly = false,
}) {
  return (
    <div className="input-group mb-3">
      <span className="input-group-text">
        {text} {icon}
      </span>
      <input
        type="number"
        value={value}
        className="form-control"
        placeholder={placeholder}
        onInput={onInput}
        onKeyUp={onKeyUp}
        readOnly={readOnly}
      />
    </div>
  );
}

export default FormInputGroup;
