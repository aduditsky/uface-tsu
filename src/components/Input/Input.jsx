import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import css from './Input.module.css';
import valid_icon from '../../images/valid_icon.svg';
import eyeOpenImg from '../../images/eyeOpenImg.svg';
import eyeCloseImg from '../../images/eyeCloseImg.svg';

const Input = (props) => {
  const [eyeOpen, setEyeOpen] = useState(false);
  const {
    enterInput = false,
    setValue,
    enterPassword = false,
    password = false,
    maxLength,
    placeholder,
    valid = false,
    label,
    value,
    EyeOpen,
    dateType,
    eMail,
    nonvalidicon = true,
    // enter,
    disabled,
  } = props;

  let type = 'text';

  if (password || enterPassword) {
    eyeOpen ? (type = 'text') : (type = 'password');
  }

  // let Today = Date()

  return (
    <div className={css.input}>
      {dateType && (
        <IMaskInput
          className={css.input_native}
          disabled={disabled}
          mask={Date}
          min={new Date(1910, 0, 1)}
          max={new Date(2008, 0, 1)}
          lazy={false}
          type='text'
          placeholder={'2281337'}
          onAccept={(value) => setValue(value)}
          value={value}
        />
      )}
      {enterInput && (
        <input
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
          value={value}
          className={css.enterInput}
          type={type}
          placeholder={placeholder}
          {...props}
        />
      )}
      {password && EyeOpen ? (
        <input
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
          value={value}
          className={eyeOpen ? css.inputPasswordOpen : css.inputPasswordClose}
          type={type}
          placeholder={placeholder}
          {...props}
        />
      ) : (
        password &&
        !EyeOpen && (
          <input
            maxLength={maxLength}
            onChange={(event) => setValue(event.target.value)}
            value={value}
            className={eyeOpen ? css.inputPasswordOpen : css.inputPasswordClose}
            type={type}
            placeholder={placeholder}
            {...props}
          />
        )
      )}
      {enterPassword && EyeOpen ? (
        <input
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
          value={value}
          className={eyeOpen ? css.enterPasswordOpen : css.enterPasswordClose}
          type={type}
          placeholder={placeholder}
          {...props}
        />
      ) : (
        enterPassword &&
        !EyeOpen && (
          <input
            maxLength={maxLength}
            onChange={(event) => setValue(event.target.value)}
            value={value}
            className={eyeOpen ? css.enterPasswordOpen : css.enterPasswordClose}
            type={type}
            placeholder={placeholder}
            {...props}
          />
        )
      )}
      {eMail && (
        <input
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
          value={value}
          className={css.input_native}
          type='email'
          placeholder={placeholder}
          {...props}
        />
      )}
      {!enterPassword && !password && !enterInput && !dateType && !eMail && (
        <input
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
          value={value}
          className={css.input_native}
          type={type}
          placeholder={placeholder}
          {...props}
        />
      )}
      {valid && nonvalidicon && (
        <img className={css.valid_icon} src={valid_icon} alt='ok_icon' />
      )}
      {EyeOpen && (
        <button
          type='button'
          className={css.eyeButton}
          onClick={(e) => {
            setEyeOpen(!eyeOpen);
          }}
        >
          <img
            src={eyeOpen ? eyeOpenImg : eyeCloseImg}
            alt='visiblePassword'
            className={css.eye}
          />
        </button>
      )}
      {label && <label className={css.label}>{label}</label>}
    </div>
  );
};

export default Input;
