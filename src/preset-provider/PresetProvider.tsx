import {
  type ComponentProps,
  type ComponentType,
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
} from 'react';

// biome-ignore lint/suspicious/noExplicitAny: Here allow any
export type PresetComponent<Props = any> = ComponentType<Props>;

export type PresetComponents = {
  [key: string]: PresetComponent;
};

// biome-ignore lint/suspicious/noExplicitAny: Here allow any
export type PresetText<Params = any> = string | PresetTextCallback<Params>;

// biome-ignore lint/suspicious/noExplicitAny: Here allow any
export type PresetTextCallback<Params = any> = (params?: Params) => string;

export type PresetTexts = {
  [key: PropertyKey]: PresetText;
};

export type PresetProviderProps<
  C extends PresetComponents,
  T extends PresetTexts,
> = {
  // init* 为初始输入值，必须是全量
  initComponents: C;
  initTexts: T;
  // 以下为动态输入，可以是片段，部分
  components?: Partial<C>;
  texts?: Partial<T>;
};

export const usePresetProviderInit = <
  C extends PresetComponents,
  T extends PresetTexts,
>({
  initComponents,
  initTexts,
  components = {},
  texts = {},
}: PresetProviderProps<C, T>) => {
  // 这两个，只在初始化时绑定一次，以后不会再动态更新
  const componentsRef = useRef(initComponents);
  // componentsRef.current = initComponents;

  const textsRef = useRef(initTexts);
  // textsRef.current = initTexts;

  const getComponent = useCallback(
    <N extends keyof C>(name: N): C[N] | undefined => {
      if (components[name] != null) return components[name];
      if (componentsRef.current[name] != null)
        return componentsRef.current[name];
      return undefined;
    },
    [components],
  );

  const makeChildren = useCallback(
    <N extends keyof C>(
      name: N,
      props: ComponentProps<C[N]>,
    ): ReactNode | null => {
      const component = getComponent(name);
      if (component == null) return null;
      return createElement(component, props);
    },
    [getComponent],
  );

  const getText = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    <Params = any>(key: string, params?: Params): string => {
      const it = texts[key] || textsRef.current[key];
      if (it == null) return key;
      if (typeof it === 'function') {
        return it(params);
      }
      return it;
    },
    [texts],
  );

  return {
    getComponent,
    getText,
    makeChildren,
  };
};

export type PresetContext<
  C extends PresetComponents,
  T extends PresetTexts,
> = ReturnType<typeof usePresetProviderInit<C, T>>;

// @ts-ignore
const Context = createContext<PresetContext>({});

export const PresetProvider = <
  C extends PresetComponents,
  T extends PresetTexts,
>({
  preset,
  children,
}: { preset: PresetContext<C, T>; children?: ReactNode }) => {
  return <Context.Provider value={preset}>{children}</Context.Provider>;
};

export const usePresetProvider = <
  C extends PresetComponents = PresetComponents,
  T extends PresetTexts = PresetTexts,
>() => useContext<PresetContext<C, T>>(Context);

export const usePresetComponents = <
  C extends PresetComponents = PresetComponents,
>() => usePresetProvider<C>().getComponent;

export const usePresetCreateElement = <
  C extends PresetComponents = PresetComponents,
>() => usePresetProvider<C>().makeChildren;

export const usePresetTexts = <T extends PresetTexts = PresetTexts>() =>
  usePresetProvider<PresetComponents, T>().getText;
