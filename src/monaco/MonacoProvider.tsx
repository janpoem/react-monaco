import { type ReactNode } from 'react';
import { Provider } from './_context';
import { AssetsLoader, ErrorDisplay } from './components';
import { useMonacoProviderInit } from './hooks';
import { PresetProvider } from './presets';
import { Container } from './styled';
import type { MonacoProviderProps } from './types';

const scope = 'MonacoProvider';

export const MonacoProvider = ({
  children,
  components,
  texts,
  ...props
}: MonacoProviderProps & { children?: ReactNode }) => {
  const hook = useMonacoProviderInit(props);
  const {
    isCompressed,
    isFetchDownload,
    error,
    setError,
    shouldPreload,
    preloadAssets,
    handlePreload,
  } = hook;

  return (
    <PresetProvider components={components} texts={texts}>
      <Provider value={hook}>
        <Container fluid>
          <ErrorDisplay scope={scope} error={error} withContainer>
            <AssetsLoader
              assets={preloadAssets}
              shouldPreload={shouldPreload}
              isCompressed={isCompressed}
              isFetchDownload={isFetchDownload}
              onError={setError}
              onLoad={handlePreload}
              withContainer
            >
              {children}
            </AssetsLoader>
          </ErrorDisplay>
        </Container>
      </Provider>
    </PresetProvider>
  );
};
