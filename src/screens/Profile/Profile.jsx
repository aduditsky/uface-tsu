import React, { useState, useEffect } from 'react';
import Input from '../../components/Input/Input';
import css from './Profile.module.css';
import Select from '../../components/Select/Select';
import { Link, Redirect } from 'react-router-dom';
import photo from '../../images/no_photo.jpg';
import closeBtn from '../../images/close.svg';

import request from '../../request';
import PhoneInput from '../../components/PhoneInput/PhoneInput';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';

const Profile = () => {
  // eslint-disable-next-line
  const [save, setSave] = useState(false);
  const [title, setTitle] = useState('Ошибка');
  const [openModal, setOpenModal] = useState(false);
  const [textError, setTextError] = useState('');
  const [okNumber, setOkNumber] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordR, setNewPasswordR] = useState('');
  const [changePwd, setChangePwd] = useState(false);
  const [editMode, seteditMode] = useState(false);
  const [image, setimage] = useState(localStorage.getItem('newPhoto') || photo);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [institute, setInstitute] = useState('');
  const [role, setRole] = useState('');
  const [dateborn, setDateborn] = useState(new Date());
  const [code, setCode] = useState('');
  const [institutes, setinstitutes] = useState([]);
  const [folkroles, setfolkroles] = useState([]);
  const [sentCode, setsentCode] = useState(false);
  const [goLogin, setgoLogin] = useState(false);
  const [loading, setloading] = useState(false);
  const [loadingData, setloadingData] = useState(true);
  const [phoneTmp, setPhoneTmp] = useState('');

  const init = async () => {
    setloadingData(true);
    const req = await request.getAuth('persident/folkdata');
    console.log(req);
    if (req.fio) {
      const ln = req.fio.split(' ')[0];
      const fn = req.fio.split(' ')[1];
      const p = req.fio.split(' ')[2];
      setLastName(ln);
      setFirstName(fn);
      setPatronymic(p);
      if (req.phone_approve === '1') {
        setOkNumber(true);
      }
      setPhone('+' + req.phone);
      setPhoneTmp('+' + req.phone);
      setEmail(req.email);
      setRole(req.folkrole);
      setDateborn(req.dateborn);
      setInstitute(req.institute);
      const imgResponse = await request.getAuth('persident/folkimg');
      if (imgResponse) {
        setimage(imgResponse.imagedesc);
        sessionStorage.setItem('mainPhoto', imgResponse.imagedesc);
      }
    } else {
      if (localStorage.getItem('rtoken')) {
        await updateToken();
        const req = await request.getAuth('persident/folkdata');
        const ln = req.fio.split(' ')[0];
        const fn = req.fio.split(' ')[1];
        const p = req.fio.split(' ')[2];

        setLastName(ln);
        setFirstName(fn);
        setPatronymic(p);
        if (req.phone_approve === '1') {
          setOkNumber(true);
        }
        setPhone('+' + req.phone);
        setPhoneTmp('+' + req.phone);
        setEmail(req.email);
        setRole(req.folkrole);
        setDateborn(req.dateborn);
        setInstitute(req.institute);
        const imgResponse = await request.getAuth('persident/folkimg');
        if (imgResponse) {
          setimage(imgResponse.imagedesc);
          sessionStorage.setItem('mainPhoto', imgResponse.imagedesc);
        }
      } else {
        setgoLogin(true);
      }
    }
    setloading(false);
    setloadingData(false);
  };
  useEffect(() => {
    init();
    getSubData();
    // eslint-disable-next-line
  }, []);

  const getSubData = async () => {
    const dataInst = await request.get('persident/getinstitutes');
    const dataFolk = await request.get('persident/getfolkroles');
    setinstitutes(dataInst);
    setfolkroles(dataFolk);
  };
  const updateToken = async () => {
    const data = await request.postToken('persident/folkreftok');
    console.log(data.rtid, data.tid);
    localStorage.setItem('token', data.tid);
    localStorage.setItem('rtoken', data.rtid);
  };
  if (goLogin) {
    return <Redirect to='/' />;
  } else if (loading) {
    return <div />;
  } else {
    return (
      <div className={css.base_container}>
        {!loadingData ? (
          <div>
            <div className={css.links}>
              {/* <div className={css.uface}>
                <Link className={css.uface} to='/profile'>
                  Кабинет Uface
                </Link>
              </div> */}
              <div className={css.cabinetText}>Кабинет Uface</div>
              <div className={css.closeBtn}>
                <button
                  className={css.closeImg}
                  onClick={async () => {
                    try {
                      const data = await request.getAuth('persident/folkexit');
                      console.log(data);
                    } catch (error) {
                      console.error('error: ', error);
                    }
                    setgoLogin(true);
                  }}
                >
                  <img className={css.closeBtn} src={closeBtn} alt='close' />
                </button>
              </div>
            </div>
            <div className={css.my_profile}>
              <div className={css.header}>Мои данные</div>
              <Link to='/myPhoto4ki'>
                <img className={css.photo} src={image} alt='userPhoto' />
              </Link>
            </div>

            <div className={css.options}>
              <div>
                <button
                  onClick={() => seteditMode((prev) => !prev, setSave(false))}
                  className={css.update}
                >
                  Редактировать данные
                </button>
              </div>
            </div>

            {/* Начало формы "Редактировать данные" */}
            <div className={css.inputs}>
              <div className={css.formInput}>
                <Input
                  label='Фамилия*'
                  disabled={!editMode}
                  type='text'
                  value={lastName}
                  setValue={(v) => {
                    if (!/[a-z0-9]/gi.test(v)) {
                      setLastName(v.charAt(0).toUpperCase() + v.slice(1));
                    }
                  }}
                  valid={
                    lastName !== '' &&
                    lastName.length <= 20 &&
                    validateName(lastName)
                  }
                />
              </div>
              <div className={css.formInput}>
                <Input
                  label='Имя*'
                  value={firstName}
                  setValue={(v) => {
                    if (!/[a-z0-9]/gi.test(v)) {
                      setFirstName(v.charAt(0).toUpperCase() + v.slice(1));
                    }
                  }}
                  disabled={!editMode}
                  type='text'
                  valid={
                    firstName !== '' &&
                    firstName.length <= 20 &&
                    validateName(firstName)
                  }
                />
              </div>
              <div className={css.formInput}>
                <Input
                  label='Отчество*'
                  value={patronymic}
                  setValue={(v) => {
                    if (!/[a-z0-9]/gi.test(v)) {
                      setPatronymic(v.charAt(0).toUpperCase() + v.slice(1));
                    }
                  }}
                  disabled={!editMode}
                  type='text'
                  valid={
                    patronymic !== '' &&
                    patronymic.length <= 20 &&
                    validateName(patronymic)
                  }
                />
              </div>
              <div className={css.formInput}>
                <Input
                  valid={
                    dateborn.toString().indexOf('_') === -1 &&
                    dateborn.length > 0
                  }
                  disabled={!editMode}
                  value={dateborn}
                  type='date'
                  setValue={(e) => {
                    setDateborn(e);
                  }}
                  label='Дата рождения*'
                />
              </div>
              <div className={css.formInput}>
                <Input
                  valid={validateEmail(email)}
                  value={email}
                  setValue={(v) => {
                    if (!/[а-я]/gi.test(v)) {
                      setEmail(v);
                    }
                  }}
                  label='E-mail*'
                  disabled={!editMode}
                  type='email'
                  name='email'
                  maxLength='30'
                />
              </div>
              <div className={css.formInput}>
                <PhoneInput
                  value={phone}
                  label='Номер сотового телефона*'
                  setValue={setPhone}
                  disabled={!editMode}
                  valid={okNumber}
                />
              </div>

              {okNumber ? (
                <div></div>
              ) : !sentCode ? (
                <div className={css.buttons}>
                  <button
                    // disabled={changePwd || editMode}
                    className={css.update_pass}
                    onClick={async () => {
                      try {
                        const data = await request.getAuth(
                          'persident/phoneapprove?sendkod=true'
                        );
                        if (data.status !== 'error') {
                          console.log(data);
                          setsentCode(true);
                        } else {
                          setTitle('Ошибка');
                          setOpenModal(true);
                          setTextError(data.errordesc);
                        }
                      } catch (error) {
                        console.error('error: ', error);
                        setOpenModal(true);
                        setTextError(error);
                      }
                    }}
                    // {() => setsentCode(true)}
                  >
                    Подтвердить номер
                  </button>
                </div>
              ) : (
                <div className={css.formInput}>
                  <div className={css.formInput}>
                    <span className={css.code_span}>
                      На номер телефона был отправлен код. Введите его в поле:
                    </span>
                  </div>
                  <Input
                    value={code}
                    setValue={(value) => {
                      if (value.length <= 4) {
                        setCode(value);
                      }
                    }}
                    label='Введите код подтверждения'
                    type='number'
                    name='code'
                    valid={code.length === 4}
                    max='4'
                  />

                  <div className={css.buttons}>
                    <button
                      // disabled={code == "" && code.length !== 4}
                      className={css.update_pass}
                      onClick={async () => {
                        try {
                          const data = await request.postAuth(
                            'persident/phoneapprove',
                            [['kod', code]]
                          );
                          if (data.status !== 'error') {
                            setOpenModal(true);
                            setTitle('Успешно');
                            setTextError(data.desc);
                            setsentCode(false);
                            setOkNumber(true);
                          } else {
                            setOpenModal(true);
                            setTitle('Ошибка');
                            setTextError(data.errordesc);
                            setsentCode(false);
                          }
                        } catch (error) {
                          console.error('error: ', error);
                          setOpenModal(true);
                          setTextError(error);
                        }
                      }}
                    >
                      Отправить
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className={css.selects}>
              <div className={css.formSelect}>
                <Select
                  value={role}
                  disabled={true}
                  setValue={setRole}
                  label='Статус*'
                  options={folkroles}
                  name='role'
                />
              </div>
              <div className={css.formSelect}>
                <Select
                  value={institute}
                  disabled={true}
                  setValue={setInstitute}
                  label='ВУЗ*'
                  options={institutes}
                  name='institute'
                />
              </div>
              {editMode && (
                <div>
                  <button
                    className={css.update_pass}
                    onClick={async () => {
                      try {
                        const data = await request.postAuth(
                          'persident/folkdata',
                          [
                            [
                              'fio',
                              lastName + ' ' + firstName + ' ' + patronymic,
                            ],
                            ['phone', phone],
                            ['email', email],
                            ['dateborn', dateborn],
                            ['folkrole', role],
                            ['institute', institute],
                          ]
                        );
                        if (data.status !== 'error') {
                          console.log(data);
                          setOpenModal(true);
                          setTextError(data.desc);
                          setTitle('Успешно');
                          seteditMode(false);
                          if (phone !== phoneTmp) {
                            setOkNumber(false);
                          }
                        } else {
                          setTitle('Ошибка');
                          setOpenModal(true);
                          setTextError(data.errordesc);
                          console.log(data);
                        }
                      } catch (error) {
                        console.error('error: ', error);
                        setOpenModal(true);
                        setTextError(error);
                      }
                    }}
                    disabled={
                      !(
                        lastName !== '' &&
                        lastName.length <= 20 &&
                        validateName(lastName) &&
                        firstName !== '' &&
                        firstName.length <= 20 &&
                        validateName(firstName) &&
                        patronymic !== '' &&
                        patronymic.length <= 20 &&
                        validateName(patronymic) &&
                        validateEmail(email) &&
                        dateborn.indexOf('_') === -1
                      )
                    }
                  >
                    Сохранить
                  </button>
                </div>
              )}
              <div>
                <button
                  // disabled={editMode || sentCode}
                  onClick={() => setChangePwd((prev) => !prev)}
                  className={css.update_pass}
                >
                  Изменить пароль
                </button>
              </div>
              {changePwd && (
                <div>
                  <div className={css.formInput}>
                    <Input
                      EyeOpen
                      valid={
                        password !== '' &&
                        password.length >= 6 &&
                        password.length <= 20
                      }
                      value={password}
                      setValue={(value) => {
                        if (value.length <= 20) {
                          setPassword(value);
                        }
                      }}
                      password
                      label='Введите старый пароль*'
                      type='text'
                      name='password'
                    />
                  </div>
                  <div className={css.formInput}>
                    <Input
                      EyeOpen
                      valid={
                        newPassword !== '' &&
                        newPassword.length >= 6 &&
                        newPassword.length <= 20
                      }
                      value={newPassword}
                      setValue={(value) => {
                        if (value.length <= 20) {
                          setNewPassword(value);
                        }
                      }}
                      password
                      label='Новый пароль*'
                      type='text'
                      name='password'
                    />
                  </div>
                  <div className={css.formInput}>
                    <Input
                      EyeOpen
                      valid={
                        newPasswordR !== '' &&
                        newPasswordR.length >= 6 &&
                        newPasswordR.length <= 20 &&
                        newPassword === newPasswordR
                      }
                      value={newPasswordR}
                      setValue={(value) => {
                        if (value.length <= 20) {
                          setNewPasswordR(value);
                        }
                      }}
                      password
                      label='Повторите новый пароль*'
                      type='text'
                      name='password'
                    />
                  </div>
                  <div>
                    <button
                      className={css.update_pass}
                      disabled={
                        !(
                          password !== '' &&
                          password.length >= 6 &&
                          password.length <= 20 &&
                          newPassword !== '' &&
                          newPassword.length >= 6 &&
                          newPassword.length <= 20 &&
                          newPasswordR !== '' &&
                          newPasswordR.length >= 6 &&
                          newPasswordR.length <= 20 &&
                          newPassword === newPasswordR
                        )
                      }
                      onClick={async () => {
                        try {
                          const data = await request.postAuth(
                            'persident/pwdchange',
                            [
                              ['oldpwd', password],
                              ['newpwd', newPassword],
                              ['confirmpwd', newPasswordR],
                            ]
                          );
                          if (data.status !== 'error') {
                            setOpenModal(true);
                            setTitle('Успешно');
                            setTextError(data.desc);
                            console.log(data);
                            setChangePwd(false);
                            seteditMode(false);
                          } else {
                            setOpenModal(true);
                            setTextError(data.desc);
                            setChangePwd(false);
                            console.log(data);
                          }
                        } catch (error) {
                          console.error('error: ', error);
                          setOpenModal(true);
                          setTextError(error);
                        }
                      }}
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Modal
              open={openModal}
              close={() => setOpenModal(false)}
              title={title}
              text={textError}
              BtnClick={() => setOpenModal(false)}
              buttonTitle='Ок'
            />
          </div>
        ) : (
          <Spinner show={loadingData} />
        )}
      </div>
    );
  }
};

function validateName(value) {
  const reg = /^[А-Яа-я]+$/;
  return reg.test(value);
}

function validateEmail(email) {
  const re =
    // eslint-disable-next-line
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export default Profile;
