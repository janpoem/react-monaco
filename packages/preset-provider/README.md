# @zenstone/preset-provider

A React preset environment context provider. Mainly provides overload
interception for Components and Texts.

一个 React 预定义环境上下文供给器，主要提供 Components 和 Texts 的重载拦截。

主要为组件库开发，对内提供预定义的组件环境，对外提供一套简单可行的重载（overload）机制。

React 组件一般有两种形态的组件：**UI 组件** 和 **逻辑组件**。

很多时候我们针对某个需求，开发一套组件库解决方案，必然需要内置上述两种的组件。

一般而言，简单的 **UI 组件** 可以利用 CSS 的机制实现外貌的改变。

但是我们很难去替代组件内置的逻辑，尤其当我们明确知道某个组件库里的某个组件明确有问题，但是我们很难再不
patch npm 的条件下（或者 path rewrite），去重载这个组件。

本来，按照 JSX 这种 DSL，理论上应该可以提供 `createElement`
的拦截器，即在创建特定组件时，根据我们配置去重载另一个实现。

但这又受限于 `createElement` 时的组件，是具体的一个函数，理论上，基于 WeakMap
依然还是能实现的，不过似乎这么多年，这方面都没有什么动静。

`@zenstone/preset-provider` 旨在用一层很薄的逻辑，实现有限上下文内的文本/组件重载。

文本的重载，主要针对多语言、特定文本内容（如格式化）等文本使用场合。支持纯文本声明和函数式声明，函数式声明支持函数参数推断。

组件的重载，如上述，React 有两种形态：**UI 组件** 和 **逻辑组件**，其威力真正在于对
**逻辑组件** 的重载。

`@zenstone/preset-provider` 内部实现甚至没有用一丝 state
，只有几个函数接口，可以放心使用。不过对于泛型的理解和使用，就比较考验耐性了。

## 示例代码

```tsx
import {
  PresetProvider,
  type PresetTextCallback,
  usePresetProvider,
  usePresetProviderInit,
} from '@zenstone/preset-provider';
import type { ComponentType, ReactNode } from 'react';

// 定义一个预定义组件类型
type AnythingComponents = {
  Hello: ComponentType<{ message: string }>;
  Test: ComponentType;
};

// 定义一个预定义文本类型
type AnythingTexts = {
  hello: PresetTextCallback<{ message: string }>;
};

// 实现预订组件
const initComponents = (): AnythingComponents => ({
  Hello: (props) => {
    const { getText } = usePresetProvider<AnythingComponents, AnythingTexts>();
    return <div>{getText('hello', props)}</div>;
  },
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
  const { makeChildren } = usePresetProvider<
    AnythingComponents,
    AnythingTexts
  >();

  return (
    <>
      {makeChildren('Hello', props)}
      {makeChildren('Test', props)}
    </>
  );
};

export const Test = () => {
  return (
    <AnythingProvider
      components={{ Test: () => <div>Overload Test</div> }}
      texts={{ hello: ({ message }) => `你好，${message}`, }}
    >
      <Sample message={'咋滴啦'}/>
    </AnythingProvider>
  );
};
```

一般而言，`PresetProvider` 主要用于组件库内部去使用，以提供一套默认预定义的组件环境，同时提供给外部
overload 的可能性。

`usePresetProvider` 使用需要频繁指定泛型，比较麻烦，推荐在实际环境进行扩展，如下：

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

// 以下代码，没有做任何实际的逻辑实现
// 主要用于将泛型做一个绑定，并为你的组件库内部的活化使用

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
