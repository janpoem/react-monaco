import { css } from '@emotion/css';
import type { CSSProperties } from 'react';

/******************************************************************************
 * 总体
 ******************************************************************************/

export type PresetStyleVars = {
  '--rmBackdropBg': CSSProperties['backgroundColor'];
  '--rmBackdropZIndex': CSSProperties['zIndex'];
  '--rmGap': CSSProperties['gap'];
  '--rmBorderColor': CSSProperties['borderColor'];
};

export const presetStyleVars = (
  mixin?: Partial<PresetStyleVars & CSSProperties>,
): PresetStyleVars & CSSProperties => ({
  '--rmBackdropBg': 'rgba(255, 255, 255)',
  '--rmBackdropZIndex': 1000,
  '--rmGap': '0.5em',
  '--rmBorderColor': 'rgba(0, 0, 0, 0.16)',
  ...mixin,
});

export const presetCls = {
  container: 'MonacoContainer',
  errContainer: 'MonacoErr',
  errDisplay: 'MonacoErrDisplay',
  errScope: 'MonacoErrScope',
  errMsg: 'MonacoErrMsg',
  loaderContainer: 'MonacoLoader',
  loaderBox: 'MonacoLoaderBox',
  loaderText: 'MonacoLoaderText',
  progressBar: 'MonacoProgressBar',
  codeEditor: 'MonacoCodeEditor',
} as const;

/******************************************************************************
 * 公共部分
 ******************************************************************************/

export const cssVerticalContainer = (mixin: CSSProperties = {}) =>
  css({
    ...mixin,
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
  });

export const cssDisableScroll = css`
  height: 0;
  overflow: hidden;
`;

export const styleFlexCC: CSSProperties = {
  justifyContent: 'center',
  alignItems: 'center',
};

/******************************************************************************
 * ErrorDisplay 部分
 ******************************************************************************/

export const cssErrDisplay = css`
  max-width: 480px;
  min-width: 320px;
  flex: 0 0 auto;
  gap: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5em;
  border: 1px solid var(--rmBorderColor);
  padding: 1em;
  box-shadow: var(--rmBorderColor) 0px 1px 4px;
`;

export const cssErrScope = css`
  font-weight: 600;
  opacity: 0.85;
  &:after {
    content: '';
    border-right: 1px solid var(--rmBorderColor);
    padding-left: 1em;
  }
`;

export const cssErrMessage = css`
  font-size: 0.95em;
  word-wrap: break-word;
`;

/******************************************************************************
 * Loader 部分
 ******************************************************************************/

export const styleLoaderContainer: CSSProperties = {
  ...styleFlexCC,
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'var(--rmBackdropBg, #fff)',
  zIndex: 'var(--rmBackdropZIndex, 1000)',
};

export const cssLoaderBox = (dir: 'row' | 'column') =>
  css({
    ...styleFlexCC,
    display: 'flex',
    flexDirection: dir,
    gap: 'var(--rmGap)',
  });
