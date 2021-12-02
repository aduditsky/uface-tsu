import React, { useState, useEffect } from 'react';
import './ConfirmPhone.module.css';
import ReactCodeInput from 'react-code-input';
import request from '../../request';
import Spinner from '../../components/Spinner/Spinner';
import parsePhoneNumber from 'libphonenumber-js';
import Modal from '../../components/Modal/Modal';
import css from './ConfirmPhone.module.css';
import Back from '../../components/Back/Back';
import PhoneInput from '../../components/PhoneInput/PhoneInput';
import { useHistory } from 'react-router-dom';

export default function ConfirmPhoneNumberScreen() {
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [resetPin, setResetPin] = useState(false);
  const [phoneEdit, setPhoneEdit] = useState('');
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [openModal, setOpenModal] = useState();
  const [textError, setTextError] = useState();
  const [title, setTitle] = useState();
  const [phone, setPhone] = useState(
    sessionStorage.getItem('phoneConfirm') || ''
  );
  const [pin, setPin] = useState('');
  const [counter, setCounter] = useState(30);
  const [isChanging, setIsChanging] = useState(false);

  async function init() {
    const req = await request.getAuth('persident/folkdata');
    if (req.status === 'error') {
      history.push('/login');
    }
    if (req.status === 'success') {
      setPhone(req?.phone);
      sessionStorage.setItem('phoneConfirm', req?.phone);
      setLoadingPhone(false);
      setLoading(false);
      setCounter(30);
      if (req.phone_approve === '0') {
        await request.getAuth('persident/phoneapprove?sendkod=true');
      } else if (req.phone_approve === '1') {
        history.push('/profile');
      }
    }
  }
  const changePhone = async (phone) => {
    setLoading(true);
    setLoadingPhone(true);
    // console.log(`Новый телефон: ${phone.replace(/\D/g, '')}`);
    const data = await request.postAuth('persident/folkedit', [
      // eslint-disable-next-line
      ['folk', `{\phone\:${phone.replace(/\D/g, '')}}`],
    ]);
    if (data.status === 'success') {
      setCounter(30);
      setLoading(false);
      setLoadingPhone(false);
      // console.log(data);
      setPhone(phoneEdit);
      setIsEditEnabled(false);
      setIsChanging(false);
      await request.getAuth('persident/phoneapprove?sendkod=true');
    } else {
      // console.log(data);
      setTextError(data.errordesc);
      setOpenModal(true);
      setIsChanging(false);
      // history.push('/');
    }
  };
  const phoneConfirmStart = async () => {
    try {
      const data = await request.postAuth('persident/phoneapprove', [
        ['kod', pin],
      ]);
      // console.log({ data });
      if (data.status !== 'error') {
        // console.log(data);
      } else {
        history.push('/profile');
      }
      if (data.status === 'succes') {
        setTitle('Успешно');
        setTextError(data.desc);
        setOpenModal(true);
        history.push('/profile');
      }
    } catch (error) {
      console.error('error: ', error);
      setPin('');
      setOpenModal(true);
      setTextError(error);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (pin.length === 4) {
      //запрос на подтверждение
      // console.log('Начало подтверждения');
      phoneConfirmStart();
    }
    // eslint-disable-next-line
  }, [pin]);

  useEffect(() => {
    const timer =
      counter > 0
        ? setInterval(() => setCounter(counter - 1), 1000)
        : setResetPin(true);
    return () => clearInterval(timer);
  }, [counter]);

  if (loading) {
    return <Spinner show={loading} />;
  }

  const CodeProps = {
    inputStyle: {
      background: ' #F2F2F2',
      borderRadius: '26px 26px 5px 26px',
      border: 'none',
      width: '61px',
      height: '60px',
      color: '#2c2c2c',
      margin: '0 9px',
      fontSize: '34px',
      lineHeight: '38px',
      textAlign: 'center',
    },
  };

  return (
    <div className='inputbox'>
      <Back to='/profile' />
      <h1 className={css.Header}>Введите код</h1>
      <ReactCodeInput
        type='number'
        onChange={(e) => {
          setPin(e.replace('/[0-9]/', ''));
        }}
        fields={4}
        disabled={pin.length === 4}
        placeholder='_'
        {...CodeProps}
      />
      <div className={css.ResendContainer}>
        <span className={css.ResendText}>
          Отправить код повторно {!resetPin && `(${counter})`}
        </span>
        {resetPin ? (
          <button
            onClick={async () => {
              await request.getAuth('persident/phoneapprove?sendkod=true');
              setCounter(30);
              setResetPin(false);
            }}
            className={css.ResendButton}
          >
            Не приходит код?
          </button>
        ) : (
          <p className={css.ResendEmptyP}>Не приходит код?</p>
        )}
      </div>
      <p>Код подтверждения отправлен вам на номер:</p>
      {!loadingPhone && phone ? (
        <p className={css.Phone}>
          {parsePhoneNumber(phone, 'RU')?.formatInternational()}
        </p>
      ) : (
        <p>Загрузка...</p>
      )}
      <div className={css.RefreshPhoneContainer}>
        <p className={css.RefreshLabel}>Неверный номер?</p>
        <button
          type='button'
          className={css.ChangePhone}
          onClick={() => setIsEditEnabled(true)}
        >
          Изменить
        </button>
      </div>
      {isEditEnabled && (
        <div>
          <PhoneInput
            placeholder='+7 000 000 0000'
            value={phoneEdit}
            label='Введите номер'
            setValue={setPhoneEdit}
          />
          <button
            className={
              phoneEdit.replace(/\D/g, '').length === 11
                ? css.refreshButton
                : css.disabledButton
            }
            disabled={phoneEdit.replace(/\D/g, '').length !== 11 && true}
            onClick={() => {
              setIsChanging(true);
              changePhone(phoneEdit.replace(/\D/g, ''));
            }}
          >
            {isChanging ? 'Подождите' : 'Поменять телефон'}
          </button>
        </div>
      )}
      <Modal
        open={openModal}
        close={() => setOpenModal(false)}
        title={title}
        text={textError}
        BtnClick={() => setOpenModal(false)}
        buttonTitle='Ок'
      />
    </div>
  );
}
