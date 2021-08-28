import { useState, useRef, useEffect } from 'react';
import photoExample from '../../images/photo.jpg';
import css from './MyPhotos.module.css';
import Back from '../../components/Back/Back';
import request from '../../request';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';

const MyPhotos = () => {
  // Init
  const [loadingData, setLoadingData] = useState(false);
  // Modal
  const [title, setTitle] = useState('');
  const [textError, setTextError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  // Photos
  const [mainPhoto, setMainPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  // Camera
  const camera = useRef();
  const [cameraSize, setCameraSize] = useState({
    width: 0,
    height: 0,
  });
  const [cameraEnable, setCameraEnable] = useState(null);
  const [seconds, setSeconds] = useState(3);
  // UploadPhoto
  let inpFile = null;
  const [photoNumber, setPhotoNumber] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoadingData(true);
    try {
      const mainPhotoRes = await request.getAuth('persident/folkimg');
      const imgExt = await request.getAuth('persident/folkimgext');
      if (imgExt.status === 'success') {
        let photosResArr = [];
        if (imgExt.photos.length >= 2) {
          photosResArr = imgExt.photos;
        } else if (imgExt.photos.length === 1) {
          photosResArr = imgExt.photos;
          photosResArr.push({
            base64: '',
            faceid: '',
          });
        } else {
          photosResArr.push({
            base64: '',
            faceid: '',
          });
        }
        console.log(photosResArr);
        setPhotos(photosResArr);
      }
      if (mainPhotoRes.status === 'success') {
        setMainPhoto(mainPhotoRes.imagedesc);
      }
      setLoadingData(false);
    } catch (error) {
      setTitle('Ошибка');
      setTextError(String(error));
      setOpenModal(true);
    }
  };

  const shot = async (cameraNumber) => {
    let secondsTmp = 3;
    let timer = setInterval(async () => {
      if (secondsTmp === 0) {
        var canvas = document.createElement('canvas');

        canvas.width = cameraSize.width;
        canvas.height = cameraSize.height;
        canvas
          .getContext('2d')
          .drawImage(camera.current, 0, 0, cameraSize.width, cameraSize.height);
        try {
          clearInterval(timer);
          setCameraEnable(null);
          setSeconds(3);
          uploadBase64(canvas.toDataURL(), cameraNumber);
        } catch (error) {
          console.log('errRes: ', error);
        }
      } else {
        secondsTmp -= 1;
        setSeconds(secondsTmp);
      }
    }, 1000);
  };

  const uploadFile = async (e) => {
    const file = e.currentTarget.files[0];
    const result = await toBase64(file).catch((e) => Error(e));
    uploadBase64(result, photoNumber);
  };

  const uploadBase64 = async (result, number) => {
    setLoadingData(true);
    try {
      const data = await request.postAuth('persident/folkimgext', [
        ['img64', result],
        ['faceid', photos[number].faceid || ''],
      ]);
      if (data.status === 'success') {
        console.log(data);
      } else if (data.status !== 'success') {
        setOpenModal(true);
        setTitle('Ошибка');
        setTextError(data.errordesc);
      } else {
        console.log(data);
      }
    } catch (error) {
      setTitle('Ошибка');
      setTextError(String(error));
      setOpenModal(true);
    }
    init();
  };

  return (
    <div className={css.base_container}>
      <Back to='/profile' />
      <div className={css.header}>Мои фото</div>
      <div>
        {mainPhoto && (
          <img className={css.mainImage} src={mainPhoto} alt='nophoto' />
        )}
      </div>
      <div className={css.grid}>
        {photos.map((photo, photoIndex) => (
          <>
            {!(
              typeof cameraEnable === 'number' && cameraEnable === photoIndex
            ) ? (
              <div>
                <img
                  className={css.image}
                  src={photo.base64 || photoExample}
                  alt='nophoto'
                />
              </div>
            ) : (
              <div>
                <video
                  className={css.video}
                  ref={camera}
                  width='340'
                  height='340'
                  autoplay
                ></video>
              </div>
            )}
            <div className={css.options}>
              {!(
                typeof cameraEnable === 'number' && cameraEnable === photoIndex
              ) ? (
                <>
                  <button
                    className={css.update}
                    onClick={async () => {
                      setLoadingData(true);
                      await request.MakeExtImgAsMain(
                        'persident/folkimgext?faceid=' + photo.faceid
                      );
                      sessionStorage.setItem('mainPhoto', photo.base64);
                      init();
                    }}
                  >
                    Сделать главной
                  </button>
                  <button
                    className={css.update}
                    onClick={() => {
                      setPhotoNumber(photoIndex);
                      inpFile.click();
                    }}
                  >
                    Загрузить фото
                  </button>
                  <button
                    onClick={() => {
                      if (
                        navigator.mediaDevices &&
                        navigator.mediaDevices.getUserMedia
                      ) {
                        navigator.mediaDevices
                          .getUserMedia({ video: true })
                          .then(function (stream) {
                            setCameraEnable(photoIndex);
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
                    className={css.update}
                  >
                    Сделать фото
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const data = await request.deletePhoto(
                          `persident/folkimgext?faceid=${photo.faceid}`
                        );
                        if (data.status !== 'error') {
                          console.log(data);
                          setOpenModal(true);
                          setTitle('Успешно');
                          init();
                        } else {
                          setTitle('Ошибка');
                          setOpenModal(true);
                          setTextError(data.errordesc);
                        }
                      } catch {}
                    }}
                    className={css.update}
                  >
                    Удалить
                  </button>
                </>
              ) : (
                <>
                  <h1>{seconds}</h1>
                  <button
                    className={css.update}
                    onClick={() => shot(photoIndex)}
                  >
                    Сфотографироваться
                  </button>
                </>
              )}
            </div>
          </>
        ))}
      </div>
      <Modal
        open={openModal}
        close={() => setOpenModal(false)}
        title={title}
        text={textError}
        BtnClick={() => setOpenModal(false)}
        buttonTitle='Ок'
      ></Modal>
      <Spinner show={loadingData} />
      <input
        onChange={uploadFile}
        style={{ display: 'none' }}
        type='file'
        ref={(inp) => (inpFile = inp)}
        accept='image/x-png,image/gif,image/jpeg'
      />
    </div>
  );
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default MyPhotos;
