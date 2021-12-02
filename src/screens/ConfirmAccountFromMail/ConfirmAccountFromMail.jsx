import { useState, React, useEffect } from 'react';
import Frame from '../../images/Frame.svg';
import css from './ConfirmAccountFromMail.module.css';
import Modal from '../../components/Modal/Modal';
import request from '../../request';
import Button from '../../components/Button/Button';

const ConfirmAccountFromMail = () => {
  const [openModal, setOpenModal] = useState(false);
  const [textError, setTextError] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const data = await request.post('persident/folkactivate', [
        ['key', `${window.location.href.split('key=')[1]}`],
      ]);
      if (data.status !== 'error') {
        // console.log(data);
      } else {
        setOpenModal(true);
        setTextError(data.errordesc);
        console.log(data);
      }
    } catch (error) {
      // console.log('error: ', error);
      setOpenModal(true);
      setTextError(error);
    }
  };

  return (
    <div className={css.base_container}>
      <div className={css.header}>Ваша учетная запись успешно подтверждена</div>
      <div className={css.content}>
        <center>
          <div
            style={{
              marginTop: 41,
              marginBottom: 65,
              width: 111,
              height: 111,
              borderRadius: 128,
              backgroundColor: '#247ABF',
            }}
          >
            <img
              style={{ width: 48, height: 65, marginTop: 24 }}
              src={Frame}
              alt='ok'
            />
          </div>
        </center>
        <Button to='/login'>Далее</Button>
        <Modal
          open={openModal}
          close={() => setOpenModal(false)}
          title='Ошибка'
          text={textError}
          BtnClick={() => setOpenModal(false)}
          buttonTitle='Ок'
        />
      </div>
    </div>
  );
};

export default ConfirmAccountFromMail;
