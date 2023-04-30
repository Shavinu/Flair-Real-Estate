import React from "react";
import Alert from './Alert';
import Button from './Button';
import Card from './Card';
import CardBody from './Card/CardBody';
import Loader from './Loader';
import ContentHeader from './ContentHeader';
import Dropdown from './Dropdown';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import DatePicker from './DatePicker';
import { Col, Container, Row } from "./Grid";

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
  Card,
  CardBody,
  ContentHeader,
  Dropdown,
  Modal,
  ConfirmModal,
  Container,
  Row,
  Col,
  DatePicker,
}
