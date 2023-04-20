import classNames from 'classnames';
import React from 'react'
import { ComponentProps } from "../index";

interface CardHeaderProps extends ComponentProps {
  title: any;
  options?: any,
}

const CardHeader: React.FunctionComponent<CardHeaderProps> = (props) => {
  return <React.Fragment>
    <div className={classNames('card-header', props.className)} style={props.style}>
      <h3 className="card-title">{props.title}</h3>
    </div>
  </React.Fragment >
}

export default CardHeader
