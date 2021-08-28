import React from 'react';
import InputMask from 'react-text-mask';
import valid_icon from '../../images/valid_icon.svg';
import css from '../Input/Input.module.css';

const PhoneInput = (props) => {
    const {
        setValue,
        valid,
        label,
        value,
    } = props

    return (
        <div className={css.input} >
           <InputMask
                mask={[ '+','7',' ','(', /[9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                guide={true}
                onChange={(event) => setValue(event.target.value)}
                value={value}
                className={css.input_native}
                {...props}
            />
            {
                valid && (
                    <img className={css.valid_icon} src={valid_icon} alt="ok_icon" />
                )
            }
            {
                label && (
                    <label className={css.label} >{label}</label>
                )
            }
        </div>
    )
}

export default PhoneInput;