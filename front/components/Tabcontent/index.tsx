import { IInfo, ITabInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import axios from 'axios';
import React, { FC, useCallback, useEffect, useState, VFC } from 'react';
import { MdDelete } from 'react-icons/md';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Content, Remove } from './styles';

interface Props {
  currentTab: number;
  onChangeTab: (e: any) => void;
  tabNow: number;
}

const Tabcontent: FC = ({ children }) => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { nickname } = useParams();
  const {
    data: tabInfo,
    error: tabError,
    mutate: tabMutate,
  } = useSWR<IInfo[] | false | void>(userData ? `/api/tab/info/${nickname}` : null, tabFetcher);
  const {
    data: tabsInfo,
    error: tabsError,
    mutate: tabsMutate,
  } = useSWR<ITabInfo[] | void | false>(userData ? `/api/tabs/info/${nickname}` : null, tabFetcher);

  const { data: tabIndex } = useSWR('tabIndex');

  const [info, setInfo] = useState([
    {
      info_id: 0,
      tab_id: 0,
      tab_name: '',
      userEmail: '',
      hint: '',
      host: '',
    },
  ]);

  useEffect(() => {
    if (tabInfo !== undefined && tabInfo) {
      // if (tabNow === 0) {
      //   setInfo(tabInfo.filter((item) => item.tab_id === currentTab));
      // } else {
      //   setInfo(tabInfo.filter((item) => item.tab_id === tabNow));
      // }
      // console.log('td', tabIndex);
      // if (tabIndex === 0) {
      //   setInfo(tabInfo.filter((item) => item.tab_id === currentTab));
      // } else {
      setInfo(tabInfo.filter((item) => item.tab_id === tabIndex));
      // }
    }
  }, [tabInfo, tabIndex]);

  const onRemove = useCallback((info_id) => {
    axios
      .delete(`/api/tab/info/${info_id}`)
      .then((response) => {
        tabMutate();
        tabsMutate();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Content>
        <thead>
          <tr>
            <th>호스트</th>
            <th>아이디</th>
            <th>힌트</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {info?.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.host}</td>
                <td>{item.userEmail}</td>
                <td>{item.hint}</td>
                <td>
                  <Remove
                    onClick={() => {
                      onRemove(info[index].info_id);
                    }}
                  >
                    <MdDelete />
                  </Remove>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Content>
      {children}
    </>
  );
};

export default Tabcontent;
