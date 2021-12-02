import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Input from '../../components/Input/Input';
import css from './Enter.module.css';
import Back from '../../components/Back/Back';
import request from '../../request';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import Isemail from 'isemail';

const RecoverPWD = () => {
  const [title, setTitle] = useState('Ошибка');
  const [email, setEmail] = useState('');
  const [success, setsuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [textError, setTextError] = useState('');

  if (success) return <Redirect to='/login' />;

  return (
    <div className={css.base_container}>
      <Back to='/login' />
      <div className={css.header}>Воccтановление пароля</div>
      <div className={css.content}>
        <div className={css.label}>
          <label>Введите ваш E-mail</label>
        </div>
        <div className={css.formInput}>
          <Input
            enterInput
            type='text'
            name='login'
            value={email}
            setValue={(v) => {
              if (!/[а-я]/gi.test(v)) {
                setEmail(v);
              }
            }}
            valid={Isemail.validate(email, { minDomainAtoms: 2 })}
          />
        </div>
        <Button
          className={css.nextBtn}
          disabled={!Isemail.validate(email, { minDomainAtoms: 2 })}
          onclick={async () => {
            try {
              const data = await request.post('persident/pwdrecover', [
                ['email', email],
              ]);
              if (data.status !== 'error') {
                setOpenModal(true);
                setTitle('Успешно');
                setTextError('На вашу почту был отправлен новый пароль');
                setEmail('');
              } else {
                setOpenModal(true);
                setTextError(data.errordesc);
                setTitle('Ошибка');
              }
            } catch (error) {
              setOpenModal(true);
              setTextError(error);
              setTitle('Ошибка');
            }
          }}
        >
          Далее
        </Button>
      </div>
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
        BtnClick={() => {
          setOpenModal(false);
          setsuccess(true);
        }}
        buttonTitle='Ок'
      />
    </div>
  );
};

export default RecoverPWD;
