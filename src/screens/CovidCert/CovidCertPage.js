import React, { useState, useEffect } from 'react';
import css from './covid-styles.module.css';
// import { Link, Redirect } from 'react-router-dom';

import { useHistory } from 'react-router-dom';
import request from '../../request';
import Spinner from '../../components/Spinner/Spinner';
import Back from '../../components/Back/Back';
import CovidLogo from '../../images/covid-logo.png';
import { useQRCodeScan } from '../../lib/useQRCodeScan';
import { Html5Qrcode } from 'html5-qrcode';

// Импорты из конфига
import Iframe from '../../components/Iframe/Iframe';

const CovidCertPage = () => {
  const { getQrCode, updateQrCode } = request;
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const [isSaving, setSave] = useState(false);
  const [isSuccessful, setSuccess] = useState(null);
  const [errSaveMsg, setMsg] = useState(null);
  let inputFile = null;
  let histrory = useHistory();

  if (loading) {
    setLoading(false);
  }

  const { startQrCode, decodedQRData, stopQrCode } = useQRCodeScan({
    qrcodeMountNodeID: 'qrcodemountnode',
    // closeAfterScan: false,
  });

  useEffect(() => {
    if (decodedQRData.data?.includes('https://www.gosuslugi.ru/covid-cert/')) {
      setUrl(decodedQRData.data);
    }
    getQrCode().then((result) => {
      if (result.status === 'success') {
        setUrl(result.url);
      }
    });

    // Add logic to add the camera and scan it
    // startQrCode();
  }, [getQrCode, decodedQRData]);

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
            inputFile.click();
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

      <div id='qrcodemountnode'></div>
      {decodedQRData.isScanning && (
        <button
          className={css.buttonStop}
          onClick={() => {
            stopQrCode();
          }}
        >
          Остановить
        </button>
      )}
      <div id='qr-scanned'></div>
      <Iframe source={!!url && url} />
      <div className={css.enterBtn}>
        <button
          className={css.buttonBig}
          type='button'
          onClick={() => {
            setSave(true);
            updateQrCode(url)
              .then((result) => {
                console.log({ result });
                if (result.status === 'success') {
                  setSuccess(true);
                  histrory.push('/profile');
                }
                if (result.status === 'error') {
                  setSuccess(false);
                  setMsg(result.errordesc);
                }
              })
              .catch((err) => {
                // failure, handle it.
                setSuccess(false);
                console.log(`Save is not successuf. Reason: ${err}`);
              });
            setSave(false);
          }}
        >
          {!isSaving
            ? 'Сохранить'
            : isSuccessful && isSaving
            ? 'Сохраняем...'
            : 'Попробуйте еще раз'}
        </button>
        {errSaveMsg && url && <p>{errSaveMsg}</p>}
      </div>
      <input
        type='file'
        id='qr-input-file'
        style={{ display: 'none' }}
        ref={(ref) => (inputFile = ref)}
        accept='image/*'
        onChange={(e) => {
          if (e.target.files.length === 0) {
            return;
          }

          const imageFile = e.target.files[0];
          const html5QrCode = new Html5Qrcode('qr-scanned');

          // Scan QR Code
          html5QrCode
            .scanFile(imageFile, false)
            .then((decodedText) => {
              // success, use decodedText
              if (
                decodedText.includes('https://www.gosuslugi.ru/covid-cert/')
              ) {
                setUrl(decodedText);
              }
            })
            .catch((err) => {
              // failure, handle it.
              console.log(`Error scanning file. Reason: ${err}`);
            });

          e.target.value = '';
        }}
      />
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
