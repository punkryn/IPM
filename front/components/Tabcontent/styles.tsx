import styled from '@emotion/styled';

export const Remove = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dee2e6;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #ff6b6b;
  }
`;

export const Content = styled.table`
  background: #ffffff;
  padding: 15px;
  text-align: left;
  overflow: auto;
  flex: 1;

  & th {
    border-bottom: 1px solid black;
    padding: 0;
  }

  // & div {
  //   display: none;
  // }

  // & div.active {
  //   display: inherit;
  //   height: 100%;
  // }
`;
