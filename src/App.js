import React from 'react';
import './App.css';
import EnterFin from './screens/Enter_Fin/EnterFin';
import Enter from './screens/Enter/Enter';
import FormPart1 from './screens/FormPart1/FormPart1';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FormPart2 from './screens/FormPart2/FormPart2';
import Success from './screens/Success/Success';
import Profile from './screens/Profile/Profile';
import RecoverPWD from './screens/Enter/RecoverPWD';
import MyPhoto4ki from './screens/MyPhoto4ki/MyPhotos';
import ConfirmAccountFromMail from './screens/ConfirmAccountFromMail/ConfirmAccountFromMail';
import ConfirmPhoneNumberScreen from './screens/ConfirmPhone/ConfirmPhone';
import CovidCertPage from './screens/CovidCert/CovidCertPage';

const App = () => {
  return (
    <div className='app-wrapper'>
      <div className='app-wrapper-content'>
        <Router>
          <Route path='/my-photos' component={MyPhoto4ki} />
          <Route path='/profile' component={Profile} />
          <Route path='/confirm-email' component={ConfirmAccountFromMail} />
          <Route path='/success' component={Success} />
          <Route path='/confirm-registration' component={FormPart2} />
          <Route path='/registration' component={FormPart1} />
          <Route path='/recover-password' component={RecoverPWD} />
          <Route path='/phone-confirm' component={ConfirmPhoneNumberScreen} />
          <Route path='/login' component={Enter} />
          <Route path='/covid' component={CovidCertPage} />
          <Route path='/' exact component={EnterFin} />
        </Router>
      </div>
    </div>
  );
};

export default App;
