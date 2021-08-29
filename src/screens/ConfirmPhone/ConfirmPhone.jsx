import React from 'react';
import './ConfirmPhone.module.css';

export default function ConfirmPhoneNumberScreen() {
  return (
    <div>
      Экран подтверждения телефона
      <div className='inputbox'>
        <div className='label'>
          {/* <img src={icon} alt='' width={width} height={height} /> */}
          <label htmlFor='name'>Имя</label>
        </div>
        <input type='name' name='name' className='authInput' />
      </div>
    </div>
  );
}
