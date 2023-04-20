import classNames from "classnames";
import React from "react";
import { ComponentProps } from "../index";

interface ColProps extends ComponentProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

const Col: React.FunctionComponent<ColProps> = (props) => {
  const xs = `col-${props.xs ?? 12}`;
  const sm = props.sm ? `col-sm-${props.sm}` : '';
  const md = props.md ? `col-md-${props.md}` : '';
  const lg = props.lg ? `col-lg-${props.lg}` : '';
  const xl = props.xl ? `col-xl-${props.xl}` : '';

  return <div className={classNames(xs, sm, md, lg, xl, props.className)} style={props.style}>
    {props.children}
  </div>
}
export default Col;
