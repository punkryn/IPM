import Workspace from '@layouts/Workspace';
import { IInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import useSWR, { useSWRConfig } from 'swr';
import { Tab } from './styles';
import Tabnav from '@components/Tabnav';
import Tabcontent from '@components/Tabcontent';
import tabFetcher from '@utils/tabFetcher';
import PushButton from '@components/PushButton';
import tabIndexFetcher from '@utils/tabIndexFetcher';

const List = () => {
  const { mutate: tmpMutate } = useSWRConfig();
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { nickname } = useParams();
  const {
    data: tabInfo,
    error: tabError,
    mutate: tabMutate,
  } = useSWR<IInfo[] | false | void>(userData ? `/api/tab/info/${nickname}` : null, tabFetcher);

  // const [currentTab, setCurrentTab] = useState(0);
  // const [tabNow, setTabNow] = useState(0);
  // const [tabCollapse, setTabCollapse] = useState<boolean[]>([]);

  const { data: tabIndex } = useSWR('tabIndex');

  useEffect(() => {
    if (tabInfo && tabInfo.length > 0) {
      let minId = 1e9;
      tabInfo.forEach((item) => {
        if (item.tab_id < minId) {
          minId = item.tab_id;
        }
      });

      // setCurrentTab(minId);
      if (tabIndex === undefined) {
        tmpMutate('tabIndex', minId);
      } else if (tabIndex === 0) {
        tmpMutate('tabIndex', minId);
      }
    }
  }, [tabInfo]);

  if (userData === undefined) {
    return <div>loading...</div>;
  }

  if (!userData) {
    console.log('redirect');
    return <Navigate to="/login" />;
  }

  if (tabInfo === undefined) {
    return <div>loading...</div>;
  }

  if (userData.nickname !== nickname) {
    console.log('redirect');
    return <Navigate to="/login" />;
  }

  return (
    <Workspace>
      <Tab>
        <Tabnav />
        <Tabcontent>
          <PushButton />
        </Tabcontent>
      </Tab>
    </Workspace>
  );
};

export default List;
