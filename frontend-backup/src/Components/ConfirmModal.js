import React from 'react';
import utils from '../Utils';
import Modal from './Modal';

interface ConfirmModalProps {
  id?: string;
  show?: boolean;
  setShow?: (isOpen: boolean) => void;
  onSubmit?: () => void;
  title?: string;
  submitText?: string;
  isStatic?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ConfirmModal: React.FunctionComponent<ConfirmModalProps> = (props) => {
  return (
    <React.Fragment>
      <Modal
        id={props.id ?? `confirm-modal-${utils.newGuid()}`}
        show={props.show}
        setShow={props.setShow}
        title={props.title ?? 'Confirm'}
        submitText={props.submitText ?? 'Confirm'}
        onSubmit={props.onSubmit}
        isStatic={props.isStatic}
        size={props.size ?? 'sm'}>
        <div className='modal-content'>
          <div className='modal-body'>
            <p>Are you sure you want to delete user/s?</p>
            <button
              type='submit'
              className='btn btn-primary waves-effect waves-light mr-75 bg-red'>
              Yes
            </button>
            <button
              type='button'
              className='btn waves-effect waves-light mr-75'
              data-dismiss='modal'
              aria-label='Close'>
              No
            </button>
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default ConfirmModal;
