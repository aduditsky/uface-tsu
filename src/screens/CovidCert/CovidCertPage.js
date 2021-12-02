import React, { useState, useEffect } from 'react';
import Input from '../../components/Input/Input';
import css from './covid-styles.module.css';
import Select from '../../components/Select/Select';
import { Link, Redirect } from 'react-router-dom';
import photo from '../../images/no_photo.jpg';
import closeBtn from '../../images/close.svg';
import Lines from '../../images/lines/profile.svg';

import request from '../../request';
import NewPhoneInput from '../../components/PhoneInput/PhoneInput';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import Isemail from 'isemail';
import Loader from 'react-loader-spinner';
import Back from '../../components/Back/Back';
import CovidLogo from '../../images/covid-logo.png';
import Button from '../../components/Button/Button';

// Импорты из конфига
import { InstCode } from '../../config';
import Iframe from '../../components/Iframe/Iframe';

const CovidCertPage = () => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Spinner show={loading} />;
  }

  return (
    <div>
      <Back to='/profile' />
      <h1 className={css.Header}>COVID-19</h1>

      <div className={css.covidPreview}>
        <div className={css.covidLogo}>
          <img
            src={CovidLogo}
            alt={'Изображение Covid-19'}
            width={50}
            height={50}
          />
        </div>
        <div className={css.covidText}>
          QR-код <br /> Сведения о вакцинации
        </div>
      </div>

      <div className={css.buttons}>
        <span className={css.button}>Загрузить файл</span>
        <span className={css.button}>Сфотографировать QR-код</span>
      </div>

      <Iframe source='https://www.gosuslugi.ru/covid-cert/status/05434086-6142-4770-ac29-56279e3bca52?lang=ru' />

      <div className={css.enterBtn}>
        <Button
          onclick={() => {
            console.log(`Fire some Action`);
          }}
          to='/profile'
        >
          Сохранить
        </Button>
      </div>

      {/* <Modal
        open={openModal}
        close={() => setOpenModal(false)}
        title={title}
        text={textError}
        BtnClick={() => setOpenModal(false)}
        buttonTitle='Ок'
      /> */}
    </div>
  );
};

export default CovidCertPage;
