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

import React, { useState } from 'react';

const ChangePasswordModal = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your password change logic here
    console.log('Password changed successfully!');
  };

  return (
    <div className="modal">
      <h2>Change Password</h2>
      {step === 1 && (
        <form onSubmit={() => setStep(2)}>
          <label>
            Current Password:
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </label>
          <button type="submit">Next</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h2>Change Password</h2>
          <label>
            New Password:
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
          <label>
            Confirm New Password:
            <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordModal;

