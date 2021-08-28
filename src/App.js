import React from 'react';
import './App.css';
import EnterFin from './screens/Enter_Fin/EnterFin';
import Enter from './screens/Enter/Enter';
import FormPart1 from './screens/FormPart1/FormPart1';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FormPart2 from './screens/FormPart2/FormPart2';
import FormPart3 from './screens/FormPart3/FormPart3';
import Success from './screens/Success/Success';
import Profile from './screens/Profile/Profile';
import RecoverPWD from './screens/Enter/RecoverPWD';
import MyPhoto4ki from './screens/MyPhoto4ki/MyPhotos';
import ConfirmAccountFromMail from './screens/ConfirmAccountFromMail/ConfirmAccountFromMail';
import ConfirmPhoneNumberScreen from './screens/ConfirmPhone/ConfirmPhone';

const App = () => {
  return (
    <Router>
      <div className='app-wrapper'>
        <div className='app-wrapper-content'>
          <Route path='/myPhoto4ki' exact component={MyPhoto4ki} />
          <Route path='/profile' exact component={Profile} />
          <Route
            path='/confirmAccountFromMail'
            exact
            component={ConfirmAccountFromMail}
          />
          <Route path='/success' exact component={Success} />
          <Route path='/formPart3' exact component={FormPart3} />
          <Route path='/formPart2' exact component={FormPart2} />
          <Route path='/formPart1' exact component={FormPart1} />
          <Route path='/recoverPWD' exact component={RecoverPWD} />
          <Route
            path='/phone-confirm'
            exact
            component={ConfirmPhoneNumberScreen}
          />
          <Route path='/login' exact component={Enter} />
          <Route path='/' exact component={EnterFin} />
        </div>
      </div>
    </Router>
  );
};

export default App;
