# @react-monaco/plugin-textmate

Textmate injection plugin for react monaco editor.

React Monaco Editor Textmate 运行时注入插件。

## 实现库切换至 `vscode-textmate`

鉴于 `monaco-editor-textmate`、`monaco-textmate` 皆日久失修（`monaco-textmate` 已经是
7 年前的，而实际上他也是 fork 自 `vscode-textmate`）。

不过还是再次感谢 [Neek Sandhu](https://github.com/zikaari) ，他的高亮比 `vscode-textmate`
要准（比如 scss，主要是 theme 也是反向导入进来的，所以不可能和 vscode theme 100%
对得上）。

`monaco-textmate` 最大的问题是他默认使用 `node:path` ，这使的给 web
打包的时候特别麻烦：[issue: Getting a build warning regarding path usage](https://github.com/zikaari/monaco-textmate/issues/11) 。

我试着 fork 他的代码到本地，但基于 typescript 2.0.8
，语法和现在的差异太多，要修复的工作量太多。而且编译后的版本，怎么都会报错。也缺少对应的单元测试代码，没办法确定修改的内容有没有造成其他的影响和破坏。

所以我把 `vscode-textmate` 拉到本地，进行了一番本地编译和调试，发现
`vscode-textmate` 现版本是可以无缝接入到 monaco 的（这不是废话么）。

目前已经完整接入到 `vscode-textmate` 和 `vscode-oniguruma` 。

### 特别注意

1. `vscode-textmate` 对 `scopeName` 的检查，更加严格了。

   必须与 tmLanguage 声明文件中的 scopeName
   保持一致，比如：[vscode/scss.tmLanguage.json](https://github.com/microsoft/vscode/blob/main/extensions/scss/syntaxes/scss.tmLanguage.json)

   这个文件里的 `"scopeName": "source.css.scss"` 所以 scopeName 也必须是
   `source.css.scss` ，不然就会无法找到对应的匹配。

   所以除了在 `provider` 实现函数的返回结果增加了可选的 `scopeName` 外，也额外增加一个
   `filter` 方法，用于最后拦截构成 loadGrammar 的必要代码集。

2. 再补充，理论上是支持 plist 的（但我实际测试好几个 plist 效果都不好），
   `vscode-textmate` 根据文件名（URL）后缀自动做了检查。

## 使用说明

```tsx
import {
  TextmateInjection,
  type TextmateProviderCallback,
  type TextmateFilterCodeSetCallback,
  type TextmateCodeSet
} from '@react-monaco/plugin-textmate';

// 确保在 MonacoProvider 上下文包裹内
<MonacoProvider>
  <TextmateInjection
    debug={false}
    onChange={(active) => console.log(active)}
    provider={customTmProvider}
    filter={filterTmCodeSet}
  />
</MonacoProvider>;

// 自定义 tm 供给器
const customTmProvider: TextmateProviderCallback = ({ language, extname }) => {
  if (extname === '.prisma') {
    return {
      url: new URL('prisma.tmLanguage.json', tmBaseUrlDefault),
      languageId: 'prisma',
    };
  }
  if (language?.id === 'kotlin') {
    return {
      url: new URL('kotlin.tmLanguage.json', `${location.origin}/tm/`),
      languageId: language.id,
      // 新增，可选，请根据自己的 tmLanguage 文件来确定
      scopeName: 'source.gradle-kotlin-dsl',
    };
  }
};

// tm 代码集的过滤器，类型说明看下面
const filterTmCodeSet: TextmateFilterCodeSetCallback = (
  code: TextmateCodeSet,
) => {
  // 已经内部实现，这里只是作为一个示例
  if (code.languageId === 'python') {
    code.scopeName = 'source.python';
  }
  // 已经内部实现，这里只是作为一个示例
  if (code.extname === '.tsx') {
    code.tmName = 'typescriptreact';
  }
  return code;
};
```

## 配置

目前内部预设为：

```ts
const config = {
  onigurumaWasmUrl: 'https://cdn.jsdelivr.net/npm/vscode-oniguruma/release/onig.wasm',
  baseUrl: 'https://cdn.jsdelivr.net/npm/@react-monaco/assets/assets/tm/',
  languages: '....',
};
```

可使用 `setupTextmate` 来重新配置。

可通过 `txConfig('baseUrl')` 来取得当前的有效值。

## 类型说明

```ts
type TextmateInjectionProps = {
  // wasm url ，可选，内定为：https://cdn.jsdelivr.net/npm/vscode-oniguruma@2.0.1/release/onig.wasm
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

type TextmateProvider = {
  url: string | URL;
  // format 已经去掉，`vscode-textmate` 基于 url 文件名来检查用 json 和 plist
  // format: 'json' | 'plist';
  languageId: string;
  scopeName?: string;
};

type TextmateProviderCallback = (
  params: MonacoEventsDefinition['prepareModel'],
) => TextmateProvider | undefined;

type TextmateActiveLanguage = {
  isActive: boolean;
  languageId: string;
  extname?: string;
  timestamp: number;
};

type TextmateScope = {
  scopeName: string;
  tmName: string;
};

type TextmateCodeSet = {
  isWired: boolean;
  extname?: string;
  language?: monaco.languages.ILanguageExtensionPoint;
  languageId: string;
  provider?: TextmateProvider;
} & TextmateScope;
```

## monaco 未支持的语言的处理

如上例，prisma 不是 monaco 内定的语言，目前的做法，先根据文件后缀名，如 `.prisma`
，基于后缀名（去掉 `.` 前缀），向 monaco editor 注册该语言。

如果有自定义供给器（如上例），则根据此来提供文法解析。
