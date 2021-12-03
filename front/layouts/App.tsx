import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';

const SignUp = loadable(() => import('@pages/SignUp'));
const Login = loadable(() => import('@pages/LogIn'));
const List = loadable(() => import('@pages/List'));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/main" element={<List />} />
    </Routes>
  );
};

export default App;
