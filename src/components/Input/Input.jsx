import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import css from "./Input.module.css";
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
    type = "text", disabled
  } = props;

  return (
    <div className={css.input}>
      {type === "date" ? (
        <IMaskInput
          className={css.input_native}
          disabled={disabled}
          mask={Date}
          min={new Date(1950, 0, 1)}
          max={new Date(2008, 0, 1)}
          lazy={false}
          placeholder={"2281337"}
          onAccept={
            (value) => setValue(value)
          }
          value={value}
        />
      ) : (
        enterInput ? (
          <input
            maxLength={maxLength}
            onChange={(event) => setValue(event.target.value)}
            value={value}
            className={css.enterInput}
            type={type}
            placeholder={placeholder}
            {...props}
          />) : password ? (
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
          : enterPassword ? (
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
            <input
              maxLength={maxLength}
              onChange={(event) => setValue(event.target.value)}
              value={value}
              className={css.input_native}
              type={type}
              placeholder={placeholder}
              {...props}
            />
          )
      )}
      {valid && (
        <img className={css.valid_icon} src={valid_icon} alt="ok_icon" />
      )}
      {EyeOpen && (
        <button className={css.eyeButton} onClick={() => setEyeOpen(!eyeOpen)}>
          <img
            src={eyeOpen ? eyeOpenImg : eyeCloseImg}
            alt="visiblePassword"
            className={css.eye}
          />
        </button>
      )}
      {label && <label className={css.label}>{label}</label>}
    </div>
  );
};

export default Input;
