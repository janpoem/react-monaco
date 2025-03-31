# 开发说明

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
