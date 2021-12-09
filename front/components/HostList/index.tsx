import { IInfo, ITabInfo, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import tabFetcher from '@utils/tabFetcher';
import React, { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';
import { CollapseButton } from './styles';

const HostList: FC = () => {
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
    userData ? `/api/tabas/info/${nickname}` : null,
    tabFetcher,
  );
  const [tabCollapse, setTabCollapse] = useState(false);

  console.log(tabsInfo); // <<< 여기부터
  const toggleChannelCollapse = useCallback(() => {
    setTabCollapse((prev) => !prev);
  }, []);

  if (!tabInfo || !userData || !tabsInfo) {
    console.log(tabInfo);
    return null;
  }

  return (
    <>
      {tabsInfo?.map((item, index) => {
        return (
          <>
            <h2>
              <CollapseButton collapse={tabCollapse} onClick={toggleChannelCollapse}>
                <i
                  className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                  data-qa="channel-section-collapse"
                  aria-hidden="true"
                />
              </CollapseButton>
              <span>{item.tab_name}</span>
            </h2>
            <div>
              {!tabCollapse &&
                tabInfo?.map((item2, index) => {
                  if (item.tab_name === item2.tab_name) {
                    return (
                      // <div key={index}>{item.host}</div>
                      <NavLink key={item2.tab_id} to={`/${userData?.nickname}`}>
                        <span>{item2.host}</span>
                      </NavLink>
                    );
                  }
                })}
            </div>
          </>
        );
      })}
    </>
  );
};

export default HostList;
