import React from 'react';
import { Link } from 'react-router-dom';
import css from './Button.module.css';

const Button = ({ children, to, disabled, onclick }) => {
  return (
    <div className={css.Btn_native}>
      {disabled ? (
        <Link onClick={onclick} className={css.disabled} to='/'>
          {children}
        </Link>
      ) : (
        <Link onClick={onclick} className={css.button} to={to}>
          {children}
        </Link>
      )}
    </div>
  );
};

export default Button;
