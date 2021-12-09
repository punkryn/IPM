import Workspace from '@layouts/Workspace';
import { IInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import useSWR from 'swr';
import { Tab } from './styles';
import Tabnav from '@components/Tabnav';
import Tabcontent from '@components/Tabcontent';
import tabFetcher from '@utils/tabFetcher';

const List = () => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { nickname } = useParams();
  const {
    data: tabInfo,
    error: tabError,
    mutate: tabMutate,
  } = useSWR<IInfo[] | false | void>(userData ? `/api/tab/${nickname}` : null, tabFetcher);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (tabInfo) {
      let minId = 1e9;
      tabInfo.forEach((item) => {
        if (item.tab_id < minId) {
          minId = item.tab_id;
        }
      });
      setCurrentTab(minId);
    }
  }, [tabInfo]);

  const onChangeTab = useCallback(
    (e) => {
      if (typeof userData !== 'boolean') {
        setCurrentTab(Number(userData?.tabs[Number(e.target.id)].tab_id));
      }
    },
    [userData],
  );

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
        <Tabnav currentTab={currentTab} onChangeTab={onChangeTab} />
        <Tabcontent currentTab={currentTab} onChangeTab={onChangeTab} />
      </Tab>
    </Workspace>
  );
};

export default List;
