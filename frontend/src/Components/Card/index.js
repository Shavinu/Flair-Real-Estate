import React from 'react'
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';
import CardBody from './CardBody';
import classNames from 'classnames';
import utils from '../../Utils';
import { ComponentProps } from "../index";

interface CardProps extends ComponentProps {
  id?: string;
  header?: string;
  headerClassname?: string;
  options?: any;
  footer?: any;
  footerClassname?: string;
  bodyClassname?: string;
}

const Card: React.FunctionComponent<CardProps> = (props) => {
  return <React.Fragment>
    <div className={classNames('card', props.className)} id={props.id ?? utils.newGuid()} style={props.style}>
      {props.header && <CardHeader title={props.header} options={props.options} className={props.headerClassname} />}
      {props.children}
      {props.footer && <CardFooter className={props.footerClassname}>{props.footer}</CardFooter>}
    </div>
  </React.Fragment>
}

export default Card
