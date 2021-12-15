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
  const [showPwd, setShowPwd] = useState<boolean[]>([]);

  useEffect(() => {
    if (tabInfo) {
      setShowPwd([]);
      for (let i = 0; i < tabInfo.length; i++) {
        setShowPwd((prev) => [...prev, false]);
      }
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

  const onClickShowPwd = useCallback(
    (idx) => {
      setShowPwd(showPwd.map((item, index) => (index === idx ? !item : item)));
    },
    [showPwd],
  );

  if (!tabInfo) {
    return null;
  }

  return (
    <>
      <Content>
        <thead>
          <tr>
            <th>호스트</th>
            <th>아이디</th>
            <th>힌트</th>
            <th>비밀번호</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tabInfo?.map((item, index) => {
            if (item.tab_id !== tabIndex) return;
            return (
              <tr key={index}>
                <td>{item.host}</td>
                <td>{item.userEmail}</td>
                <td>{item.hint}</td>
                <td>
                  <span
                    onClick={() => {
                      onClickShowPwd(index);
                    }}
                  >
                    {/* <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} /> */}
                    <button>pwd</button>
                    {showPwd[index] && (
                      <div>input</div>
                      // <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                      //   <ProfileModal>
                      //     <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                      //     <div>
                      //       <span id="profile-name">{userData.nickname}</span>
                      //       <span id="profile-active">Active</span>
                      //     </div>
                      //   </ProfileModal>
                      //   <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                      // </Menu>
                    )}
                  </span>
                </td>
                <td>
                  <Remove
                    onClick={() => {
                      onRemove(tabInfo[index].info_id);
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
