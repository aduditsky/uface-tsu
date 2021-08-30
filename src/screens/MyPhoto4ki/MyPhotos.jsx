import { useState, useRef, useEffect } from 'react';
import photoExample from '../../images/photo.jpg';
import css from './MyPhotos.module.css';
import Back from '../../components/Back/Back';
import request from '../../request';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
// import { getCountryCallingCode } from 'react-phone-number-input';
import Webcam from 'react-webcam';

const MyPhotos = ({ history }) => {
  // Init
  const [isCamera, setIsCamera] = useState(false);
  const [takeScreenshot, setScreenshot] = useState(false);
  const [cameraType, setCameraType] = useState();
  const [takeing, setTakeIn] = useState(false);
  const [photo, setPhoto] = useState(
    sessionStorage.getItem('recoverPhoto') || ''
  );
  const [ok, setOk] = useState(false);
  const [secondRemaining, setSeconds] = useState(3);
  const [loadingData, setLoadingData] = useState(false);
  // Modal
  const [title, setTitle] = useState('');
  const [textError, setTextError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  // Photos
  const [mainPhoto, setMainPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  // Camera
  const camera = useRef(null);
  // UploadPhoto
  let inpFile = null;
  const [photoNumber, setPhotoNumber] = useState(null);

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

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
      } else {
        console.log(`Делаем редирект`);
        history.push('/login');
      }
      setLoadingData(false);
    } catch (error) {
      setTitle('Ошибка');
      setTextError(String(error));
      setOpenModal(true);
    }
  };

  function takePhoto() {
    console.log(`Начало фотографии`);
    let timeToScreenshot = secondRemaining;

    setTakeIn(true);
    let timer = setInterval(() => {
      if (timeToScreenshot === 0) {
        let photoBase64 = camera.current.getScreenshot();

        console.log({ photoBase64 });

        sessionStorage.setItem('extPhoto', photoBase64);
        setPhoto(photoBase64);

        setTakeIn(false);
        setIsCamera(false);
        setScreenshot(true);
        setCameraType();

        clearInterval(timer);

        uploadBase64(photoBase64, cameraType);
      } else {
        setSeconds((prev) => prev - 1);
        timeToScreenshot -= 1;
      }
    }, 1000);
  }

  const uploadFile = async (e) => {
    const file = e.currentTarget.files[0];
    const result = await toBase64(file).catch((e) => Error(e));
    uploadBase64(result, photoNumber);
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
          <div className={css.extPhotoItem} key={photo.faceid}>
            {!isCamera ? (
              <div className={css.ImageDiv}>
                <img
                  className={css.image}
                  src={photo.base64 || photoExample}
                  alt='nophoto'
                />
              </div>
            ) : photoIndex === cameraType ? (
              <div className={css.ImageDiv}>
                <Webcam className={css.image} ref={camera} playsInline />
              </div>
            ) : (
              <div className={css.ImageDiv}>
                <img
                  className={css.image}
                  src={photo.base64 || photoExample}
                  alt='nophoto'
                />
              </div>
            )}
            <div className={css.options}>
              {isCamera && cameraType === photoIndex ? (
                <>
                  <h1>{secondRemaining}</h1>
                  <button
                    className={css.update}
                    onClick={() => {
                      takePhoto();
                    }}
                  >
                    Сфотографироваться
                  </button>
                </>
              ) : (
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
                      setIsCamera(true);
                      setCameraType(photoIndex);
                      console.log(`Выбрана камера ` + photoIndex);
                    }}
                    className={css.update}
                  >
                    Сделать фото
                  </button>
                  <button
                    onClick={async (e) => {
                      console.log({ photo });
                      try {
                        const data = await request.deletePhoto(
                          `persident/folkimgext?faceid=${photo.faceid}`
                        );
                        console.log(data);
                        if (data.status !== 'error') {
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
              )}
            </div>
          </div>
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