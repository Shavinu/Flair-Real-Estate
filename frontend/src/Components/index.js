import React from "react";
import Alert from './Alert';
import Button from './Button';
import Loader from './Loader';

export interface ComponentProps {
  id?: any;
  className?: string;
  style?: React.CSSProperties;
  children?: any;
}

export {
  Alert,
  Button,
  Loader,
}
