import React, { Component } from 'react';
import Download from './Components/Intern/Download'
import PendingIntern from './Components/Intern/pendingIntern';
import Intern from './Components/Intern/Intern'
import Signup from './Components/Authentication/Signup'
import DashBoard from './Components/DashBoard'
import Login from './Components/Authentication/Login'
import Verify from './Components/Authentication/Verify'
import ForgotPassword from './Components/Authentication/Forgotpassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">

        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<DashBoard />} />
            <Route exact path="/intern" element={<Intern />} />
            <Route exact path="/forgotpassword" element={<ForgotPassword />} />
            
            <Route exact path="/internstatus" element={<PendingIntern />} />
            <Route exact path="/download" element={<Download />} />

            {(!localStorage.getItem('authtoken')) ?
<>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/verify" element={<Verify />} />
            </>
            : ''
            }


          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;


