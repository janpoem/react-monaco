import {
  type ComponentProps,
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
} from 'react';
import type { PresetComponents, PresetTexts } from '../types';
import ErrorInfo from './ErrorInfo';
import Loader from './Loader';

// @ts-ignore
const presetComponents: PresetComponents = {
  Loader,
  ErrorInfo,
};

export type PresetContext = ReturnType<typeof usePresetProviderInit>;

// @ts-ignore
const Context = createContext<PresetContext>({});

export type PresetProviderProps = {
  components?: Partial<PresetComponents>;
  texts?: Partial<PresetTexts>;
};

export const PresetProvider = ({
  children,
  ...props
}: PresetProviderProps & { children: ReactNode }) => (
  <Context.Provider value={usePresetProviderInit(props)}>
    {children}
  </Context.Provider>
);

export const usePresetProviderInit = ({
  components = {},
}: PresetProviderProps) => {
  const getComponent = useCallback(
    <N extends keyof PresetComponents>(
      name: N,
    ): PresetComponents[N] | undefined => {
      if (components[name] != null) return components[name];
      if (presetComponents[name] != null) return presetComponents[name];
      return undefined;
    },
    [components],
  );

  const makeChildren = useCallback(
    <N extends keyof PresetComponents>(
      name: N,
      props: ComponentProps<PresetComponents[N]>,
    ): ReactNode | null => {
      const component = getComponent(name);
      if (component == null) return null;
      // @ts-ignore
      return createElement(component, props);
    },
    [getComponent],
  );

  return {
    getComponent,
    makeChildren,
  };
};

export const usePresetContext = () => useContext(Context);
