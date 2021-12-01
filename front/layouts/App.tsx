import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignUp from '@pages/SignUp';
import Login from '@pages/Login';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default App;
