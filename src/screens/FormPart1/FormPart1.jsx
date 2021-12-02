/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Input from '../../components/Input/Input';
import css from './FormPart1.module.css';
import Back from '../../components/Back/Back';
import Select from '../../components/Select/Select';
import NewPhoneInput from '../../components/PhoneInput/PhoneInput';
import request from '../../request';
import { useHistory } from 'react-router-dom';
import { validatePhoneNumberLength } from 'libphonenumber-js';
import Isemail from 'isemail';

// Импорты из конфига
import { universityUrl, InstCode, universityPd } from '../../config';

const FormPart1 = () => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [institute, setInstitute] = useState('1');
  const [role, setRole] = useState('1');
  const [dateborn, setDateborn] = useState('');
  const [checkboxClick, setCheckboxClick] = useState(false);
  const [institutes, setinstitutes] = useState([]);
  const [folkroles, setfolkroles] = useState([]);
  const [isSName, setIsSName] = useState(true);
  const [lastSName, setLastSName] = useState(patronymic);
  let history = useHistory();

  useEffect(() => {
    regTsuAcc();
    init();
  }, []);

  const regTsuAcc = async () => {
    try {
      const obj = {};
      window.location.href
        .split('?')[1]
        .split('&')
        .map((a) => {
          obj[a.split('=')[0]] = decodeURIComponent(a.split('=')[1]).replaceAll(
            '+',
            ' '
          );
        });

      setEmail(obj.email);
      setLastSName(obj.sname);

      sessionStorage.setItem(
        'recoverData',
        JSON.stringify({
          lastName: obj.lname.trim(),
          firstName: obj.fname.trim(),
          patronymic: obj.sname.trim(),
          phone: '+7' + obj.phone.trim(),
          email: obj.email.trim(),
          dateborn: obj.bdate.trim(),
        })
      );
    } catch {}
  };

  const init = async () => {
    sessionStorage.removeItem('emailSuccess');
    // const dataInst = await request.get('persident/getinstitutes');
    const dataInst = await request.getInst(InstCode);
    const dataFolk = await request.get('persident/getfolkroles');

    if (InstCode === 1) {
      const filtreddataInst = dataInst.filter((item) => item.kod === '1');
      setinstitutes(filtreddataInst);
    }

    if (InstCode !== 1) setinstitutes(dataInst);

    setfolkroles(dataFolk);
    const recoverData = sessionStorage.getItem('recoverData');
    if (recoverData) {
      const tmp = JSON.parse(recoverData);
      setLastName(tmp.lastName);
      setFirstName(tmp.firstName);
      setPatronymic(tmp.patronymic);
      setDateborn(tmp.dateborn);
      setPhone(tmp.phone);
      setEmail(tmp.email);
      tmp.password && setPassword(tmp.password);
      tmp.password2 && setPassword2(tmp.password2);
      tmp.role && setRole(tmp.role);
      // tmp.institute && setInstitute(tmp.institute);
      tmp.checkboxClick && setCheckboxClick(tmp.checkboxClick);
    }
  };

  const submit = () => {
    const recoverDataObj = {
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      patronymic: patronymic.trim(),
      phone,
      email,
      password,
      password2,
      role,
      institute: institutes[institute - 1].kod,
      dateborn,
      checkboxClick,
    };
    sessionStorage.setItem('recoverData', JSON.stringify(recoverDataObj));
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    submit();
    history.push('/confirm-registration');
  };

  return (
    <>
      <Back to='/' />
      <div className={css.header}>
        Заполните <br />
        анкету
      </div>
      <form onSubmit={(e) => HandleSubmit(e)}>
        <div className={css.inputs}>
          <div className={css.formInput}>
            <Input
              placeholder='Иванов'
              label='Фамилия*'
              type='text'
              name='lastName'
              value={lastName}
              valid={lastName !== '' && validateName(lastName)}
              setValue={(v) => {
                if (!/[a-z0-9]/gi.test(v)) {
                  setLastName(v.charAt(0).toUpperCase() + v.slice(1));
                }
              }}
            />
          </div>
          <div className={css.formInput}>
            <Input
              placeholder='Иван'
              value={firstName}
              setValue={(v) => {
                if (!/[a-z0-9]/gi.test(v)) {
                  setFirstName(v.charAt(0).toUpperCase() + v.slice(1));
                }
              }}
              label='Имя*'
              type='text'
              name='firstName'
              valid={firstName !== '' && validateName(firstName)}
            />
          </div>
          <div className={css.formInput}>
            {isSName && (
              <Input
                placeholder='Иванович'
                value={patronymic}
                setValue={(v) => {
                  if (!/[a-z0-9]/gi.test(v)) {
                    setPatronymic(v.charAt(0).toUpperCase() + v.slice(1));
                    setLastSName(v.charAt(0).toUpperCase() + v.slice(1));
                  }
                }}
                label='Отчество'
                type='text'
                name='patronymic'
                valid={patronymic && patronymic.length > 0}
              />
            )}
            {lastSName.length < 1 && (
              <div className={css.snameLabel}>
                <input
                  type='checkbox'
                  checked={!isSName}
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
              valid={dateborn.indexOf('_') === -1 && dateborn.length > 0}
              value={dateborn}
              dateType
              setValue={(e) => {
                setDateborn(e);
              }}
              label='Дата рождения*'
            />
          </div>
          <div className={css.formInput}>
            <NewPhoneInput
              value={phone}
              setValue={setPhone}
              label='Номер сотового телефона*'
              valid={
                phone && phone.length > 0
                  ? !validatePhoneNumberLength(phone, 'RU')
                  : false
              }
            />
          </div>
          <div className={css.formInput}>
            <Input
              valid={Isemail.validate(email, { minDomainAtoms: 2 })}
              value={email}
              setValue={(v) => {
                if (!/[а-я]/gi.test(v)) {
                  setEmail(v);
                }
              }}
              eMail={true}
              placeholder='example@gmail.com'
              label='E-mail*'
              name='email'
            />
          </div>
          <div className={css.formInput}>
            <Input
              EyeOpen
              valid={
                password !== '' &&
                password.length >= 6 &&
                password.match(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/)
              }
              value={password}
              setValue={(value) => {
                setPassword(value);
              }}
              label='Пароль*'
              password
              name='password'
            />
          </div>
          <div className={css.formInput}>
            <Input
              EyeOpen
              valid={
                password !== '' &&
                password.length >= 6 &&
                password.match(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/) &&
                password2 === password
              }
              value={password2}
              setValue={(value) => {
                setPassword2(value);
              }}
              label='Повторите пароль*'
              name='password'
              password
            />
          </div>
        </div>
        {password.length > 0 &&
          !password.match(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,}$/) && (
            <ul className={css.passwordRequirements}>
              <li>Пароль должен быть 6 символов или более.</li>
              <li>Только латиница, тире, точки. Пробелы не допустимы.</li>
              <li>Также 1 заглавную и 1 прописную</li>
            </ul>
          )}
        {institutes && folkroles && (
          <div className={css.selects}>
            <div className={css.formSelect}>
              <Select
                value={role}
                disabled={false}
                setValue={setRole}
                label='Статус*'
                options={folkroles}
                name='role'
              />
            </div>
            {institutes[0] !== undefined && (
              <div className={css.formSelect}>
                <Select
                  // value={institute}
                  value={institutes[institute - 1].kod}
                  disabled={false}
                  setValue={setInstitute}
                  label='ВУЗ*'
                  options={institutes}
                  name='institute'
                />
              </div>
            )}
          </div>
        )}
        <div className={css.checkbox}>
          <div className={css.checkboxNative}>
            <input
              type='checkbox'
              checked={checkboxClick}
              onChange={() => setCheckboxClick(!checkboxClick)}
            />
          </div>
          <div className={css.formInput}>
            <a
              className={css.checkboxText}
              target='_blank'
              href={`${universityUrl}politikaPd-${universityPd}.pdf`}
            >
              Даю свое согласие на обработку персональных данных
            </a>
          </div>
        </div>

        <div className={css.enterBtn}>
          <button
            type='submit'
            className={
              lastName !== '' &&
              lastName.length >= 1 &&
              validateName(lastName) &&
              firstName !== '' &&
              firstName.length >= 1 &&
              validateName(firstName) &&
              dateborn.indexOf('_') === -1 &&
              validateEmail(email) &&
              password !== '' &&
              password.length >= 6 &&
              password2 !== '' &&
              password2.length >= 6 &&
              password2 === password &&
              checkboxClick === true
                ? css.Button
                : css.Disabled
            }
            disabled={
              !(
                lastName !== '' &&
                lastName.length >= 1 &&
                validateName(lastName) &&
                firstName !== '' &&
                firstName.length >= 1 &&
                validateName(firstName) &&
                dateborn.indexOf('_') === -1 &&
                validateEmail(email) &&
                password !== '' &&
                password.length >= 6 &&
                password2 !== '' &&
                password2.length >= 6 &&
                password2 === password &&
                checkboxClick === true
              )
            }
          >
            Далее
          </button>
        </div>
      </form>
    </>
  );
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateName(value) {
  const reg = /^[А-ЯЁа-яё -]+$/;
  return reg.test(value);
}

export default FormPart1;
