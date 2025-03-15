import { createElement, useMemo } from 'react';
import { Container } from '../styled';
import { MonacoPreloadState, type PresetLoaderProps } from '../types';

const PresetLoader = ({
  process,
  percent,
  isFetchDownload,
  withContainer,
  defaultText = 'Initializing...',
  className,
  render,
}: PresetLoaderProps) => {
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
            ? `Downloading${isFetchDownload ? ` ${percent}%` : ''}...`
            : 'Preparing...'}
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
  }, [process, percent, isFetchDownload, withContainer, defaultText, render]);

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
