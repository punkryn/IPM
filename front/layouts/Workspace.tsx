import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import useSWR from 'swr';

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log('data', data);
  if (data === undefined) {
    return <div>loading...</div>;
  }

  if (!data) {
    console.log('redirect');
    return <Navigate to="/login" />;
  }

  return (
    <>
      <button onClick={onLogout}>logout</button>
      {children}
    </>
  );
};

export default Workspace;
