import React, { useState, useEffect } from 'react';
import Input from '../../components/Input/Input';
import css from './Profile.module.css';
import Select from '../../components/Select/Select';
import { Link, Redirect } from 'react-router-dom';
import photo from '../../images/no_photo.jpg';
import closeBtn from '../../images/close.svg';
import Lines from '../../images/lines/profile.svg';
import CovidLogo from '../../images/covid-logo.png';

import request from '../../request';
import NewPhoneInput from '../../components/PhoneInput/PhoneInput';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import Isemail from 'isemail';
import Loader from 'react-loader-spinner';

// Импорты из конфига
import { InstCode } from '../../config';

const Profile = () => {
  //   let history = useHistory();
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
  // const [code, setCode] = useState('');
  const [institutes, setinstitutes] = useState([]);
  const [folkroles, setfolkroles] = useState([]);
  // eslint-disable-next-line
  const [sentCode, setsentCode] = useState(false);
  const [goLogin, setgoLogin] = useState(false);
  const [loading, setloading] = useState(false);
  const [loadingData, setloadingData] = useState(true);
  const [phoneTmp, setPhoneTmp] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [isSName, setIsSName] = useState(true);
  const [lastSName, setLastSName] = useState(patronymic);

  const [preEditData, setPreEditData] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    init();
    getSubData();
    // eslint-disable-next-line
  }, []);

  const init = async () => {
    setloadingData(true);
    const req = await request.getAuth('persident/folkdata');
    // console.log({ req });
    if (req.status === 'success') {
      console.log({ req });
      setLastName(req.lname);
      setFirstName(req.fname);
      setPatronymic(req.sname);
      setLastSName(req.sname);
      if (req.sname === '') {
        setIsSName(false);
      }
      if (req.phone_approve === '1') {
        setOkNumber(true);
      }
      setPhone('+' + req.phone);
      sessionStorage.setItem('phoneConfirm', req.phone);
      setPhoneTmp('+' + req.phone);
      setEmail(req.email);
      setRole(req.folkrole);
      setDateborn(req.dateborn);
      //Тут нужно будет добавить проверку, а похорошему кинуть ее в функцию запроса
      setInstitute(req.institute);
      const imgResponse = await request.getAuth('persident/folkimg');
      if (imgResponse) {
        setimage(imgResponse.imagedesc);
        sessionStorage.setItem('mainPhoto', imgResponse.imagedesc);
      }
    } else if (localStorage.getItem('rtoken')) {
      await updateToken();
      const req = await request.getAuth('persident/folkdata');

      setLastName(req.lname);
      setFirstName(req.fname);
      setPatronymic(req.sname);
      setLastSName(req.sname);
      if (req.sname === '') {
        setIsSName(false);
      }
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

      if (req.status === 'error') {
        setgoLogin(true);
      }
    }

    // if (req.status === 'error') {
    //   history.push('/login');
    // }

    setloading(false);
    setloadingData(false);
  };

  const updateToken = async () => {
    const data = await request.postToken('persident/folkreftok');
    // console.log(data.rtid, data.tid);
    localStorage.setItem('token', data.tid);
    localStorage.setItem('rtoken', data.rtid);
  };

  useEffect(() => {
    // console.log({ preEditData });
    if (!editMode) {
      setLastName(preEditData.lname);
      setFirstName(preEditData.fname);
      setPatronymic(preEditData.sname);
      setLastSName(preEditData.sname);
      setDateborn(preEditData.dateborn);
      if (preEditData.sname === '') {
        setIsSName(false);
      }
      setOkNumber(preEditData.okNumber);
      setPhone(preEditData.phone);
      setPhoneTmp(preEditData.phone);
      setEmail(preEditData.email);
    } else {
      setPreEditData({
        lname: lastName,
        fname: firstName,
        sname: patronymic,
        phone: phone,
        email: email,
        dateborn: dateborn,
        okNumber: okNumber,
      });
    }
    if (!isSName && lastSName.length > 0) {
      setIsSName(true);
    }
    // eslint-disable-next-line
  }, [editMode]);

  const getSubData = async () => {
    const dataInst = await request.getInst(InstCode);
    const dataFolk = await request.get('persident/getfolkroles');
    setinstitutes(dataInst);
    setfolkroles(dataFolk);
  };

  const ChangePasswordHandler = async () => {
    setIsChangingPassword(true);
    try {
      const data = await request.postAuth('persident/pwdchange', [
        ['oldpwd', password],
        ['newpwd', newPassword],
        ['confirmpwd', newPasswordR],
      ]);
      if (data.status !== 'error') {
        setOpenModal(true);
        setTitle('Успешно');
        setTextError(data.desc);
        setChangePwd(false);
        seteditMode(false);
        setIsChangingPassword(false);
      } else {
        setTitle('Ошибка');

        setOpenModal(true);
        setTextError(data.errordesc ? data.errordesc : data.desc);
        setChangePwd(false);
        setIsChangingPassword(false);
      }
    } catch (error) {
      console.error('error: ', error);
      setOpenModal(true);
      setTextError(error.errordesc);
      setIsChangingPassword(false);
    }
  };

  const ConfirmChangeData = async () => {
    setIsEditing(true);
    phone !== preEditData.phone && setOkNumber(false);
    setPreEditData({
      lname: lastName,
      fname: firstName,
      sname: patronymic,
      phone: phone,
      email: email,
      dateborn: dateborn,
      okNumber: okNumber,
    });
    try {
      const data = await request.postAuth('persident/folkdata', [
        ['fio', lastName + ' ' + firstName + ' ' + patronymic],
        ['lname', lastName],
        ['fname', firstName],
        ['sname', patronymic],
        ['phone', phone],
        ['email', email],
        ['dateborn', dateborn],
        ['folkrole', role],
        ['institute', institute],
      ]);
      if (data.status !== 'error') {
        // console.log(data);
        setOpenModal(true);
        setTextError(data.desc);
        setTitle('Успешно');
        seteditMode(false);
        setIsEditing(false);
        if (phone !== phoneTmp) {
          setOkNumber(false);
        }
      } else {
        setTitle('Ошибка');
        setOpenModal(true);
        setIsEditing(false);
        setTextError(data.error);
        console.log(data);
      }
    } catch (error) {
      console.error('error: ', error);
      setOpenModal(true);
      setIsEditing(false);
      setTextError(error);
    }
  };

  if (goLogin) {
    return <Redirect to='/' />;
  }

  if (loading) {
    return <div />;
  }

  return (
    !loading && (
      <div className={css.base_container}>
        {!loadingData ? (
          <>
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
                      await request.getAuth('persident/folkexit');
                      // console.log(data);
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
            <img src={Lines} className={css.lines} alt={`AnotherCoolLines`} />
            <div className={css.my_profile}>
              <div className={css.header}>Мои данные</div>
              <Link to='/my-photos'>
                <img className={css.photo} src={image} alt='userPhoto' />
              </Link>
            </div>

            {/* Covid-19 блок */}
            <div style={{ display: 'flex', width: '100%', gap: 4 }}>
              <div style={{ display: 'flex', minWidth: 50 }}>
                <img
                  src={CovidLogo}
                  alt={`Изображение Covid-19`}
                  width={50}
                  height={50}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  textAlign: 'left',
                  alignItems: 'left',
                  alignContent: 'left',
                  flexDirection: 'column',
                  width: '100%',
                  paddingTop: 5,
                  marginBottom: 4,
                }}
              >
                <Link to='/covid'>
                  <span
                    style={{
                      fontFamily: 'Montserrat',
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: '14px',
                      lineHeight: '17px',
                      color: '#247ABF',
                    }}
                  >
                    COVID-19 <br /> Сведения о вакцинации (QR-код)
                  </span>
                </Link>
                {/*  */}
                <div
                  style={{
                    fontFamily: 'Montserrat',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: '14px',
                    lineHeight: '17px',
                    color: '#2C2C2C',
                  }}
                >
                  Сертификат подтвержден <br />
                  Действует до {`01.10.2022`}
                </div>
              </div>
            </div>

            <div className={css.options}>
              <div>
                <button
                  onClick={() => {
                    seteditMode((prev) => !prev, setSave(false));
                    isEditing === true
                      ? setIsEditing(false)
                      : setIsEditing(false);
                  }}
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
                  valid={lastName !== '' && validateName(lastName)}
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
                  valid={firstName !== '' && validateName(firstName)}
                />
              </div>
              <div className={css.formInput}>
                {isSName && (
                  <Input
                    label='Отчество'
                    value={patronymic}
                    setValue={(v) => {
                      if (!/[a-z0-9]/gi.test(v)) {
                        setPatronymic(v.charAt(0).toUpperCase() + v.slice(1));
                        setLastSName(v.charAt(0).toUpperCase() + v.slice(1));
                      }
                    }}
                    disabled={!editMode}
                    type='text'
                    valid={patronymic && patronymic.length > 0}
                  />
                )}

                {editMode && lastSName.length < 1 && (
                  <div className={css.snameLabel}>
                    <input
                      type='checkbox'
                      checked={!isSName}
                      disabled={!editMode}
                      style={{ paddingRight: '15px', paddingBottom: '20px' }}
                      onChange={() => {
                        setIsSName(!isSName);
                        if (isSName) {
                          setPatronymic('');
                        } else {
                          setPatronymic(lastSName);
                        }
                      }}
                    />
                    Нет отчества?
                  </div>
                )}
              </div>
              <div className={css.formInput}>
                <Input
                  valid={
                    dateborn &&
                    dateborn.toString().indexOf('_') === -1 &&
                    dateborn.length > 0
                  }
                  disabled={!editMode}
                  value={dateborn}
                  dateType
                  type='text'
                  setValue={(e) => {
                    setDateborn(e);
                  }}
                  label='Дата рождения*'
                />
              </div>
              <div className={css.formInput}>
                <Input
                  valid={
                    email !== undefined &&
                    Isemail.validate(email, { minDomainAtoms: 2 })
                  }
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
                />
              </div>
              <div className={css.formInput}>
                <NewPhoneInput
                  value={phone}
                  label='Номер сотового телефона*'
                  setValue={setPhone}
                  disabled={!editMode}
                  valid={okNumber}
                />
              </div>

              {!okNumber && (
                <Link className={css.PhoneConfirm} to='/phone-confirm'>
                  Подтвердить номер
                </Link>
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
                {/* {console.log({ folkroles })} */}
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
                  {!isEditing ? (
                    <button
                      className={
                        lastName !== '' &&
                        lastName.length >= 1 &&
                        validateName(lastName) &&
                        firstName !== '' &&
                        firstName.length >= 1 &&
                        validateName(firstName) &&
                        Isemail.validate(email, { minDomainAtoms: 2 }) &&
                        dateborn.indexOf('_') === -1
                          ? css.update_pass
                          : css.disabled_pass
                      }
                      onClick={ConfirmChangeData}
                      disabled={
                        !(
                          lastName !== '' &&
                          lastName.length >= 1 &&
                          validateName(lastName) &&
                          firstName !== '' &&
                          firstName.length >= 1 &&
                          validateName(firstName) &&
                          Isemail.validate(email, { minDomainAtoms: 2 }) &&
                          dateborn.indexOf('_') === -1 &&
                          !isEditing
                        )
                      }
                    >
                      Сохранить
                    </button>
                  ) : (
                    <Loader
                      type='Bars'
                      color='#247ABF'
                      height={30}
                      width={30}
                    />
                  )}
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
                        password.match(
                          /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/
                        )
                      }
                      value={password}
                      setValue={(value) => {
                        if (value.length <= 28) {
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
                        newPassword.match(
                          /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/
                        )
                      }
                      value={newPassword}
                      setValue={(value) => {
                        if (value.length <= 200) {
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
                        newPasswordR === newPassword &&
                        newPasswordR.length >= 6 &&
                        newPasswordR.match(
                          /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/
                        )
                      }
                      value={newPasswordR}
                      setValue={(value) => {
                        if (value.length <= 200) {
                          setNewPasswordR(value);
                        }
                      }}
                      password
                      label='Повторите новый пароль*'
                      type='text'
                      name='password'
                    />
                  </div>
                  {newPassword.length > 0 &&
                    !newPassword.match(
                      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/
                    ) && (
                      <ul className={css.passwordRequirements}>
                        <li>Пароль должен быть 6 символов или более.</li>
                        <li>
                          Только латиница, тире, точки. Пробелы не допустимы.
                        </li>
                        <li>Также 1 заглавную и 1 прописную</li>
                      </ul>
                    )}
                  <div>
                    {!isChangingPassword ? (
                      <button
                        className={css.update_pass}
                        disabled={
                          !(
                            password !== '' &&
                            password.length >= 6 &&
                            password.length <= 28 &&
                            newPassword !== '' &&
                            newPassword.length >= 6 &&
                            newPassword.length <= 28 &&
                            newPasswordR !== '' &&
                            newPasswordR.length >= 6 &&
                            newPasswordR.length <= 28 &&
                            newPassword === newPasswordR
                          )
                        }
                        onClick={ChangePasswordHandler}
                      >
                        Сохранить
                      </button>
                    ) : (
                      <Loader
                        type='Bars'
                        color='#247ABF'
                        height={30}
                        width={30}
                      />
                    )}
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
          </>
        ) : (
          <Spinner show={loadingData} />
        )}
      </div>
    )
  );
};

function validateName(value) {
  const reg = /^[А-ЯЁа-яё -]+$/;
  return reg.test(value);
}

export default Profile;
