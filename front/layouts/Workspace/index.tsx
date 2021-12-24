import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import useSWR, { useSWRConfig } from 'swr';
import {
  Channels,
  Chats,
  Header,
  HeaderTitle,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import Menu from '@components/Menu';
import { IUser } from '@typings/db';
import HostList from '@components/HostList';

const Workspace: FC = ({ children }) => {
  const { mutate: tmpMutate } = useSWRConfig();
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate();
        tmpMutate('tabIndex', 0);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  // const onClickTmp = useCallback((e) => {
  //   axios
  //     .post('/api/tmp', {})
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  if (userData === undefined) {
    return <div>loading...</div>;
  }

  if (!userData) {
    console.log('redirect');
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header>
        <HeaderTitle>IPM</HeaderTitle>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        {/* <Workspaces>test</Workspaces> */}
        <Channels>
          <WorkspaceName>IPM</WorkspaceName>
          <MenuScroll>
            <HostList />
          </MenuScroll>
        </Channels>
        <Chats>{children}</Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
