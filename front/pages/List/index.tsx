import Workspace from '@layouts/Workspace';
import React from 'react';
import { Tab, Tabcontent, Tabnav } from './styles';

const List = () => {
  return (
    <Workspace>
      <Tab>
        <Tabnav>
          <li>
            <span>tab1</span>
          </li>
          <li className="active">
            <span>tab2</span>
          </li>
        </Tabnav>
        <Tabcontent>
          <div className="active">content1</div>
          <div>content2</div>
        </Tabcontent>
      </Tab>
    </Workspace>
  );
};

export default List;
