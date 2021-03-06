import { IInfo, ITabInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import axios from 'axios';
import React, { FC, useCallback, useEffect, useState, VFC } from 'react';
import { MdDelete } from 'react-icons/md';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Button, ButtonGroup, Content, DarkBackground, DialogBlock, Remove, Error } from './styles';

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
  const [pwdError, setPwdError] = useState(false);

  const [currentPwd, setCurrentPwd] = useState(0);

  const [hostPassword, setHostPassword] = useState('');
  const [correctPwd, setCorrectPwd] = useState(false);

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
    setPwdError(false);
    setCurrentPwd(Number(e.target.accessKey));
  }, []);

  const onChangePwd = useCallback((e) => {
    setPwd(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      if (!userData) return;
      axios
        .post(`/api/users/${userData?.nickname}/password`, {
          password: pwd,
          currentPwd,
        })
        .then((response) => {
          // console.log(response);
          // setShowPwd(false);
          setPwdError(false);
          setCorrectPwd(true);
          setHostPassword(response.data);
        })
        .catch((err) => {
          setPwdError(err.response?.status === 401);
        });
    },
    [pwd, userData, tabIndex],
  );

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
            <th>?????????</th>
            <th>?????????</th>
            <th>??????</th>
            <th>??????</th>
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
                    <Button style={{ background: '#228be6' }} accessKey={String(tabInfo[index].info_id)}>
                      ?????? ??????
                    </Button>
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
        <DarkBackground>
          <DialogBlock onClick={stopPropagation}>
            <h3>{'???????????? ????????? ????????? ??????????????????.'}</h3>
            <p>{'????????????'}</p>
            {!correctPwd && (
              <input autoFocus type="password" value={pwd} onChange={onChangePwd} style={{ width: '100%' }} />
            )}
            {correctPwd && <p style={{ wordBreak: 'break-all' }}>{hostPassword}</p>}
            {pwdError && <Error>????????? ???????????? ????????????.</Error>}

            {!correctPwd && (
              <ButtonGroup>
                <Button style={{ background: '#228be6' }} onClick={onSubmit}>
                  ??????
                </Button>
                <Button
                  style={{ background: '#495057' }}
                  onClick={() => {
                    setShowPwd(false);
                    setPwdError(false);
                  }}
                >
                  ??????
                </Button>
              </ButtonGroup>
            )}
            {correctPwd && (
              <ButtonGroup>
                <Button
                  style={{ background: '#495057' }}
                  onClick={() => {
                    setShowPwd(false);
                    setCorrectPwd(false);
                  }}
                >
                  ??????
                </Button>
              </ButtonGroup>
            )}
          </DialogBlock>
        </DarkBackground>
      )}
    </>
  );
};

export default Tabcontent;
