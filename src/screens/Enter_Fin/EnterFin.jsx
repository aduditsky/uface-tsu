import React from 'react';
import tsu_logo from '../../images/tsu_logo.png';
import faceelook from '../../images/faceelook.png';
import Button from '../../components/Button/Button';
import css from './Enter_Fin.module.css';
import { Link } from 'react-router-dom';
import sber_icon from '../../images/sber_icon.svg';

//TODO
//Rename => MainScreen
const EnterFin = () => {
  return (
    <div className={css.base_container}>
      <div className={css.header}>
        <img src={faceelook} className={css.faceelook} alt='faceelook' />
      </div>
      <div className={css.content}>
        <div className={css.image}>
          <img className={css.tsuLogo} src={tsu_logo} alt='tsu_logo' />
        </div>
        <div className={css.log_in_tsu}>
          <a href='/persident/tgulogin' className={css.log_in_with}>
            Войти по ТГУ.Аккаунты
          </a>
        </div>
        <div className={css.enterBtn}>
          <Button to='/login'>Войти</Button>
        </div>
        <div>
          <Link to='/formPart1' className={css.regBtn}>
            Зарегистрироваться
          </Link>
        </div>
        <div className={css.log_in}>
          <div className={css.log_in_cber}>
            <img className={css.sber_icon} src={sber_icon} alt='nophoto' />
            <a href='/' className={css.log_in_with}>
              Войти по Сбербанк ID
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterFin;
