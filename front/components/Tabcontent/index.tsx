import { IInfo, ITabInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import axios from 'axios';
import React, { FC, useCallback, useEffect, useState, VFC } from 'react';
import { MdDelete } from 'react-icons/md';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Content, DarkBackground, DialogBlock, Remove } from './styles';

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
  const [showPwd, setShowPwd] = useState<boolean>(false);

  const [pwd, setPwd] = useState<string>('');

  // useEffect(() => {
  //   if (tabInfo) {
  //     setShowPwd([]);
  //     for (let i = 0; i < tabInfo.length; i++) {
  //       setShowPwd((prev) => [...prev, false]);
  //     }
  //   }
  // }, [tabInfo, tabIndex]);

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

  const onClickShowPwd = useCallback((e) => {
    setPwd('');
    setShowPwd((prev) => !prev);
  }, []);

  const onChangePwd = useCallback((e) => {
    setPwd(e.target.value);
  }, []);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

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
                  <span onClick={onClickShowPwd}>
                    {/* <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} /> */}
                    <button>암호 보기</button>
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
      {showPwd && (
        <DarkBackground onClick={onClickShowPwd}>
          <DialogBlock onClick={stopPropagation}>
            <h3>{'로그인시 사용한 비밀번호를 입력해주세요.'}</h3>
            <p>{'비밀번호'}</p>
            <input type="password" value={pwd} onChange={onChangePwd} />
          </DialogBlock>
        </DarkBackground>
      )}
    </>
  );
};

export default Tabcontent;
