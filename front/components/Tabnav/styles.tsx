import styled from '@emotion/styled';

export const Remove = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  // color: #dee2e6;
  color: transparent;
  font-size: 24px;
  cursor: pointer;
  // &:hover {
  //   color: #ff6b6b;
  // }
  display: initial;
`;

export const Nav = styled.ul`
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

  & li:hover {
    ${Remove} {
      display: initial;
      color: #dee2e6;
      &:hover {
        color: #ff6b6b;
      }
    }
  }

  & li.active {
    background: #ededed;
    color: #222;
  }
`;

export const AddButton = styled.button`
  color: black;
  font-size: 24px;
  display: inline-block;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
`;
