import { Button, ButtonGroup, DarkBackground, DialogBlock } from '@components/Tabcontent/styles';
import { IInfo, ITabInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import tabIndexFetcher from '@utils/tabIndexFetcher';
import axios from 'axios';
import React, { ReactElement, useEffect, useRef, useState, VFC } from 'react';
import { useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import { Navigate, useParams } from 'react-router';
import useSWR, { useSWRConfig } from 'swr';
import { AddButton, Nav, Remove } from './styles';

interface Props {
  currentTab: number;
  onChangeTab: (e: any) => void;
  tabNow: number;
}

const Tabnav = () => {
  const { mutate: tmpMutate } = useSWRConfig();
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

  const { data: tabIndex } = useSWR('tabIndex');

  const [inputFlag, setInputFlag] = useState<boolean[]>([]);
  const [tabName, setTabName] = useState('');

  const headerRef = useRef<HTMLUListElement>(null);

  const { data: headerRefData } = useSWR('headerRef');

  const [showPanel, setShowPanel] = useState(false);
  const [selectedTabtoRemove, setSelectedTabtoRemove] = useState(-1);

  useEffect(() => {
    if (userData && inputFlag.length === 0) {
      for (let i = 0; i < userData?.tabs.length; i++) {
        setInputFlag((prev) => [...prev, false]);
      }
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setInputFlag([]);
      for (let i = 0; i < userData?.tabs.length; i++) {
        setInputFlag((prev) => [...prev, false]);
      }
    }
  }, [userData]);

  useEffect(() => {
    tmpMutate('headerRef', headerRef);
  }, [headerRef]);

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
      if (typeof userData === 'boolean' || userData === undefined) {
        return;
      }

      axios
        .delete(`/api/tab/${userData.tabs[selectedTabtoRemove].tab_id}`)
        .then((response) => {
          mutate();
          tabsMutate();
          tabMutate();
          setShowPanel(false);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [userData, selectedTabtoRemove],
  );

  const onActive = useCallback(
    (e) => {
      if (e.target.className === 'active') {
        // console.log(inputFlag);
        setTabName(e.target.innerText);
        setInputFlag(inputFlag.map((item, index) => (index === Number(e.target.id) ? !item : item)));
      } else {
        tmpMutate('tabIndex', userData && userData?.tabs[Number(e.target.id)]?.tab_id);

        const lis = e.target.parentElement.children;
        for (let i = 0; i < lis.length - 1; i++) {
          lis[i].className = '';
        }
        e.target.className = 'active';
      }
    },
    [userData, inputFlag, tabName, tabIndex],
  );

  const onChangeTabName = useCallback(
    (e) => {
      setTabName(e.target.value);
    },
    [tabName],
  );

  const onTabKeyPress = useCallback(
    (e) => {
      if (userData && (e.code === 'Enter' || e.code === 'NumpadEnter')) {
        axios
          .patch(`/api/tab/${userData?.tabs[e.target.id].tab_id}`, {
            name: tabName,
          })
          .then((response) => {
            setInputFlag(inputFlag.map((item, index) => (index === Number(e.target.id) ? !item : item)));
            mutate();
            tabsMutate();
            tabMutate();
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (e.code === 'Escape') {
        console.log(e.target);
        setInputFlag(inputFlag.map((item, index) => (index === Number(e.target.id) ? !item : item)));
      }
    },
    [tabName, userData, inputFlag],
  );

  const checkRemove = useCallback((e) => {
    setShowPanel(true);
    if (e.target.tagName === 'svg') {
      setSelectedTabtoRemove(Number(e.target.parentElement.parentElement.id));
    } else if (e.target.tagName === 'path') {
      setSelectedTabtoRemove(Number(e.target.parentElement.parentElement.parentElement.id));
    }
    e.stopPropagation();
  }, []);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (userData === undefined) {
    return <div>loading...</div>;
  }

  if (!userData) {
    console.log('redirect');
    return <Navigate to="/login" />;
  }

  return (
    <Nav ref={headerRef}>
      {userData.tabs.map((item, index) => {
        if (!inputFlag[index] && index === 0) {
          return (
            <li key={index} className="active" onClick={onActive} id={String(index)}>
              {item.name}
              <Remove onClick={checkRemove}>
                <MdDelete />
              </Remove>
            </li>
          );
        } else if (!inputFlag[index]) {
          return (
            <li key={index} onClick={onActive} id={String(index)}>
              {item.name}
              <Remove onClick={checkRemove}>
                <MdDelete />
              </Remove>
            </li>
          );
        } else if (inputFlag[index]) {
          return (
            <input
              id={String(index)}
              autoFocus
              value={tabName}
              onChange={onChangeTabName}
              onKeyDown={onTabKeyPress}
              key={index}
            />
          );
        }
      })}
      <AddButton onClick={onCreateNewTab}>+</AddButton>
      {showPanel && (
        <DarkBackground
          onClick={() => {
            setShowPanel(false);
          }}
        >
          <DialogBlock onClick={stopPropagation}>
            <h3>{'선택한 탭을 삭제하시겠습니까?'}</h3>
            {/* <p>{'비밀번호'}</p> */}
            <ButtonGroup>
              <Button style={{ background: '#228be6' }} onClick={onRemove}>
                삭제
              </Button>
              <Button
                style={{ background: '#495057' }}
                onClick={() => {
                  setShowPanel(false);
                }}
              >
                취소
              </Button>
            </ButtonGroup>
          </DialogBlock>
        </DarkBackground>
      )}
    </Nav>
  );
};

export default Tabnav;
