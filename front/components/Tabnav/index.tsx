import { IInfo, ITabInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import axios from 'axios';
import React, { useEffect, useState, VFC } from 'react';
import { useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import { Navigate, useParams } from 'react-router';
import useSWR from 'swr';
import { isFunctionDeclaration } from 'typescript';
import { AddButton, Nav, Remove } from './styles';

interface Props {
  currentTab: number;
  onChangeTab: (e: any) => void;
  tabNow: number;
}

const Tabnav: VFC<Props> = ({ currentTab, onChangeTab, tabNow }) => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { nickname } = useParams();
  const {
    data: tabInfo,
    error: tabError,
    mutate: tabMutate,
  } = useSWR<IInfo[] | void | false>(userData ? `/api/tab/info/${nickname}` : null, tabFetcher);
  const {
    data: tabsInfo,
    error: tabsError,
    mutate: tabsMutate,
  } = useSWR<ITabInfo[] | void | false>(userData ? `/api/tabs/info/${nickname}` : null, tabFetcher);

  const [inputFlag, setInputFlag] = useState<boolean[]>([]);
  const [tabName, setTabName] = useState('');

  useEffect(() => {
    if (userData && inputFlag.length === 0) {
      for (let i = 0; i < userData?.tabs.length; i++) {
        setInputFlag((prev) => [...prev, false]);
      }
    }
  }, []);

  const onCreateNewTab = useCallback(
    (e) => {
      if (typeof userData === 'boolean' || userData === undefined) {
        return;
      }
      axios
        .post(`/api/tab`, {
          id: userData?.id,
        })
        .then((response) => {
          mutate();
          tabMutate();
          tabsMutate();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [nickname, userData],
  );

  const onRemove = useCallback(
    (e) => {
      e.stopPropagation();
      if (typeof userData === 'boolean' || userData === undefined) {
        return;
      }
      // console.log(e.target.tagName);
      const index = e.target.parentElement.parentElement.parentElement.id;
      if (e.target.tagName === 'path') {
        axios
          .delete(`/api/tab/${userData.tabs[index].tab_id}`)
          .then((response) => {
            mutate();
            tabsMutate();
            tabMutate();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [userData],
  );

  const onActive = useCallback(
    (e) => {
      if (e.target.className === 'active') {
        console.log(inputFlag);
        setTabName(e.target.innerText); // <<< 여기서 시작
      } else {
        onChangeTab(e);
        console.log('target', e.target);
        console.log('userdtaa', userData);
        const lis = e.target.parentElement.children;
        for (let i = 0; i < lis.length - 1; i++) {
          lis[i].className = '';
        }
        e.target.className = 'active';
      }
    },
    [userData, inputFlag],
  );

  if (userData === undefined) {
    return <div>loading...</div>;
  }

  if (!userData) {
    console.log('redirect');
    return <Navigate to="/login" />;
  }

  return (
    <Nav>
      {userData.tabs.map((item, index) => {
        if (!inputFlag[index] && index === 0) {
          return (
            <li key={index} className="active" onClick={onActive} id={String(index)}>
              {item.name}
              <Remove onClick={onRemove}>
                <MdDelete />
              </Remove>
            </li>
          );
        } else if (!inputFlag[index]) {
          return (
            <li key={index} onClick={onActive} id={String(index)}>
              {item.name}
              <Remove onClick={onRemove}>
                <MdDelete />
              </Remove>
            </li>
          );
        } else if (inputFlag[index]) {
          return <input autoFocus value={tabName} />;
        }
      })}
      <AddButton onClick={onCreateNewTab}>+</AddButton>
    </Nav>
  );
};

export default Tabnav;
