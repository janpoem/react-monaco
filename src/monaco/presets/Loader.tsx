import { createElement, useMemo } from 'react';
import { usePresetTexts } from '../../preset-provider';
import { Container } from '../styled';
import {
  MonacoPreloadState,
  type MonacoPresetLoaderProps,
  type MonacoPresetTexts,
} from '../types';

const PresetLoader = ({
  process,
  percent,
  isFetchDownload,
  withContainer,
  defaultText: iDefaultText,
  className,
  render,
}: MonacoPresetLoaderProps) => {
  const text = usePresetTexts<MonacoPresetTexts>();
  const defaultText = useMemo(
    () => iDefaultText || text('Initializing'),
    [text, iDefaultText],
  );

  const children = useMemo(() => {
    return render != null ? (
      createElement(render, {
        process,
        percent,
        isFetchDownload,
        withContainer,
        defaultText,
      })
    ) : (
      <>
        {process == null
          ? defaultText
          : process.state === MonacoPreloadState.Download
            ? text('Downloading', { isFetchDownload, percent })
            : text('Preparing')}
        <progress
          max={100}
          value={
            isFetchDownload && process?.state === MonacoPreloadState.Download
              ? percent
              : undefined
          }
          style={{ width: 250 }}
        />
      </>
    );
  }, [
    process,
    percent,
    isFetchDownload,
    withContainer,
    defaultText,
    render,
    text,
  ]);

  if (!withContainer) {
    return <>{children}</>;
  }

  return (
    <Container
      fluid
      justifyContent={'center'}
      alignItems={'center'}
      gap={'0.5em'}
      className={className}
    >
      {children}
    </Container>
  );
};

export default PresetLoader;
