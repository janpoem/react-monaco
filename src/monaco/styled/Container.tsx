import { css } from '@emotion/css';
import styled from '@emotion/styled';
import type { CSSProperties } from 'react';

export type ContainerProps = {
  justifyContent?: CSSProperties['justifyContent'];
  alignItems?: CSSProperties['alignItems'];
  flex?: CSSProperties['flex'];
  gap?: CSSProperties['gap'];
  fluid?: boolean;
};

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  ${({ justifyContent, alignItems, flex, fluid, gap }) => ({
    justifyContent,
    alignItems,
    gap,
    flex: flex ? flex : fluid ? '1 1 auto' : undefined,
  })};
`;

export const cssDisableScroll = css`
  height: 0;
  overflow: hidden;
`;
