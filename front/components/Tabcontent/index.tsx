import { IInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import React, { useEffect, useState, VFC } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Content } from './styles';

interface Props {
  currentTab: number;
  onChangeTab: (e: any) => void;
}

const Tabcontent: VFC<Props> = ({ currentTab, onChangeTab }) => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { nickname } = useParams();
  const { data: tabInfo } = useSWR<IInfo[] | false | void>(userData ? `/api/tab/${nickname}` : null, tabFetcher);
  const [info, setInfo] = useState([
    {
      tab_id: 0,
      tab_name: '',
      userEmail: '',
      hint: '',
      host: '',
    },
  ]);

  useEffect(() => {
    if (tabInfo !== undefined && tabInfo) {
      setInfo(tabInfo.filter((item) => item.tab_id === currentTab));
    }
  }, [currentTab]);

  return (
    <Content>
      <thead>
        <tr>
          <th>호스트</th>
          <th>아이디</th>
          <th>힌트</th>
        </tr>
      </thead>
      <tbody>
        {info?.map((item, index) => {
          return (
            <tr key={index}>
              <td>{item.host}</td>
              <td>{item.userEmail}</td>
              <td>{item.hint}</td>
            </tr>
          );
        })}
      </tbody>
    </Content>
  );
};

export default Tabcontent;
