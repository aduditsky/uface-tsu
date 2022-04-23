import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Modal from '../../components/Modal/Modal';
import css from './Enter.module.css';
import Back from '../../components/Back/Back';
import request from '../../request';
import Spinner from '../../components/Spinner/Spinner';
import Loader from 'react-loader-spinner';

const Enter = () => {
  let history = useHistory();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  // const [successLogin, setsuccessLogin] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState('Ошибка');
  const [textError, setTextError] = useState('');
  const [loadingData, setloadingData] = useState(true);
  const [isEnter, setIsEnter] = useState(false);

  const init = async () => {
    try {
      const obj = {};
      const objArray = window.location.href.split('?')[1];
      const tidItems = objArray.split('&');
      // eslint-disable-next-line
      tidItems.map((a) => {
        obj[a.split('=')[0]] = decodeURIComponent(a.split('=')[1]).replaceAll(
          '+',
          ' '
        );
      });

      localStorage.setItem('token', obj.tid);
      localStorage.setItem('rtoken', obj.rtid);

      localStorage.getItem('token') !== null &&
        localStorage.getItem('rtoken') !== null &&
        history.push('/profile');
      //TODO:
      //Переписать на этот роут, он проверяет token и rtoken const req = await request.getAuth('persident/folkdata');
    } catch {
      setloadingData(false);
      // console.log('Авторизация через UFACE');
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsEnter(true);

    try {
      const data = await request.post('persident/folklogin', [
        ['login', login[0] === '9' ? '7' + login : login],
        ['pass', password],
      ]);

      if (data.status !== 'error') {
        // setTitle('Успешно');
        localStorage.setItem('token', data.tid);
        localStorage.setItem('rtoken', data.rtid);
        history.push('/profile');
      } else {
        setIsEnter(false);
        setOpenModal(true);
        setTitle('Ошибка');
        setTextError(data.errordesc);
      }
    } catch (error) {
      setIsEnter(false);
      setOpenModal(true);
      setTitle('Ошибка');
      setTextError('Ошибка сервера');
    }
  };

  return (
    <div className={css.base_container}>
      <Back to='/' />
      <div className={css.header}>Войти</div>
      <form onSubmit={(e) => HandleSubmit(e)}>
        <div className={css.content}>
          <div className={css.label}>
            <label>Телефон / E-mail</label>
          </div>
          <div>
            <Input
              placeholder='9XXXXXXXXX / E-mail'
              enterInput
              type='text'
              value={login}
              setValue={(v) => {
                if (!/[а-я]/gi.test(v)) {
                  setLogin(v);
                }
              }}
              maxLength='40'
              valid={
                !(
                  login === '' ||
                  (login !== '' &&
                    !(
                      // phone
                      (
                        (login.length === 10 &&
                          login.replace(/[^0-9]/g, '').length === 10 &&
                          login[0] === '9') ||
                        // email
                        (login.indexOf('@') !== 0 &&
                          login.indexOf('@') !== -1 &&
                          login.indexOf('@') !== login.length - 1 &&
                          login.indexOf('.') !== 0 &&
                          login.indexOf('.') !== -1 &&
                          login.indexOf('.') !== login.length - 1)
                      )
                    ))
                )
              }
            />
          </div>
          <div className={css.label}>
            <label>Пароль</label>
          </div>
          <div>
            <Input
              enterPassword
              value={password}
              setValue={(value) => {
                if (value.length <= 20) {
                  setPassword(value);
                }
              }}
              EyeOpen
              valid={
                password !== '' && password.length >= 6 && password.length <= 20
              }
              name='password'
            />
          </div>
          <div className={css.passLink}>
            <Link to='/recover-password' className={css.passLink}>
              Забыли пароль?
            </Link>
          </div>
          {!isEnter ? (
            <button
              type='submit'
              className={
                login === '' ||
                (login !== '' &&
                  !(
                    // phone
                    (
                      (login.length === 10 &&
                        login.replace(/[^0-9]/g, '').length === 10 &&
                        login[0] === '9') ||
                      // email
                      (login.indexOf('@') !== 0 &&
                        login.indexOf('@') !== -1 &&
                        login.indexOf('@') !== login.length - 1 &&
                        login.indexOf('.') !== 0 &&
                        login.indexOf('.') !== -1 &&
                        login.indexOf('.') !== login.length - 1)
                    )
                  )) ||
                !(
                  password !== '' &&
                  password.length >= 6 &&
                  password.length <= 20
                )
                  ? css.Disabled
                  : css.Button
              }
              disabled={
                login === '' ||
                (login !== '' &&
                  !(
                    // phone
                    (
                      (login.length === 10 &&
                        login.replace(/[^0-9]/g, '').length === 10 &&
                        login[0] === '9') ||
                      // email
                      (login.indexOf('@') !== 0 &&
                        login.indexOf('@') !== -1 &&
                        login.indexOf('@') !== login.length - 1 &&
                        login.indexOf('.') !== 0 &&
                        login.indexOf('.') !== -1 &&
                        login.indexOf('.') !== login.length - 1)
                    )
                  )) ||
                !(
                  password !== '' &&
                  password.length >= 6 &&
                  password.length <= 20
                )
              }
            >
              Далее
            </button>
          ) : (
            <Loader type='Bars' color='#247ABF' height={50} width={50} />
          )}
        </div>
      </form>
      <div className={css.regBtn}>
        <label className={css.passLink2}>Нет учетной записи?</label>

        <Link to='/registration' className={css.registration}>
          Регистрация
        </Link>
      </div>
      <Modal
        open={openModal}
        close={() => setOpenModal(false)}
        title={title}
        text={textError}
        BtnClick={() => setOpenModal(false)}
        buttonTitle='Ок'
      />
      <Spinner show={loadingData} />
    </div>
  );
};

export default Enter;
