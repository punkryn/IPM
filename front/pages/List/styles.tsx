import styled from '@emotion/styled';

export const Tab = styled.div`
  width: 100%;
`;

export const Tabnav = styled.ul`
  margin: 0px;
  padding: 0px;
  list-style: none;

  & li {
    background: none;
    color: #222;
    display: inline-block;
    padding: 10px 15px;
    cursor: pointer;
    height: 64px;
  }

  & li.active {
    background: #ededed;
    color: #222;
  }
`;

export const Tabcontent = styled.div`
  background: #ededed;
  padding: 15px;

  & div {
    display: none;
  }

  & div.active {
    display: inherit;
    height: 100%;
  }
`;
