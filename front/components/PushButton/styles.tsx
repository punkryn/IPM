import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const CircleButton = styled.button<{ open: boolean }>`
  background: #38d9a9;
  &:hover {
    background: #63e6be;
  }
  &:active {
    background: #20c997;
  }

  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  border: none;
  outline: none;
  left: 50%;
  bottom: 0%;

  color: white;
  width: 80px;
  height: 80px;
  font-size: 60px;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.84);

  transition: 0.125s all ease-in;

  ${(props) =>
    props.open &&
    css`
      background: #ff6b6b;
      &:hover {
        background: #ff8787;
      }
      &:active {
        background: #fa5252;
      }
      transform: translate(-50%, 50%) rotate(45deg);
    `}
`;

export const InsertFormPositioner = styled.div`
  width: 100%;
  bottom: 0;
  left: 0;
  position: absolute;
`;

export const InsertForm = styled.form`
  background: #f8f9fa;
  padding-left: 32px;
  padding-top: 32px;
  padding-right: 32px;
  padding-bottom: 72px;

  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-top: 1px solid #e9ecef;
`;

export const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  width: 100%;
  outline: none;
  font-size: 18px;
  box-sizing: border-box;
`;
