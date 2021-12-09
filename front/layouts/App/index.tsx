import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';

const SignUp = loadable(() => import('@pages/SignUp'));
const Login = loadable(() => import('@pages/LogIn'));
// const Workspace = loadable(() => import('@layouts/Workspace'));
const List = loadable(() => import('@pages/List'));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      {/* <Route path="/main/tab/:nickname" element={<List />} /> */}
      <Route path="/:nickname" element={<List />} />
    </Routes>
  );
};

export default App;
