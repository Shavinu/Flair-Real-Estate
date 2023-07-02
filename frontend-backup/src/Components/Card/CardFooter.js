import React from 'react'
import classNames from 'classnames';
import { ComponentProps } from "../index";

interface CardFooterProps extends ComponentProps {
}

const CardFooter: React.FunctionComponent<CardFooterProps> = (props) => {
  return <React.Fragment>
    <div className={classNames('block-content block-content-full block-content-sm bg-body-light font-size-sm', props.className)} style={props.style}>
      {props.children}
    </div>
  </React.Fragment>
}

export default CardFooter
