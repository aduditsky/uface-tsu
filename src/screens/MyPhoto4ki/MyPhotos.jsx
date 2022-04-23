import { useState, useRef, useEffect } from 'react';
import photoExample from '../../images/photo.jpg';
import css from './MyPhotos.module.css';
import Back from '../../components/Back/Back';
import request from '../../request';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
// import { getCountryCallingCode } from 'react-phone-number-input';
import Webcam from 'react-webcam';
import PictureCropper from '../../components/Cropper/Cropper';
import Lines from '../../images/lines/profile.svg';
import { useHistory } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const MyPhotos = () => {
  let history = useHistory();
  // Init
  const [isCamera, setIsCamera] = useState(false);
  // eslint-disable-next-line
  const [takeScreenshot, setScreenshot] = useState(false);
  const [cameraType, setCameraType] = useState();
  // eslint-disable-next-line
  const [takeing, setTakeIn] = useState(false);
  const [isLoadedPhoto, setLoadedPhoto] = useState(false);
  // eslint-disable-next-line
  const [photo, setPhoto] = useState('');
  const [bufferPhoto, setBufferPhoto] = useState(null);
  // eslint-disable-next-line
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
  const [dataIlr, setDataIrl] = useState('');

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, [dataIlr]);

  const updateCroppedPhoto = (photo) => {
    setPhoto(photo);
    uploadBase64(sessionStorage.getItem('recoverPhoto'), photoNumber);
  };

  const uploadBase64 = async (result, number) => {
    setLoadingData(true);
    try {
      const data = await request.postAuth('persident/folkimgext', [
        ['img64', result],
        ['faceid', photos[number].faceid || ''],
      ]);
      if (data.status === 'success') {
        // console.log(data);
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

  const updateToken = async () => {
    const data = await request.postToken('persident/folkreftok');
    // console.log(data.rtid, data.tid);
    localStorage.setItem('token', data.tid);
    localStorage.setItem('rtoken', data.rtid);
    if (data.status === 'error') {
      history.push('/login');
    }
  };

  const init = async () => {
    setLoadingData(true);
    try {
      const mainPhotoRes = await request.getAuth('persident/folkimg');
      if (mainPhotoRes.status === 'success') {
        setMainPhoto(mainPhotoRes.imagedesc);
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
          // console.log(photosResArr);
          setPhotos(photosResArr);
        }
      } else if (localStorage.getItem('rtoken')) {
        await updateToken();
        setDataIrl('mainPhotoRes');
      } else {
        history.push('/login');
      }

      if (mainPhotoRes.status === 'success') {
        setMainPhoto(mainPhotoRes.imagedesc);
      }
      setLoadingData(false);
    } catch (error) {
      setTitle('Ошибка');
      setTextError(error);
      setOpenModal(true);
    }
  };

  function takePhoto() {
    // console.log(`Начало фотографии`);
    let timeToScreenshot = secondRemaining;

    setTakeIn(true);
    let timer = setInterval(() => {
      if (timeToScreenshot === 1) {
        let photoBase64 = camera.current.getScreenshot();

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
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1080,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const result = await toBase64(compressedFile).catch((e) => Error(e));

      //Для дебагинга фото исходного
      // await toBase64(file)
      //   .catch((e) => Error(e))
      //   .then((result) => console.log(result));

      setBufferPhoto(result);
      setLoadedPhoto(true);
      // await uploadBase64(bufferPhoto, photoNumber);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={css.base_container}>
      <Back to='/profile' />

      {isLoadedPhoto && (
        <PictureCropper
          img={bufferPhoto}
          callBackFunc={() => setLoadedPhoto(false)}
          updateCropped={updateCroppedPhoto}
        ></PictureCropper>
      )}

      <img src={Lines} className={css.lines} alt={`CoolLines`} />
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
                    type='button'
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
                    type='button'
                    className={css.update}
                    onClick={() => {
                      setPhotoNumber(photoIndex);
                      inpFile.click();
                    }}
                  >
                    Загрузить фото
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setIsCamera(true);
                      setSeconds(3);
                      setCameraType(photoIndex);
                      // console.log(`Выбрана камера ` + photoIndex);
                    }}
                    className={css.update}
                  >
                    Сделать фото
                  </button>
                  {photo.faceid !== '' && (
                    <button
                      onClick={async (e) => {
                        try {
                          const data = await request.deletePhoto(
                            `${photo.faceid}`
                          );
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
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <a
          className={css.photoInstruction}
          href='/photo-instruction.pdf'
          target='_blank'
        >
          Как необходимо делать фото
        </a>
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
