import React from 'react'
import classNames from 'classnames';
import { ComponentProps } from "../index";

interface CardBodyProps extends ComponentProps {
}

const CardBody: React.FunctionComponent<CardBodyProps> = (props) => {
  return <React.Fragment>
    <div className={classNames('card-body', props.className)} style={props.style}>
      {props.children}
    </div>
  </React.Fragment>
}

export default CardBody
