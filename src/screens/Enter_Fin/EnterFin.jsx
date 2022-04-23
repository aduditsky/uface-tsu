import React from 'react';
// import tsu_logo from '../../images/tsu_logo.png';
// import faceelook from '../../images/faceelook.png';

import {
  baseUrl,
  FaceELookLogo,
  TextEnterUniversity,
  UniversityLogo,
} from '../../config';

import Button from '../../components/Button/Button';
import css from './Enter_Fin.module.css';
import { Link, Redirect } from 'react-router-dom';
// eslint-disable-next-line
// import sber_icon from '../../images/sber_icon.svg';

//TODO
//Rename => MainScreen
const EnterFin = () => {
  if (window.location.href.split('key=')[1])
    return (
      <Redirect
        // eslint-disable-next-line
        to={'/confirm-email' + '?key=' + window.location.href.split('key=')[1]}
      />
    );
  if (window.location.href.split('fio=')[1]) {
    sessionStorage.removeItem('recoverPhoto');
    sessionStorage.removeItem('recoverData');
    sessionStorage.removeItem('phoneConfirm');
    sessionStorage.removeItem('mainPhoto');
    sessionStorage.clear();
    return (
      <Redirect
        // eslint-disable-next-line
        to={'/registration' + '?fio=' + window.location.href.split('fio=')[1]}
      />
    );
  }
  if (window.location.href.split('tid=')[1])
    return (
      <Redirect
        // eslint-disable-next-line
        to={'/login' + '?tid=' + window.location.href.split('?tid=')[1]}
      />
    );

  return (
    <div className={css.base_container}>
      <div className={css.header}>
        <img src={FaceELookLogo} className={css.faceelook} alt='faceelook' />
      </div>
      <div className={css.content}>
        <div className={css.image}>
          <img
            className={css.tsuLogo}
            src={UniversityLogo}
            alt='university_logo'
          />
        </div>
        {TextEnterUniversity === 'ТГУ' && (
          <div className={css.log_in_tsu}>
            <a
              href={`${baseUrl}/persident/tgulogin`}
              className={css.log_in_with}
            >
              Войти по {TextEnterUniversity}.Аккаунты
            </a>
          </div>
        )}
        <div className={css.enterBtn}>
          <Button to='/login'>Войти</Button>
        </div>
        <div>
          <Link
            to='/registration'
            onClick={() => {
              sessionStorage.removeItem('recoverPhoto');
              sessionStorage.removeItem('recoverData');
              sessionStorage.removeItem('phoneConfirm');
              sessionStorage.removeItem('mainPhoto');
            }}
            className={css.regBtn}
          >
            Зарегистрироваться
          </Link>
        </div>
        {/* Сбербанк отключен по просьбе  */}
        {/* <div className={css.log_in}>
          <div className={css.log_in_cber}>
            <img className={css.sber_icon} src={sber_icon} alt='nophoto' />
            <a href='/' className={css.log_in_with}>
              Войти по Сбербанк ID
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EnterFin;
