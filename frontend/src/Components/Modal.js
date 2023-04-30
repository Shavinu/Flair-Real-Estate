import React, { useEffect } from 'react'
import classNames from 'classnames';
import utils from '../Utils';
import { ComponentProps } from "./index";

interface ModalProps extends ComponentProps {
  title: string;
  id?: string;
  show?: boolean;
  setShow?: (show: any) => void;
  size?: 'xs' | 'sm' | 'lg' | 'xl';
  isStatic?: boolean;
  onSubmit?: () => void;
  footer?: any;
  submitText?: string;
}

const Modal: React.FunctionComponent<ModalProps> = (props) => {
  let {
    title,
    id = `modal-${utils.newGuid()}`,
    show,
    setShow,
    children,
    size = 'md',
    isStatic = false,
    onSubmit,
    footer,
    submitText,
  } = props;

  const onCloseModal = () => {
    setShow && setShow(false);
  }

  useEffect(() => {
    if (isStatic) {
      document.getElementById(id)?.setAttribute('data-backdrop', 'false');
      // $(id).modal({ backdrop: 'static', keyboard: false });
    }
  }, [id, isStatic]);

  useEffect(() => {
    window.jQuery(`#${id}`).modal(show ? 'show' : 'hide');
  }, [id, show]);

  return <React.Fragment>
    <div className={classNames('modal fade')} id={id} tabIndex={-1} role="dialog" aria-labelledby="modal-fadein" aria-hidden="true" onClick={onCloseModal}>
      <div className={classNames('modal-dialog modal-dialog-scrollable', size ? `modal-${size}` : '')} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="modal-body">
            {children}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-flat-secondary" data-dismiss="modal" onClick={onCloseModal}>Close</button>

            {onSubmit && <button type="button" className="btn btn-flat-success" onClick={onSubmit}>
              <i className="fa fa-check"></i> {submitText ?? 'Submit'}
            </button>}
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
}

export default Modal
