import React from 'react'
import utils from '../Utils';
import Modal from './Modal';

interface ChangePasswordModalProps {
  id?: string;
  show?: boolean;
  setShow?: (isOpen: boolean) => void;
  onSubmit?: () => void;
  title?: string;
  submitText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ChangePasswordModal: React.FunctionComponent<ChangePasswordModalProps> = (props) => {
  return <React.Fragment>
    <Modal
      id={props.id ?? `confirm-modal-${utils.newGuid()}`}
      show={props.show}
      setShow={props.setShow}
      title={props.title ?? "Change Password"}
      submitText={props.submitText ?? "Confirm"}
      onSubmit={props.onSubmit}
      size={props.size ?? 'sm'}
    >
      <p>Are you sure to perform this action?</p>
    </Modal>
  </React.Fragment>
}

export default ChangePasswordModal
