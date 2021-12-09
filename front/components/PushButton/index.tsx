import { IInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { CircleButton, Input, InsertForm, InsertFormPositioner } from './styles';

interface Props {
  currentTab: number;
  tabNow: number;
}

const PushButton: VFC<Props> = ({ currentTab, tabNow }) => {
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { nickname } = useParams();
  const {
    data: tabInfo,
    error: tabError,
    mutate: tabMutate,
  } = useSWR<IInfo[] | false | void>(userData ? `/api/tab/info/${nickname}` : null, tabFetcher);

  const [open, setOpen] = useState(false);
  const [host, setHost] = useState('');
  const [id, setId] = useState('');
  const [hint, setHint] = useState('');
  const [pwd, setPwd] = useState('');
  const onToggle = () => setOpen((prev) => !prev);

  const onChange = useCallback((e) => {
    switch (e.target.id) {
      case 'host':
        setHost(e.target.value);
        break;
      case 'id':
        setId(e.target.value);
        break;
      case 'hint':
        setHint(e.target.value);
        break;
      case 'pwd':
        setPwd(e.target.value);
        break;
      default:
        break;
    }
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      setHost('');
      setId('');
      setHint('');
      setPwd('');
      const tabNum = tabNow === 0 ? currentTab : tabNow;

      axios
        .post(`/api/tab/${tabNum}`, {
          host,
          id,
          hint,
          pwd,
        })
        .then((response) => {
          tabMutate();
        })
        .catch((err) => {
          console.log(err);
        });

      setOpen(false);
    },
    [host, id, hint, pwd, tabNow, currentTab],
  );

  const onKeyPress = useCallback(
    (e) => {
      if (e.key !== 'Enter' && e.key !== 'NumpadEnter') {
        return;
      }
      onSubmit(e);
    },
    [host, id, hint, pwd, tabNow, currentTab],
  );
  return (
    <>
      {open && (
        <InsertFormPositioner>
          <InsertForm onKeyPress={onKeyPress}>
            HOST{' '}
            <Input autoFocus placeholder="계정의 사용처를 입력하세요." onChange={onChange} value={host} id="host" />
            ID{' '}
            <Input
              placeholder="로그인에 필요한 이메일 또는 아이디를 입력하세요."
              onChange={onChange}
              value={id}
              id="id"
            />
            HINT{' '}
            <Input
              placeholder="로그인에 필요한 비밀번호의 힌트를 입력하세요."
              onChange={onChange}
              value={hint}
              id="hint"
            />
            PASSWORD{' '}
            <Input placeholder="로그인에 필요한 비밀번호를 입력하세요." onChange={onChange} value={pwd} id="pwd" />
          </InsertForm>
        </InsertFormPositioner>
      )}
      <CircleButton onClick={onToggle} open={open}>
        <MdAdd />
      </CircleButton>
    </>
  );
};

export default React.memo(PushButton);
