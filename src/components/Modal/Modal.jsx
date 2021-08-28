import React from 'react'
import Button from '../Button/Button'
import css from './Modal.module.css'

const Modal = ({ children, title, text, BtnClick, open, close, buttonTitle }) => (
    <div>
        {
            open && (
                <>
                    <div onClick={close} className={css.modalContainer} />
                    <div className={css.modalCard}>
                        <div className={css.modalContent}>
                            <div className={css.modalData}>
                                <h1>{title}</h1>
                                <p>{text}</p>
                                {children}
                                <Button onclick={BtnClick}>{buttonTitle}</Button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    </div>
)

export default Modal