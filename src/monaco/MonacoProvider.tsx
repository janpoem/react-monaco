import type { ReactNode } from 'react';
import { PresetProvider } from '../preset-provider';
import { Provider } from './_context';
import { AssetsLoader, ErrorDisplay } from './components';
import { useMonacoProviderInit } from './hooks';
import { Container } from './styled';
import type {
  MonacoPresetComponents,
  MonacoPresetTexts,
  MonacoProviderProps,
} from './types';

const scope = 'MonacoProvider';

export const MonacoProvider = <
  C extends MonacoPresetComponents = MonacoPresetComponents,
  T extends MonacoPresetTexts = MonacoPresetTexts,
>({
  children,
  injections,
  ...props
}: MonacoProviderProps<C, T> & {
  children?: ReactNode;
  injections?: ReactNode;
}) => {
  const hook = useMonacoProviderInit<C, T>(props);
  const {
    preset,
    isCompressed,
    isFetchDownload,
    error,
    setError,
    shouldPreload,
    preloadAssets,
    handlePreload,
  } = hook;

  return (
    <PresetProvider preset={preset}>
      <Provider value={hook}>
        <Container fluid>
          {injections}
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
