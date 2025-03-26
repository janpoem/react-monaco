# @react-monaco/plugin-textmate

Textmate injection plugin for react monaco editor.

React Monaco Editor Textmate 运行时注入插件。

## 使用说明

```tsx
import { TextmateInjection } from '@react-monaco/plugin-textmate';

// 确保在 MonacoProvider 上下文包裹内
<MonacoProvider>
  <TextmateInjection/>
</MonacoProvider>
```

## 类型说明

```ts
type TextmateInjectionProps = {
  // wasm url ，可选，内定为：https://cdn.jsdelivr.net/npm/onigasm-umd@2.2.5/release/onigasm.wasm
  onigasmWasmUrl?: string | URL;
  // wasm umd js，暂时用不上，需要观察，内定为：https://cdn.jsdelivr.net/npm/onigasm-umd@2.2.5/release/main.min.js
  // wasm 加载，存在一个全局变量无法覆盖的问题，只能靠通过 umd 引入的机制来覆盖对应的全局变量，需要更长时间来观察稳定性
  onigasmJsUrl?: string | URL;
  // tm language 供给器，实现自定义的 tm 文法分析，优先级高于内定的 tm
  provider?: TextmateProviderCallback;
  // tm base url ，可选，内定为：https://static.summererp.com/misc/monaco-editor/tm/
  tmBaseUrl?: string | URL;
  // 当 monaco editor 每次创建 model 时都会触发，用于对外输出当前 tm 是否被激活
  onChange?: (state: TextmateActiveLanguage) => void;
};

export type TextmateProvider = {
  url: string | URL;
  format: 'json' | 'plist';
  languageId: string;
};

export type TextmateProviderCallback = (
  params: MonacoEventsDefinition['prepareModel'],
) => TextmateProvider | undefined;

export type TextmateActiveLanguage = {
  isActive: boolean;
  languageId: string;
  extname?: string;
  timestamp: number;
};
```

## tm language 供给器使用例子

```tsx
import {
  TextmateInjection,
  type TextmateProviderCallback,
  tmBaseUrlDefault,
} from '@react-monaco/plugin-textmate';

// 确保在 MonacoProvider 上下文包裹内
<MonacoProvider>
  <TextmateInjection provider={customTextmateProvider}/>
</MonacoProvider>;

const customTextmateProvider: TextmateProviderCallback = ({ extname }) => {
  if (extname === '.prisma') {
    return {
      url: new URL('prisma.tmLanguage.json', tmBaseUrlDefault),
      format: 'json',
      languageId: 'prisma',
    };
  }
};
```

## monaco 未支持的语言的处理

如上例，prisma 不是 monaco 内定的语言，目前的做法，先根据文件后缀名，如 `.prisma`
，基于后缀名（去掉 `.` 前缀），向 monaco editor 注册该语言。

如果有自定义供给器（如上例），则根据此来提供文法解析。
