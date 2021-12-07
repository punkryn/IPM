import Workspace from '@layouts/Workspace';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React from 'react';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import useSWR from 'swr';
import { Tab, Tabcontent, Tabnav } from './styles';

const List = () => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { nickname } = useParams();
  const { data: tabInfo } = useSWR(userData ? `/api/main/tab/${nickname}` : null, fetcher);

  console.log('nick', nickname);
  if (userData === undefined) {
    return <div>loading...</div>;
  }

  if (!userData) {
    console.log('redirect');
    return <Navigate to="/login" />;
  }

  return (
    <Workspace>
      <Tab>
        <Tabnav>
          {userData.tabs.map((item, index) => {
            return <li key={index}>{item.name}</li>;
          })}
        </Tabnav>
        <Tabcontent>
          <div className="active">{nickname}</div>
          <div>content2</div>
        </Tabcontent>
      </Tab>
    </Workspace>
  );
};

export default List;
