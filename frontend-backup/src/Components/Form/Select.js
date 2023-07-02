import classNames from 'classnames';
import React, { useEffect, useState } from 'react'
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import { ComponentProps } from "../index";
import './Select.css';

const animatedComponents = makeAnimated();

interface SelectItemProps {
  value: any;
  label: any;
}

interface SelectProps extends ComponentProps {
  id?: string;
  value?: any;
  onChange?: (selectedItem: any) => void;
  error?: string;
  name?: string;
  options: SelectItemProps[];
  multiple?: boolean;
  readonly?: boolean;
  isClearable?: boolean;
}

const Select: React.FunctionComponent<SelectProps> = (props) => {
  const [value, setValue] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const options = props.multiple
    ? [{ label: "Select All", value: "all" }, ...props.options]
    : props.options;

  const getValue = () => {
    setIsLoaded(false);

    const value = props.options.filter(option => {
      if (props.value && props.value.length) {
        return props.value.includes(option.value);
      }

      return option.value === props.value;
    });
    setValue(value);

    setIsLoaded(true);
  }

  const onSelectAll = () => {
    const value = !isSelectAll
      ? props.options.map(option => option.value)
      : [];
    props.onChange && props.onChange(value);
    setIsSelectAll(!isSelectAll);
  }

  const onChange = (selectedItem: any) => {
    if (props.multiple) {
      if (selectedItem?.length && selectedItem.find((option: any) => option.value === "all")) {
        onSelectAll()
      } else {
        props.onChange && props.onChange(selectedItem.map((item: any) => item.value));
        setIsSelectAll(selectedItem.length === props.options.length);
      }
    } else {
      props.onChange && props.onChange(selectedItem?.value);
    }
  }

  useEffect(() => {
    getValue();
  }, [props.value, props.options]);

  return <React.Fragment>
    <ReactSelect classNamePrefix="select"
      className={props.error ? 'is-invalid' : ''}
      value={value}
      isClearable={true}
      isSearchable={true}
      name={props.name}
      onChange={onChange}
      closeMenuOnSelect={!props.multiple}
      hideSelectedOptions={false}
      isMulti={props.multiple}
      options={options}
      components={animatedComponents}
      menuPortalTarget={document.body}
      styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
      isDisabled={props.readonly}
    />

    {props.error && <div className="text-danger">
      {props.error}
    </div>}
  </React.Fragment>
}

export default Select
