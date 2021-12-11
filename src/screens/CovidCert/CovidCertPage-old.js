import React, { useState, useEffect } from 'react';
import css from './covid-styles.module.css';
// import { Link, Redirect } from 'react-router-dom';

import request from '../../request';
import Spinner from '../../components/Spinner/Spinner';
import Back from '../../components/Back/Back';
import CovidLogo from '../../images/covid-logo.png';
import Button from '../../components/Button/Button';
import { useQRCodeScan } from '../../lib/useQRCodeScan';
import { Html5Qrcode } from 'html5-qrcode';

// Импорты из конфига
import Iframe from '../../components/Iframe/Iframe';

const CovidCertPage = () => {
  const { getQrCode, updateQrCode } = request;
  const [loading, setLoading] = useState(false);
  const [reqErr, setRE] = useState(null);
  const [url, setUrl] = useState(null);
  let inpFile = null;

  if (loading) {
    setLoading(false);
  }

  const { startQrCode, decodedQRData, stopQrCode } = useQRCodeScan({
    qrcodeMountNodeID: 'qrcodemountnode',
  });

  useEffect(() => {
    getQrCode().then((result) => {
      console.log({ result });
      setUrl(result.url);
    });
    // Add logic to add the camera and scan it
    // startQrCode();
  }, [url, getQrCode]);

  const saveHandler = () => {
    console.log(`Fire some Action`);
  };

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
        <span
          className={css.button}
          onClick={() => {
            inpFile.click();
          }}
        >
          Загрузить файл
        </span>
        <span
          className={css.button}
          onClick={() => {
            startQrCode();
          }}
        >
          Сфотографировать QR-код
        </span>
      </div>

      <div className={css.imageBlock} id='qrcodemountnode'></div>
      {decodedQRData.isScanning && (
        <button
          className={css.button}
          onClick={() => {
            stopQrCode();
          }}
        >
          Остановить
        </button>
      )}
      {!!reqErr && <p>{reqErr}</p>}

      <div id='qr-scanned'></div>
      <Iframe source={!!url && url} />
      <div className={css.enterBtn}>
        <Button onclick={() => saveHandler()} to='/profile'>
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
      <input
        type='file'
        id='qr-input-file'
        accept='image/*'
        style={{ display: 'none' }}
        ref={(inp) => (inpFile = inp)}
        onChange={(e) => {
          if (e.target.files.length === 0) {
            return;
          }
          const imageFile = e.target.files[0];
          const html5QrCode = new Html5Qrcode('qr-scanned');

          // Scan QR Code
          html5QrCode
            .scanFile(imageFile, true)
            .then((decodedText) => {
              if (
                decodedText.includes('https://www.gosuslugi.ru/covid-cert/')
              ) {
                // console.log({ decodedText });
                // setQRFile(decodedText);
                updateQrCode(decodedText).then((result) => {
                  console.log({ result });
                  setRE(result.errordesc);
                });
              }
            })
            .catch((err) => {
              console.log(`Error scanning file. Reason: ${err}`);
            });
        }}
      />
    </div>
  );
};

export default CovidCertPage;
