import React from 'react'
import Flatpickr from "react-flatpickr";

interface DatePickerProps {
  value: string;
  onChange?: (date) => void;
  disable?: boolean;
  enableTime?: boolean;
  options?: any;
}

const DatePicker: React.FunctionComponent<DatePickerProps> = (props) => {
  return <React.Fragment>
    <Flatpickr
      className="form-control bg-white"
      data-enable-time={props.enableTime ?? false}
      value={props.value}
      onChange={([date]: any) => props.onChange && props.onChange(date)}
      disabled={props.disable}
      options={props.options}
    />
  </React.Fragment>
}

export default DatePicker
