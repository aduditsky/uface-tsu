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
<<<<<<< HEAD
  let inpFile = null;
=======
  const [isSaving, setSave] = useState(false);
  const [isSuccessful, setSuccess] = useState(false);
  let inputFile = null;
  let histrory = useHistory();
>>>>>>> ff5a08b0a73b2e46be3a55791a21c0df6ca94b1f

  if (loading) {
    setLoading(false);
  }

  const { startQrCode, decodedQRData, stopQrCode } = useQRCodeScan({
    qrcodeMountNodeID: 'qrcodemountnode',
  });

  useEffect(() => {
    getQrCode().then((result) => {
      // console.log({ result });
      setUrl(result.url);
    });
    // Add logic to add the camera and scan it
    // startQrCode();
<<<<<<< HEAD
  }, [url, getQrCode]);
=======
  }, [getQrCode]);
>>>>>>> ff5a08b0a73b2e46be3a55791a21c0df6ca94b1f

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
<<<<<<< HEAD
            inpFile.click();
=======
            inputFile.click();
>>>>>>> ff5a08b0a73b2e46be3a55791a21c0df6ca94b1f
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
<<<<<<< HEAD
      {!!reqErr && <p>{reqErr}</p>}

      <div id='qr-scanned'></div>
      <Iframe source={!!url && url} />
      <div className={css.enterBtn}>
        <Button onclick={() => saveHandler()} to='/profile'>
          Сохранить
        </Button>
      </div>
=======
      <div id='qr-scanned'></div>
      <Iframe source={!!url && url} />
      <div className={css.enterBtn}>
        <button
          className={css.buttonBig}
          type='button'
          onclick={() => {
            console.log(`Fire some Action`);
            updateQrCode(url).then((result) => {
              console.log({ result });
            });
          }}
          to='/profile'
        >
          {!isSaving
            ? 'Сохранить'
            : isSuccessful && isSaving
            ? 'Успешно'
            : 'Попробуйте еще раз'}
        </button>
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
>>>>>>> ff5a08b0a73b2e46be3a55791a21c0df6ca94b1f
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
