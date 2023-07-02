import classNames from 'classnames';
import React from 'react'
import { Link } from 'react-router-dom';
import { ComponentProps } from "./index";
import utils from '../Utils';

interface DropdownItemProps {
  name: string;
  onClick?: (event: any) => void;
}

interface DropdownProps extends ComponentProps {
  label: String;
  items: DropdownItemProps[];
  link?: String;
}

const Dropdown: React.FunctionComponent<DropdownProps> = (props) => {
  const {
    label,
    items = [],
    className
  } = props;

  return <React.Fragment>
    <div className="btn-group mb-1">
      <div className="dropdown">
        <button className={classNames("dropdown-toggle waves-effect waves-light", className)} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {label}
        </button>
        <div className="dropdown-menu">
          {props.children
            ? props.children
            : items?.map(item => <Link className="dropdown-item" to={item.link ?? '#'} onClick={item.onClick} key={utils.newGuid()}>{item.name}</Link>)}
        </div>
      </div>
    </div>
  </React.Fragment>
}

export default Dropdown
