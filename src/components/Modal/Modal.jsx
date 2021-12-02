import React from 'react';
import css from './Modal.module.css';

const Modal = ({
  children,
  title,
  text,
  BtnClick,
  open,
  close,
  buttonTitle,
}) => (
  <>
    {open && (
      <>
        <div onClick={close} className={css.modalContainer} />
        <div className={css.modalCard}>
          <div className={css.modalContent}>
            <div className={css.modalData}>
              <h1>{title}</h1>
              <p>{text}</p>
              {children}
              <button className={css.button} onClick={BtnClick}>
                {buttonTitle}
              </button>
            </div>
          </div>
        </div>
      </>
    )}
  </>
);

export default Modal;
