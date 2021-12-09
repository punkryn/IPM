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
import PushButton from '@components/PushButton';

const List = () => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { nickname } = useParams();
  const {
    data: tabInfo,
    error: tabError,
    mutate: tabMutate,
  } = useSWR<IInfo[] | false | void>(userData ? `/api/tab/info/${nickname}` : null, tabFetcher);
  const [currentTab, setCurrentTab] = useState(0);
  const [tabNow, setTabNow] = useState(0);

  useEffect(() => {
    if (tabInfo && tabInfo.length > 0) {
      let minId = 1e9;
      tabInfo.forEach((item) => {
        if (item.tab_id < minId) {
          minId = item.tab_id;
        }
      });

      setCurrentTab(minId);
    }
  }, [tabInfo]);

  useEffect(() => {
    axios.get(`/api/tab/${nickname}`).then((response) => {
      console.log(response.data);
      setCurrentTab(response.data[0].minId);
    });
  }, []);

  const onChangeTab = useCallback(
    (e) => {
      if (typeof userData !== 'boolean') {
        setTabNow(Number(userData?.tabs[Number(e.target.id)].tab_id));
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
        <Tabnav currentTab={currentTab} tabNow={tabNow} onChangeTab={onChangeTab} />
        <Tabcontent currentTab={currentTab} tabNow={tabNow} onChangeTab={onChangeTab}>
          <PushButton currentTab={currentTab} tabNow={tabNow} />
        </Tabcontent>
      </Tab>
    </Workspace>
  );
};

export default List;
