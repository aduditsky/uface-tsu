import React, { useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import css from './Cropper.module.css';

const PictureCropper = ({ img, callBackFunc, updateCropped }) => {
  const [cropper, setCropper] = useState();
  const [cropData, setCropData] = useState();

  const rotateCropData = (direction) => {
    if (typeof cropper !== 'undefined') {
      cropper.rotate(90 * direction);
    }
  };
  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas().toDataURL('image/jpeg'));
    }
  };
  const submitCropData = () => {
    if (typeof cropper !== 'undefined') {
      sessionStorage.setItem('recoverPhoto', cropData);
    }
    updateCropped(cropData);
    callBackFunc();
  };

  return (
    <div className={css.CropperContainer}>
      {!cropData ? (
        <Cropper
          zoomTo={0}
          initialAspectRatio={1}
          aspectRatio={1}
          preview='.img-preview'
          src={img}
          viewMode={1}
          minCropBoxHeight={100}
          minCropBoxWidth={100}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          className={css.imageCropper}
          guides={true}
        />
      ) : (
        <img
          className={css.croppedImage}
          alt={'cropped-data'}
          src={cropData}
        ></img>
      )}
      {!cropData ? (
        <div>
          <button className={css.buttonClass} onClick={getCropData}>
            Обрезать
          </button>
          <button
            className={css.buttonClass}
            onClick={() => {
              rotateCropData(-1);
            }}
          >
            Повернуть налево
          </button>
          <button
            className={css.buttonClass}
            onClick={() => {
              rotateCropData(1);
            }}
          >
            Повернуть направо
          </button>
        </div>
      ) : (
        <div>
          <button
            className={css.buttonClass}
            onClick={() => {
              setCropData(null);
              sessionStorage.removeItem('recoverPhoto');
            }}
          >
            Изменить
          </button>
          <button className={css.buttonClass} onClick={submitCropData}>
            Подтвердить
          </button>
        </div>
      )}
    </div>
  );
};

export default PictureCropper;
