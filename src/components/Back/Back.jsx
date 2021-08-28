import React from 'react';
import css from './Back.module.css';
import back from '../../images/back.svg';
import { Link } from 'react-router-dom';

const Back = ({ to, onclick }) => {
  return (
    <Link className={css.back} onClick={onclick} to={to}>
      <img src={back} alt='back' />
    </Link>
  );
};

export default Back;
