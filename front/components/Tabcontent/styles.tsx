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
`;

export const DarkBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
`;

export const DialogBlock = styled.div`
  width: 320px;
  padding: 1.5rem;
  background: white;
  border-radius: 2px;
  & h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  & p {
    font-size: 1.125rem;
    margin-bottom: 5px;
  }

  & input {
    height: 25px;
  }
`;

export const ButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
`;

export const Button = styled.button`
  height: 2.5rem;
  fontsize: 1.25rem;
  color: white;
  outline: none;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-left: 10px;
`;

export const Error = styled.div`
  color: #e01e5a;
  margin: 8px 0 16px;
  font-weight: bold;
`;
