# 开发说明

## 开发环境

目前使用 bun 作为开发环境，上手请先安装好 bun
的基础环境，请参考 [Bun Installation](https://bun.sh/docs/installation)。

然后，在项目根目录执行：

```bash
bun i
```

第一获取该项目，所有子项目皆未包含 `dist` ，无法启动 `demo` 项目，请现在根目录里执行：

```bash
bun build
```

如果你希望 watch 每一个子项目（每个子项目都要改点东西），可使用：

```bash
bun dev
```

`bun build` 会去删除已存在的 `dist` 目录，重新构建新的代码。`bun dev` 则不会去删除，只管构建。

然后，进入 `packages/demo` 目录，执行 `bun dev` ，即可开启本地开发模式。

### watch 个别子项目修改

首先，确保全部子项目已经 `build` 过一次，相应的 `dist` 目录已存在。

> 如果开启了根目录的 `dev` ，请先停止。

其次，进入某个你要调试的子项目，比如 `packages/plugin-textmate`，在该目录下执行
`bun dev` 即可只 watch 这个子项目的代码改动。

最后，重启 `packages/demo` （非必须，但如发现 dist 更新未生效，则最好重启一次）。

### rollup 构建

目前子项目构建，都使用 rollup 进行。

目前皆依托于 `rollup-plugin-swc3` `rollup-plugin-dts` 进行处理。


## 引入 monaco-editor

虽然实现了对 monaco 的封装，但实际开发中，仍需要引入 monaco 的类型。

在你项目中，添加 `monaco-editor` 到 `devDependencies`。

```bash
bun add monaco-editor -D
# or
npm install monaco-editor --save-dev
```

在你项目中的 `env.d.ts` or `global.d.ts`
，或任意的类型声明文件中（如：[plugin-textmate/types.ts](packages/plugin-textmate/src/types.ts)
），添加如下代码：

```ts
/// <reference types="monaco-editor/monaco.d.ts" />
```

则此时你的 TS 项目，将能够正确识别 monaco 的类型，诸如：

```ts
// 此时无需额外再引入 monaco-editor
export type TextmateCodeSet = {
  isWired: boolean;
  extname?: string;
  language?: monaco.languages.ILanguageExtensionPoint;
  languageId: string;
  provider?: TextmateProvider;
} & TextmateScope;

const monacoRef = useRef<typeof monaco>(null);
```

有部分 monaco 的实体类，仍然需要导入，请注意使用 `type` 方式导入，比如：

```ts
import type { Position } from 'monaco-editor';

type LastEditorState = {
  position: Position;
}
```

### MonacoLocales

正常情况，不必关注这个全局变量，但如果你明确需要访问，可在类型定义文件添加如下：

```ts
declare global {
  interface Window {
    MonacoLocales?: Record<string, unknown> | undefined;
  }
}
```

如：[plugin-locale/types.ts](../packages/plugin-locale/src/types.ts)

## 扩展 presets

目前有几个类型，是预留了外部扩展的空间的，诸如 `MonacoTexts` `MonacoComponents`
`MonacoRepos`

可使用 `declare` 对类型扩展：

```tsx
import type { _PresetTextCallback, _PresetText } from '@react-monaco/core';

declare module '@react-monaco/core' {
  interface MonacoTexts {
    hello: _PresetText;
    tmStatus: _PresetTextCallback<{ active: boolean }>;
  }
}

<MonacoProvider
  texts={{
    hello: '你好',
    tmStatus: ({ active }) =>
      `Textmate ${active ? 'active' : 'inactive'}`,
  }}
>
  {/* children */}
</MonacoProvider>;
```

特别注意，MonacoTexts 的函数式传参，请默认视为 `Partial<Params extends object>`
的形式，即可以明确传入的一定是一个 object 结构体，但里面的具体值无法保证。


## emotion.js 的使用

目前仅在 `@react-monaco/core` 中最小程度的使用 `@emotion/css` 。

其实只使用 `@emotion/css` 即可在最小范围内，得到 styles 转 className 和 css in js
的机能，且无需额外打包出 css 文件，非常利于组件库开发（反而 styled 组件并不是最迫切的需求）。

目前未对这部分进行处理，`dist` 直接保留 import `@emotion/css` ，由其到实际应用环境，在进行最终打包、编译处理。

本来是想用 `linaria` ，但 `linaria` 默认使用 `babel` 进行处理，他的 rollup 插件和 swc 有冲突。

目前实际上 `linaria` 和 `@emotion` 的样式声明、styled 组件，都是可以互通的，只是 import 包名不同而已（2024
年改某个 canvas grid 时，已经处理过类似的场景）。
