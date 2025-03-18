import { css } from '@emotion/css';
import { errMsg } from '@zenstone/ts-utils/error';
import { useMemo, useRef } from 'react';
import { compare } from 'use-the-loader';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { usePresetTexts } from '../../preset-provider';
import { Container } from '../styled';
import {
  MonacoPresetError,
  type MonacoPresetErrorInfoProps,
  type MonacoPresetTexts,
} from '../types';

const PresetErrorInfo = ({
  scope,
  error,
  withContainer,
  defaultText: iDefaultText,
  className,
}: MonacoPresetErrorInfoProps) => {
  const errorRef = useRef<unknown>(undefined);
  const text = usePresetTexts<MonacoPresetTexts>();
  const defaultText = useMemo(
    () => iDefaultText || text(MonacoPresetError.UNKNOWN),
    [text, iDefaultText],
  );

  const children = (
    <Container gap={'0.5em'} className={css`max-width: 480px;`}>
      {scope && <strong>{scope}</strong>}
      {errMsg(error) || defaultText}
    </Container>
  );

  useIsomorphicLayoutEffect(() => {
    if (!compare(errorRef.current, error)) {
      errorRef.current = error;
      console.warn(error);
    }
  }, [error]);

  if (!withContainer) {
    return <>{children}</>;
  }

  return (
    <Container
      fluid
      justifyContent={'center'}
      alignItems={'center'}
      className={className}
    >
      {children}
    </Container>
  );
};

export default PresetErrorInfo;
