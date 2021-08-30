import { useState, useRef, useEffect } from 'react';
import EmptyPhoto from '../../images/photo.jpg';
import Button from '../../components/Button/Button';
import css from './FormPart2.module.css';
import { Link, Redirect } from 'react-router-dom';
import Back from '../../components/Back/Back';
import smile from '../../images/smile.svg';
import validateIcon from '../../images/valid_icon.svg';
import Webcam from 'react-webcam';

const FormPart2 = () => {
  const [isCamera, setIsCamera] = useState(false);
  const [takeScreenshot, setScreenshot] = useState(false);
  const [takeing, setTakeIn] = useState(false);
  const [photo, setPhoto] = useState(
    sessionStorage.getItem('recoverPhoto') || ''
  );
  const [ok, setOk] = useState(false);
  const [debugPhoto, setDebugPhoto] = useState('');
  const [secondRemaining, setSeconds] = useState(3);
  //   const [isIOS, setIOS] = useState(false);
  //   const [cameraSize, setCameraSize] = useState({
  //     width: 0,
  //     height: 0,
  //   });
  const camera = useRef(null);
  function takePhoto() {
    // console.log(`Начало фотографии`);
    let timeToScreenshot = secondRemaining;

    setTakeIn(true);
    let timer = setInterval(() => {
      if (timeToScreenshot === 0) {
        let photoBase64 = camera.current.getScreenshot();

        console.log({ photoBase64 });

        sessionStorage.setItem('recoverPhoto', photoBase64);
        setPhoto(photoBase64);
        setDebugPhoto(photoBase64);

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
    const result = await toBase64(file).catch((e) => Error(e));
    // react-cropper
    setPhoto(result);
    sessionStorage.setItem('recoverPhoto', result);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const init = async () => {
    const recoverPhoto = sessionStorage.getItem('recoverPhoto');
    if (recoverPhoto) {
      setPhoto(recoverPhoto);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('recoverPhoto')) {
      setScreenshot(true);
    }
  }, []);

  let inpFile = null;

  if (ok) return <Redirect to='/formPart3' />;

  return (
    <div className={css.base_container}>
      <Back to='/formPart1' />
      <div className={css.header}>Подтвердите свою личность</div>
      <div className={css.content}>
        {isCamera ? (
          <div>
            <Webcam className={css.image} ref={camera} playsInline />
          </div>
        ) : (
          <div>
            {photo ? (
              <img className={css.image} src={photo} alt='photo' />
            ) : (
              <img className={css.image} src={EmptyPhoto} alt='nophoto' />
            )}
          </div>
        )}

        {!isCamera && !photo && <div>Необходимо добавить фото</div>}

        {isCamera && (
          <div className={css.takePhotoButton}>
            <p>Наведите камеру так, чтобы лицо поместилось в круг</p>
            {takeing && <p>{secondRemaining}</p>}
            <button type='button' className={css.smile}>
              <img
                style={{ cursor: 'pointer' }}
                onClick={takePhoto}
                src={smile}
                alt='smile'
              />
            </button>
          </div>
        )}

        {!isCamera && !takeScreenshot && (
          <div>
            <button
              className={css.startPhoto}
              onClick={() => {
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
          <Button
            disabled={!takeScreenshot}
            to='#'
            // to={takeScreenshot && '/formPart3'}
            // onclick={async () => {
            //   try {
            //     setNextBtn(true);
            //     const json = JSON.parse(sessionStorage.getItem('recoverData'));
            //     setLoading(true);
            //     const data = await request.post('persident/folkreg', [
            //       [
            //         'fio',
            //         `${json.lastName} ${json.firstName} ${json.patronymic}`,
            //       ],
            //       ['phone', json.phone],
            //       ['pwd', json.password],
            //       ['email', json.email],
            //       ['dateborn', json.dateborn],
            //       ['folkrole', json.role],
            //       ['institute', json.institute],
            //       ['img64', sessionStorage.getItem('recoverPhoto')],
            //  Тут надо парсить ссылку на компонент ConfirmEmail из App.js
            //       [
            //         'regactivatelink',
            //         'https://uface.su/#/ConfirmAccountFromMail/',
            //       ],
            //     ]);
            //     if (data.status !== 'error') {
            //       setLoading(false);
            //       console.log(data);
            //       setSuccess(true);
            //     } else {
            //       setLoading(false);
            //       setOpenModal(true);
            //       setTextError(data.errordesc);
            //       console.log(data);
            //     }
            //   } catch (error) {
            //     console.log('error: ', error);
            //     setOpenModal(true);
            //     setTextError(error);
            //   }
            // }}
          >
            Далее
          </Button>
        </div>

        {!isCamera && photo && (
          <div>
            <button
              className={css.startPhoto}
              onClick={() => {
                setSeconds(3);
                sessionStorage.removeItem('recoverPhoto');
                setIsCamera(true);
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
          enctype='multipart/form-data'
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
            <Link
              to='#'
              className={css.buttons}
              onClick={() => {
                inpFile.click();
              }}
            >
              Загрузить фото
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPart2;
