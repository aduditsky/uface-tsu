import { useState, useRef, useEffect } from 'react';
import photo from '../../images/photo.jpg';
import Button from '../../components/Button/Button';
import css from './FormPart3.module.css';
import { Link, Redirect } from 'react-router-dom';
import Back from '../../components/Back/Back';
import ok from '../../images/valid_icon.svg';
import request from '../../request';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import smile from '../../images/smile.svg';

const FormPart3 = () => {
  const [loading, setLoading] = useState(false);
  const [image, setimage] = useState(
    sessionStorage.getItem('recoverPhoto') || photo || null
  );
  const [success, setSuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [textError, setTextError] = useState('');
  const [isCamera, setIsCamera] = useState(false);
  const [noPhoto, setNoPhoto] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);
  const [seconds, setSeconds] = useState(3);
  const [newPhoto, setNewPhoto] = useState(false);
  const [cameraSize, setCameraSize] = useState({
    width: 0,
    height: 0,
  });

  const camera = useRef();

  function shot(e) {
    e.preverntDefault();
    let secondsTmp = 3;
    let timer = setInterval(() => {
      if (secondsTmp === 0) {
        var canvas = document.createElement('canvas');
        canvas.width = cameraSize.width;
        canvas.height = cameraSize.height;
        canvas
          .getContext('2d')
          .drawImage(camera.current, 0, 0, cameraSize.width, cameraSize.height);

        setimage(canvas.toDataURL());
        setSeconds(3);
        setNoPhoto(false);
        setNewPhoto(false);
        setNextBtn(false);
        sessionStorage.setItem('recoverPhoto', canvas.toDataURL());
        clearInterval(timer);
      } else {
        setSeconds((prev) => prev - 1);
        secondsTmp -= 1;
      }
    }, 1000);
  }

  useEffect(() => {
    init();
  }, []);

  const onChangeFile = async (e) => {
    const file = e.currentTarget.files[0];
    const result = await toBase64(file).catch((e) => Error(e));
    setimage(result);
    sessionStorage.setItem('recoverPhoto', result);
    setNextBtn(false);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const init = async () => {
    if (sessionStorage.getItem('recoverPhoto')) {
      setimage(sessionStorage.getItem('recoverPhoto'));
    }
    console.log(success);
  };

  let inpFile = null;

  if (success) return <Redirect to='/success' />;

  return (
    <div className={css.base_container}>
      {!loading ? (
        <div>
          <Back to='/formPart1' />
          <div className={css.header}>Подтвердите свою личность</div>
          <div className={css.content}>
            {!noPhoto ? (
              <div>
                <div>
                  <img className={css.image} src={image} alt='nophoto' />
                </div>
                <div className={css.label}>
                  <label>
                    Операция завершена
                    <br /> успешно
                  </label>
                </div>
                <div>
                  <img className={css.ok_icon} src={ok} alt='ok' />
                </div>
              </div>
            ) : (
              <div className={css.app}>
                <video
                  className={css.image}
                  ref={camera}
                  width='340'
                  height='340'
                  autoplay
                ></video>
                <div className={css.label}>
                  <label>
                    Наведите камеру так, чтобы лицо поместилось в круг
                  </label>
                </div>
                <h1 className={css.timer}>{seconds}</h1>
                <div className={css.smile}>
                  <img src={smile} alt='smile' />
                </div>
                <div>
                  <Link to='#' className={css.buttons} onClick={(e) => {}}>
                    Сделать фото
                  </Link>
                </div>
              </div>
            )}
            <div className={css.nextBtn}>
              <Button
                disabled={nextBtn}
                onclick={async () => {
                  try {
                    setNextBtn(true);
                    const json = JSON.parse(
                      sessionStorage.getItem('recoverData')
                    );
                    setLoading(true);
                    const data = await request.post('persident/folkreg', [
                      [
                        'fio',
                        `${json.lastName} ${json.firstName} ${json.patronymic}`,
                      ],
                      ['phone', json.phone],
                      ['pwd', json.password],
                      ['email', json.email],
                      ['dateborn', json.dateborn],
                      ['folkrole', json.role],
                      ['institute', json.institute],
                      ['img64', sessionStorage.getItem('recoverPhoto')],
                      [
                        'regactivatelink',
                        'https://uface.su/#/ConfirmAccountFromMail/',
                      ],
                    ]);
                    if (data.status !== 'error') {
                      setLoading(false);
                      console.log(data);
                      setSuccess(true);
                    } else {
                      setLoading(false);
                      setOpenModal(true);
                      setTextError(data.errordesc);
                      console.log(data);
                    }
                  } catch (error) {
                    console.log('error: ', error);
                    setOpenModal(true);
                    setTextError(error);
                  }
                }}
                to='#'
              >
                Далее
              </Button>
            </div>
            <input
              onChange={onChangeFile}
              style={{ display: 'none' }}
              type='file'
              ref={(inp) => (inpFile = inp)}
              accept='image/x-png,image/gif,image/jpeg'
            />
            {!newPhoto ? (
              <div>
                <Link
                  to='#'
                  className={css.button}
                  onClick={() => {
                    setNoPhoto(true);
                    setIsCamera(true);
                    setNewPhoto(true);
                    if (
                      navigator.mediaDevices &&
                      navigator.mediaDevices.getUserMedia
                    ) {
                      navigator.mediaDevices
                        .getUserMedia({ video: true })
                        .then(function (stream) {
                          camera.current.srcObject = stream;
                          camera.current.play();
                          const { width, height } = stream
                            .getTracks()[0]
                            .getSettings();
                          setCameraSize({
                            width,
                            height,
                          });
                        });
                    }
                  }}
                >
                  Сфотографироваться заново
                </Link>
                <div className={css.button}>
                  {/* TODO: Сделать button */}
                  <Link
                    to='#'
                    className={css.button}
                    onClick={() => {
                      inpFile.click();
                    }}
                  >
                    Загрузить другое фото
                  </Link>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <Modal
            open={openModal}
            close={() => setOpenModal(false)}
            title='Ошибка'
            text={textError}
            BtnClick={() => setOpenModal(false)}
            buttonTitle='Ок'
          />
        </div>
      ) : (
        <Spinner show={loading} />
      )}
    </div>
  );
};

export default FormPart3;
