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
      if (tabIndex === undefined) tmpMutate('tabIndex', minId);
    }
  }, [tabInfo]);

  // useEffect(() => {
  //   axios.get(`/api/tab/${nickname}`).then((response) => {
  //     // console.log(response.data);
  //     // setCurrentTab(response.data[0].minId);
  //     // tmpMutate('tabIndex', response.data[0].minId);
  //   });
  // }, []);

  // const onChangeTab = useCallback(
  //   (e) => {
  //     if (typeof userData !== 'boolean') {
  //       mutate();
  //       console.log('userData', userData);
  //       setTabNow(Number(userData?.tabs[Number(e.target.id)]?.tab_id));
  //     }
  //   },
  //   [userData],
  // );

  // useEffect(() =>  {
  //   if (tabCollapse.length === 0) {
  //     for (let i = 0; tabsInfo && i < tabsInfo?.length; i++) {
  //       setTabCollapse((prev) => [...prev, false]);
  //     }
  //   } else {
  //     setTabCollapse((prev) => [...prev, false]);
  //   }

  //   // setTabCollapse(tabCollapse);
  //   // console.log(tabCollapse);
  // }, [tabsInfo]);

  if (userData === undefined || tabInfo === undefined) {
    return <div>loading...</div>;
  }

  if (!userData) {
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
