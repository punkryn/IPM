import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import axios from 'axios';
import React, { VFC } from 'react';
import { useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import { Navigate, useParams } from 'react-router';
import useSWR from 'swr';
import { AddButton, Nav, Remove } from './styles';

interface Props {
  currentTab: number;
  onChangeTab: (e: any) => void;
}

const Tabnav: VFC<Props> = ({ currentTab, onChangeTab }) => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { nickname } = useParams();
  // const { data: tabInfo } = useSWR(userData ? `/api/tab/${nickname}` : null, tabFetcher);

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
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [userData],
  );

  const onActive = useCallback((e) => {
    if (e.target.className === 'active') {
    } else {
      onChangeTab(e);
      const lis = e.target.parentElement.children;
      for (let i = 0; i < lis.length - 1; i++) {
        lis[i].className = '';
      }
      e.target.className = 'active';
    }
  }, []);

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
        if (index === 0) {
          return (
            <li key={index} className="active" onClick={onActive} id={String(index)}>
              {item.name}
              <Remove onClick={onRemove}>
                <MdDelete />
              </Remove>
            </li>
          );
        }
        return (
          <li key={index} onClick={onActive} id={String(index)}>
            {item.name}
            <Remove onClick={onRemove}>
              <MdDelete />
            </Remove>
          </li>
        );
      })}
      <AddButton onClick={onCreateNewTab}>+</AddButton>
    </Nav>
  );
};

export default Tabnav;
