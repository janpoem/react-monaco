import { Container } from '../styled';
import { MonacoPreloadState, type PresetLoaderProps } from '../types';

const PresetLoader = ({
  process,
  percent,
  isFetchDownload,
  withContainer,
  defaultText = 'Initializing...',
  className,
}: PresetLoaderProps) => {
  const children = (
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
