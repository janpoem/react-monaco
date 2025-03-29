# @zenstone/preset-provider

A React preset environment context provider. Mainly provides overload
interception for Components and Texts.

一个 React 预定义环境上下文供给器，主要提供 Components 和 Texts 的重载拦截。

`@zenstone/preset-provider` 主要为组件库开发，对内提供预定义的组件环境，对外提供一套简单可行的重载（overload）机制。

## 示例代码

```tsx
import {
  PresetProvider,
  type PresetTextCallback,
  usePresetProvider,
  usePresetProviderInit,
} from '@zenstone/preset-provider';
import {
  type ComponentProps,
  type ComponentType,
  type ReactNode,
  useMemo,
} from 'react';

// 定义一个预定义组件类型
type AnythingComponents = {
  Hello: ComponentType<{ message: string }>;
  Test: ComponentType;
};

// 定义一个预定义文本类型
type AnythingTexts = {
  hello: PresetTextCallback<{ message: string }>;
};

// 以下代码 主要用于将泛型做一个绑定
export const useAnythingPreset = usePresetProvider<
  AnythingComponents,
  AnythingTexts
>;

type TextsParams<T> = T extends PresetTextCallback<infer P> ? P : unknown;

export const useAnythingText = <
  Key extends keyof AnythingTexts,
  Params extends TextsParams<AnythingTexts[Key]>,
>(
  key: Key,
  // @ts-ignore
  params: Params = {},
) => {
  const text = useAnythingPreset().getText<Key, Params>;
  return useMemo(() => text(key, params), [text, key, params]);
};

export const useAnythingCreateElement = <Name extends keyof AnythingComponents>(
  name: Name,
  props: ComponentProps<AnythingComponents[Name]>,
) => {
  const create = useAnythingPreset().makeChildren<Name>;
  return useMemo(() => create(name, props), [create, name, props]);
};

// 实现预订组件
const initComponents = (): AnythingComponents => ({
  Hello: (props) => <div>{useAnythingText('hello', props)}</div>,
  Test: () => <div>in test</div>,
});

// 实现预订文本
const initTexts = (): AnythingTexts => ({
  hello: ({ message }) => `hello, ${message}`,
});

export type AnythingProviderProps = {
  components?: Partial<AnythingComponents>;
  texts?: Partial<AnythingTexts>;
  children?: ReactNode;
};

// 基础示例
const AnythingProvider = ({
  components,
  texts,
  children,
}: AnythingProviderProps) => {
  const preset = usePresetProviderInit({
    initComponents,
    initTexts,
    components,
    texts,
  });

  return <PresetProvider preset={preset}>{children}</PresetProvider>;
};

const Sample = (props: { message: string }) => {
  return (
    <>
      {useAnythingCreateElement('Hello', props)}
      {useAnythingCreateElement('Test', props)}
    </>
  );
};

export const Test = () => {
  return (
    <AnythingProvider
      components={{ Test: () => <div>Overload Test</div> }}
      texts={{ hello: ({ message }) => `你好，${message}` }}
    >
      <Sample message={'咋滴啦'}/>
    </AnythingProvider>
  );
};
```
