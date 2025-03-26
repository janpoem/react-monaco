import { notEmptyStr } from '@zenstone/ts-utils/string';
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

export type PresetComponents = Record<string, PresetComponent>;

export type PresetText = string;

// biome-ignore lint/suspicious/noExplicitAny: Here allow any
export type PresetTextCallback<Params = any> = (params: Params) => string;

export type PresetTexts = Record<
  string | number,
  PresetText | PresetTextCallback
>;

export type PresetProviderProps<
  C extends PresetComponents,
  T extends PresetTexts,
> = {
  // init* 为初始输入值，必须是全量
  initComponents: C | (() => C);
  initTexts: T | (() => T);
  // 以下为动态输入，可以是片段，部分
  components?: Partial<C>;
  texts?: Partial<T>;
};

type TextsParams<T> = T extends PresetTextCallback<infer P> ? P : unknown;

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
  const componentsRef = useRef(
    typeof initComponents === 'function' ? initComponents() : initComponents,
  );
  // componentsRef.current = initComponents;

  const textsRef = useRef(
    typeof initTexts === 'function' ? initTexts() : initTexts,
  );
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
    <Key extends keyof T, Params extends TextsParams<T[Key]>>(
      key: Key,
      // @ts-ignore
      params: Params = {},
    ): string => {
      const it = texts[key] || textsRef.current[key];
      if (it == null) return `${key as string}`;
      if (typeof it === 'function') {
        return it(params);
      }
      return it;
    },
    [texts],
  );

  const selectText = useCallback(
    <Key extends keyof T, Params extends TextsParams<T[Key]>>(
      text: string | null | undefined,
      key: Key,
      // @ts-ignore
      params: Params = {},
    ) => {
      if (notEmptyStr(text)) return text;
      return getText(key, params);
    },
    [getText],
  );

  return {
    getComponent,
    makeChildren,
    getText,
    selectText,
  };
};

export type PresetContext<
  C extends PresetComponents = PresetComponents,
  T extends PresetTexts = PresetTexts,
> = ReturnType<typeof usePresetProviderInit<C, T>>;

const Context = createContext<PresetContext>({
  getComponent: () => void 0,
  makeChildren: () => null,
  getText: () => '',
  selectText: () => '',
});

export const PresetProvider = <
  C extends PresetComponents = PresetComponents,
  T extends PresetTexts = PresetTexts,
>({
  preset,
  children,
}: {
  preset: PresetContext<C, T>;
  children: ReactNode;
}) => {
  // @ts-ignore
  return <Context.Provider value={preset}>{children}</Context.Provider>;
};

export const usePresetProvider = <
  C extends PresetComponents = PresetComponents,
  T extends PresetTexts = PresetTexts,
  // @ts-ignore
>() => useContext<PresetContext<C, T>>(Context);
