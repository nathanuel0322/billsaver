import React, {useContext, useState, useEffect} from 'react';
import {onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.js';
import { AuthContext } from '../../App.jsx';
import { HashRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Home from '../../screens/Home.jsx';
import SignupScreen from '../../screens/SignUpScreen.jsx';
import LoginScreen from '../../screens/LoginScreen.jsx';
import { BillForm } from '../../screens/BillForm.jsx';

export default function Routing() {
  const {user, setUser} = useContext(AuthContext);

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser); 
    return () => unsubscribe(); 
  }, [])

  return (
    <Router>
      {user ?
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/form' element={<BillForm />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      :
        <Routes>
          <Route exact path='/' element={<SignupScreen />} />
          <Route exact path='/signin' element={<LoginScreen />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      }
    </Router>
  );
};