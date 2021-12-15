import { IInfo, ITabInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR, { useSWRConfig } from 'swr';
import { CollapseButton, TabCategory } from './styles';

const HostList: FC = () => {
  const { mutate: tmpMutate } = useSWRConfig();
  const { nickname } = useParams();
  // const [socket] = useSocket(workspace);
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: tabInfo } = useSWR<IInfo[] | void | false>(userData ? `/api/tab/info/${nickname}` : null, tabFetcher);
  const { data: tabsInfo } = useSWR<ITabInfo[] | void | false>(
    userData ? `/api/tabs/info/${nickname}` : null,
    tabFetcher,
  );
  const [tabCollapse, setTabCollapse] = useState<boolean[]>([]);
  const { data: tabIndex } = useSWR('tabIndex');
  const { data: headerRefData, error: headerRefError, mutate: headerRefMutate } = useSWR('headerRef');

  useEffect(() => {
    if (tabCollapse.length === 0) {
      for (let i = 0; tabsInfo && i < tabsInfo?.length; i++) {
        setTabCollapse((prev) => [...prev, false]);
      }
    } else {
      setTabCollapse((prev) => [...prev, false]);
    }

    // setTabCollapse(tabCollapse);
    // console.log(tabCollapse);
  }, [tabsInfo]);

  const toggleChannelCollapse = useCallback(
    (index) => {
      setTabCollapse(tabCollapse.map((item, idx) => (index === idx ? !item : item)));
    },
    [tabCollapse],
  );

  const onClickActive = useCallback(
    (e) => {
      // console.log(typeof e.target.children[0].tabIndex);
      if (tabInfo && tabInfo !== undefined) {
        const idx = e.target.tagName === 'SPAN' ? e.target.tabIndex : e.target.children[0].tabIndex;
        const currentUl = headerRefData.current.children;
        for (let i = 0; i < currentUl.length - 1; i++) {
          if (i === idx) {
            currentUl[i].className = 'active';
          } else {
            currentUl[i].className = '';
          }
        }

        const access =
          e.target.tagName === 'SPAN' ? Number(e.target.accessKey) : Number(e.target.children[0].accessKey);
        tmpMutate('tabIndex', access);
      }
    },
    [headerRefData],
  );

  if (!tabInfo || !userData || !tabsInfo) {
    return null;
  }

  return (
    <>
      {tabsInfo?.map((item, index) => {
        return (
          <div key={index}>
            <h2>
              <CollapseButton
                collapse={tabCollapse[index]}
                onClick={() => {
                  toggleChannelCollapse(index);
                }}
              >
                <i
                  className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                  data-qa="channel-section-collapse"
                  aria-hidden="true"
                />
              </CollapseButton>
              <span>{item.tab_name}</span>
            </h2>
            <div>
              {!tabCollapse[index] &&
                tabInfo?.map((item2, index2) => {
                  if (item.tab_id === item2.tab_id) {
                    return (
                      // <div key={index}>{item.host}</div>
                      <TabCategory key={item2.info_id} onClick={onClickActive}>
                        <span tabIndex={index} accessKey={String(item2.tab_id)}>
                          {item2.host}
                        </span>
                      </TabCategory>
                      /* <NavLink key={item2.info_id} to={`/${userData?.nickname}`}>
                          <span>{item2.host}</span>
                        </NavLink> */
                    );
                  }
                })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default HostList;
