import React, { useState, useEffect } from 'react';
import css from './covid-styles.module.css';
import { Link, Redirect } from 'react-router-dom';

import request from '../../request';
import Spinner from '../../components/Spinner/Spinner';
import Back from '../../components/Back/Back';
import CovidLogo from '../../images/covid-logo.png';
import Button from '../../components/Button/Button';
import { useQRCodeScan } from '../../lib/useQRCodeScan';

// Импорты из конфига
import Iframe from '../../components/Iframe/Iframe';

const CovidCertPage = () => {
  const [loading, setLoading] = useState(false);
  const [isScanning, SetScanning] = useState(false);

  const { startQrCode, decodedQRData, stopQrCode } = useQRCodeScan({
    qrcodeMountNodeID: 'qrcodemountnode',
  });

  useEffect(() => {
    // Add logic to add the camera and scan it
    // startQrCode();
  }, []);

  console.log({ decodedQRData });

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
        <span
          className={css.button}
          onClick={() => {
            startQrCode();
            SetScanning(true);
          }}
        >
          Сфотографировать QR-код
        </span>
      </div>

      <div id='qrcodemountnode'></div>
      {decodedQRData.isScanning && (
        <button
          onClick={() => {
            stopQrCode();
          }}
        >
          Остановить
        </button>
      )}

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
