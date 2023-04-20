import classNames from "classnames";
import React from "react";
import { ComponentProps } from "../index";

interface RowProps extends ComponentProps {
  gap?: 'no' | 'tiny';
}

const Row: React.FunctionComponent<RowProps> = (props) => {
  let gap;

  switch (props.gap) {
    case 'no':
      gap = 'no-gutters';
      break;

    case 'tiny':
      gap = 'gutters-tiny';
      break;

    default:
      gap = 'gutters'
      break;
  }

  return <div className={classNames('row', gap, props.className)} style={props.style}>
    {props.children}
  </div>
}
export default Row;
