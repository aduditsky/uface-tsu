import { useState, useRef, useEffect } from 'react';
import EmptyPhoto from '../../images/photo.jpg';
import css from './FormPart2.module.css';
import { Redirect } from 'react-router-dom';
import Back from '../../components/Back/Back';
import smile from '../../images/smile.svg';
import validateIcon from '../../images/valid_icon.svg';
import Webcam from 'react-webcam';
import PictureCropper from '../../components/Cropper/Cropper';
import request from '../../request';
import Modal from '../../components/Modal/Modal';
import Lines from '../../images/lines/profile.svg';
import imageCompression from 'browser-image-compression';
import Loader from 'react-loader-spinner';

// Импорты из конфига
import { baseUrl } from '../../config';

const FormPart2 = () => {
  const [isCamera, setIsCamera] = useState(false);
  const [takeScreenshot, setScreenshot] = useState(false);
  const [takeing, setTakeIn] = useState(false);
  const [isLoadedPhoto, setLoadedPhoto] = useState(false);
  // eslint-disable-next-line
  const [nextBtn, setNextBtn] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [textError, setTextError] = useState('');
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(
    sessionStorage.getItem('recoverPhoto') || null
  );
  const [secondRemaining, setSeconds] = useState(3);
  const [isConfirming, setIsConfirming] = useState(false);

  //Для подтверждения регистрации
  const [ok, setSuccess] = useState(false);

  const camera = useRef(null);
  function takePhoto() {
    let timeToScreenshot = secondRemaining;

    setTakeIn(true);
    let timer = setInterval(() => {
      if (timeToScreenshot === 1) {
        let photoBase64 = camera.current.getScreenshot();
        sessionStorage.setItem('recoverPhoto', photoBase64);
        setPhoto(photoBase64);

        setTakeIn(false);
        setIsCamera(false);
        setScreenshot(true);

        clearInterval(timer);
      } else {
        setSeconds((prev) => prev - 1);
        timeToScreenshot -= 1;
      }
    }, 1000);
  }
  const onChangeFile = async (e) => {
    const file = e.currentTarget.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1080,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const result = await toBase64(compressedFile).catch((e) => Error(e));

      // react-cropper
      setPhoto(result);
      setScreenshot(true);
      sessionStorage.setItem('recoverPhoto', result);
      setLoadedPhoto(true);
    } catch (error) {
      // console.log(error);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Может пригодиться в будущем
  // const init = async () => {
  //   const recoverPhoto = sessionStorage.getItem('recoverPhoto');
  //   if (recoverPhoto) {
  //     setPhoto(recoverPhoto);
  //   }
  // };

  // recoverPhoto
  // recoverData

  useEffect(() => {
    if (sessionStorage.getItem('recoverPhoto')) {
      setScreenshot(true);
    }
  }, []);

  const updateCroppedPhoto = (photo) => {
    setPhoto(photo);
  };

  let inpFile = null;

  if (!sessionStorage.getItem('recoverData'))
    return <Redirect to='/registration' />;
  if (ok) return <Redirect to='/success' />;

  const SubmitHandler = async (e) => {
    e.preventDefault();
    setIsConfirming(true);
    try {
      setNextBtn(true);
      const json = JSON.parse(sessionStorage.getItem('recoverData'));
      setLoading(true);
      sessionStorage.setItem('phoneConfirm', json.phone);
      const data = await request.post('persident/folkreg', [
        ['fio', `${json.lastName} ${json.firstName} ${json.patronymic}`],
        ['lname', json.lastName],
        ['fname', json.firstName],
        ['sname', json.patronymic],
        ['phone', json.phone],
        ['pwd', json.password],
        ['email', json.email],
        ['dateborn', json.dateborn],
        ['folkrole', json.role],
        ['institute', json.institute],
        ['img64', sessionStorage.getItem('recoverPhoto')],
        //  Тут надо парсить ссылку на компонент ConfirmEmail из App.js
        ['regactivatelink', baseUrl],
      ]);
      if (data.status !== 'error') {
        setLoading(false);
        // console.log(data);
        setSuccess(true);
        setIsConfirming(false);
      } else {
        setIsConfirming(false);
        setLoading(false);
        setOpenModal(true);
        setTextError(data.errordesc);
        // console.log(data);
      }
    } catch (error) {
      // console.log('error: ', error);
      setIsConfirming(false);
      setOpenModal(true);
      setTextError(error);
    }
  };

  return (
    <div className={css.base_container}>
      <img src={Lines} className={css.lines} alt={`AnotherCoolLines3`} />
      <img src={Lines} className={css.secondLines} alt={`AnotherCoolLines2`} />
      <Back to='/registration' />
      {isLoadedPhoto && (
        <PictureCropper
          img={sessionStorage.getItem('recoverPhoto')}
          callBackFunc={() => setLoadedPhoto(false)}
          updateCropped={updateCroppedPhoto}
        ></PictureCropper>
      )}
      <div className={css.header}>Подтвердите свою личность</div>
      <form onSubmit={(e) => SubmitHandler(e)}>
        <div className={css.content}>
          {isCamera ? (
            <div>
              <Webcam
                screenshotQuality='1'
                screenshotFormat='image/jpeg'
                className={css.image}
                ref={camera}
                playsInline
                minScreenshotHeight={720}
              />
            </div>
          ) : (
            <div>
              {photo ? (
                <img className={css.image} src={photo} alt='hasphoto' />
              ) : (
                <img className={css.image} src={EmptyPhoto} alt='nophoto' />
              )}
            </div>
          )}

          {!isCamera && !photo && (
            <>
              <div>Необходимо добавить фото</div>
              <a
                className={css.photoInstruction}
                href='/photo-instruction.pdf'
                target='_blank'
              >
                Как необходимо делать фото
              </a>
            </>
          )}

          {isCamera && (
            <div className={css.takePhotoButton}>
              <p>Наведите камеру так, чтобы лицо поместилось в круг</p>
              {takeing && <p className={css.RingCount}>{secondRemaining}</p>}
              {!takeing && (
                <button type='button' onClick={takePhoto} className={css.smile}>
                  <img style={{ cursor: 'pointer' }} src={smile} alt='smile' />
                  <span className={css.smileSpan}>Сфотографироваться</span>
                </button>
              )}
            </div>
          )}

          {!isCamera && !takeScreenshot && (
            <div>
              <button
                className={css.startPhoto}
                onClick={() => {
                  setLoadedPhoto(false);
                  setIsCamera(true);
                }}
              >
                Сфотографироваться
              </button>
            </div>
          )}

          {takeScreenshot && (
            <div className={css.takePhotoButton}>
              <p>Операция завершена успешно</p>
              <div className={css.smile}>
                <img src={validateIcon} alt='smile' />
              </div>
            </div>
          )}

          <div className={css.nextBtn}>
            {!isConfirming ? (
              <button
                type='submit'
                className={takeScreenshot ? css.button : css.disabled}
                disabled={!takeScreenshot}
              >
                Подтвердить
              </button>
            ) : (
              <Loader type='Bars' color='#247ABF' height={50} width={50} />
            )}
          </div>

          {!isCamera && photo && (
            <div>
              <button
                className={css.startPhoto}
                onClick={() => {
                  setSeconds(3);
                  sessionStorage.removeItem('recoverPhoto');
                  setIsCamera(true);
                  setLoadedPhoto(false);
                  setScreenshot(false);
                  setPhoto('');
                }}
              >
                Сфотографироваться заново
              </button>
            </div>
          )}
          <form
            id='idregform'
            name='regform'
            action=''
            encType='multipart/form-data'
          >
            <input
              onChange={onChangeFile}
              style={{ display: 'none' }}
              type='file'
              id='fileimg'
              ref={(inp) => (inpFile = inp)}
              accept='image/x-png,image/gif,image/jpeg'
            ></input>
            <div className={css.buttons}>
              <button
                type='button'
                className={css.UploadPhoto}
                onClick={() => {
                  sessionStorage.removeItem('recoverPhoto');
                  setIsCamera(false);
                  inpFile.click();
                }}
              >
                Загрузить фото
              </button>
            </div>
          </form>
        </div>
      </form>
      <Modal
        open={openModal}
        close={() => setOpenModal(false)}
        title='Ошибка'
        text={textError}
        BtnClick={() => setOpenModal(false)}
        buttonTitle='Ок'
      />
    </div>
  );
};

export default FormPart2;
