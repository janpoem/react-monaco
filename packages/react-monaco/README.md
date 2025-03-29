# @react-monaco/core

Implementation of monaco editor on react. light, cored, and easy to layer.

Monaco Editor 在 React 上的实现，非常轻量、核心化，易于分层。

所有 `@react-monaco/core` 或 `@react-monaco/plugin-*`
，皆使用外部资源加载的方式，本身的核心代码非常少，并提供多种配置方式。

![react-monaco-0.1.4-5](https://doc-assets.janpoem.workers.dev/images/react-monaco-0.1.4-5.png)

![react-monaco-0.1.4-1](https://doc-assets.janpoem.workers.dev/images/react-monaco-0.1.4-1.png)

![react-monaco-0.1.4-3](https://doc-assets.janpoem.workers.dev/images/react-monaco-0.1.4-3.png)

## 安装说明

基础安装

```bash
npm install @react-monaco/core
# or 
bun add @react-monaco/core
```

以下插件，可根据项目需要加入：

- `@react-monaco/plugin-textmate` - textmate 解析支持，推荐使用（基于
  `vscode-oniguruma` 和 `vscode-textmate`）
- `@react-monaco/plugin-locale` - 为 monaco 提供多语言支持，如果需要多语言环境，请使用
- `@react-monaco/plugin-themes` - 为 monaco 提供本地化或远程主题加载的插件，推荐使用

所有的 `@react-monaco/core` 或 `@react-monaco/plugin-*` 所需的资源（包括
wasm）皆通过外部 cdn
加载，即一安装，即可使用。

目前内置了 cdn 仓库，支持如下：

- `jsdelivr` - 基于 [jsdelivr](https://www.jsdelivr.com/)（推荐）
- `unpkg` - 基于 [unpkg](https://www.unpkg.com/)
- `jsdmirror` - 基于 [jsdmirror](https://www.jsdmirror.com/)（国内推荐）

如何调整仓库，详见下文。

## 基础用法

最简单的调用示例

```tsx
import { MonacoProvider, MonacoCodeEditor } from '@react-monaco/core';

const monacoEditorOptions = {
  fontFamily: 'var(--font-mono)',
  fontSize: 14,
  // ...
};

export default function App() {

  return (
    <MonacoProvider>
      <div>Your top toolbar...</div>
      <MonacoCodeEditor
        input={{ filename: 'test.ts' }}
        options={monacoEditorOptions}/>
      <div>Your foot toolbar...</div>
    </MonacoProvider>
  );
};
```

目前已经适配了 monaco-editor 自适应（缩小或者扩大，流式布局等），无需什么额外的配置或样式。

### 多语言使用

目前多语言基于外部 JSON 加载方式提供（默认使用 CDN，可指定 `baseUrl` 来修改）。

```tsx
import { LocaleInjection } from '@react-monaco/plugin-locale';

<MonacoProvider>
  <LocaleInjection debug locale={'zh-hans'}/>
  <MonacoCodeEditor input={{ filename: 'test.ts' }}/>
</MonacoProvider>;
```

目前包含的多语言内容，来自 [wang12124468/monaco-editor-nls](https://github.com/wang12124468/monaco-editor-nls)
，已支持如下地区语言：

- `cs` - Czech 捷克语
- `de` - German 德语
- `es` - Spanish 西班牙语
- `fr` - French 法语
- `it` - Italian 意大利语
- `ja` - Japanese 日语
- `ko` - Korean 韩语
- `pl` - Polish 波兰语
- `pt-br` - Portuguese 葡萄牙语
- `ru` - Russian 俄语
- `zh-hans` - 简体中文
- `zh-hant` - 繁體中文

更多说明请参考 [plugin-locale README.md](https://github.com/janpoem/react-monaco/blob/main/packages/plugin-locale/README.md)

### 主题插件

首先，需要通过 `createThemesPlugin` 来创建一个主题的环境。

```tsx
import { createThemesPlugin } from '@react-monaco/plugin-themes';
import githubLight from './theme/github-light';

const [themes, ThemesInjection] = createThemesPlugin({
  themes: [
    { key: 'github-light', name: 'GitHub Light', theme: githubLight },
    { key: 'webstorm-dark', name: 'Webstorm Dark' },
    {
      key: 'webstorm-darcula',
      name: 'Webstorm Darcula',
      url: `http://your.domain/themes/webstorm-darcula.json`,
    },
  ],
  // 非必须，不指定时使用 cdn
  baseUrl: 'http://your.domain/themes/'
});

<MonacoProvider>
  <ThemesInjection debug theme={'webstorm-dark'}/>
  <MonacoCodeEditor
    input={{ filename: 'test.ts', source: '' }}
    options={{ theme: 'webstorm-dark' }}
  />
</MonacoProvider>;
```

通过 `ThemesInjection` 表示申请加载主题，这将基于你 `createThemesPlugin` 设定的主题来源。

目前允许三种方式声明主题：

1. 项目内代码实现
2. 指定外部的 URL
3. 基于 cdn 仓库（或者自己设定 baseUrl）

内置主题或外部主题，都可传给 `ThemesInjection` ，他会自己去识别是否内置（已加载过的很主题不会重复加载）。

实际使主题生效，在于 `MonacoCodeEditor` 的 `options.theme` 。

`ThemesInjection` 就类似一个外挂。

动态切主题的使用，较为复杂，请参考 [plugin-themes README.md](https://github.com/janpoem/react-monaco/blob/main/packages/plugin-themes/README.md)
具体说明。

### Textmate 插件

monaco 内置的文法解析比较简单，使得他默认代码的高亮，略显单调。

推荐使用 `@react-monaco/plugin-textmate` 插件，以使代码高亮更多彩。

```tsx
import { TextmateInjection } from '@react-monaco/plugin-textmate';

<MonacoProvider>
  <TextmateInjection debug/>
  <ThemesInjection debug theme={'csb-default'}/>
  <MonacoCodeEditor
    input={{ filename: 'test.ts', source: '' }}
    options={{ theme: 'csb-default' }}
  />
</MonacoProvider>;
```

结合主题插件一起使用，效果更佳。

目前 `@react-monaco/plugin-textmate` 基于 `vscode-textmate` 和
`vscode-oniguruma` 做的实现。

更多说明请参考 [plugin-textmate README.md](https://github.com/janpoem/react-monaco/blob/main/packages/plugin-textmate/README.md)

### 环境配置

#### CDN 仓库

目前默认设置了三个外部资源的仓库 `jsdelivr` `unpkg` `jsdmirror` 。

可通过如下方式对默认的 CDN 进行扩充：

```ts
import { setupMonacoRepos } from '@react-monaco/core';

setupMonacoRepos({
  yourRepo: 'http://your.domain/',
});
```

**注意**：自定义 CDN ，要确保提供资源的完备性（NPM 资源），除了 monaco 必要的资源，还要提供
`vscode-oniguruma` 的 wasm。

如果你进希望调整个别的入口可参考如下：

#### setup 配置

目前所有 `@react-monaco/core` 或 `@react-monaco/plugin-*` 都提供两种配置机制：

```ts
import { setupMonaco, repoUrlOf } from '@react-monaco/core';
import { setupTextmate } from '@react-monaco/plugin-textmate';

setupMonaco({
  assetsBaseUrl: 'http://your.domain/monaco/',
});

setupTextmate({
  baseUrl: 'http://your.domain/monaco/tm/',
  onigurumaWasmUrl: repoUrlOf('unpkg', 'vscode-oniguruma/release/onig.wasm'),
});
```

#### 组件属性声明

```tsx
import { MonacoProvider } from '@react-monaco/core';
import { LocaleInjection } from '@react-monaco/plugin-locale';

<MonacoProvider loader={{ baseUrl: 'http://your.domain/monaco/' }}>
  <LocaleInjection
    baseUrl={'http://your.domain/monaco/tm/'}
    locale={'zh-hans'}
  />
  <MonacoCodeEditor input={{ filename: 'test.ts' }}/>
</MonacoProvider>;
```

#### baseUrl 特别说明

项目内的 URL 构建基于浏览器 `URL` 来构成。需要特别注意，`new URL` 的第二个参数
`base` 应该明确以 `/` 结束，参考以下的代码例子：

```ts
// 以下将输出：http://your.domain/entry/A/B/test
console.log(new URL('test', 'http://your.domain/entry/A/B/C').href);

// 以下将输出：http://your.domain/test
console.log(new URL('/test', 'http://your.domain/entry/A/B/C').href);

// 以下将输出：http://your.domain/entry/A/B/C/test
console.log(new URL('test', 'http://your.domain/entry/A/B/C/').href);
```

结论：请确保所有 `baseUrl` 以 `/` 结尾。

## 机制简介

monaco-editor 本体必须保持以下的文件：

- `editor.main.umd.js` monaco 相关主程序，可通过传统 `<script>` 标签来加载
- workers，由 monaco 内部通过浏览器的 worker 去加载。
    - `css.worker.umd.js`
    - `editor.worker.umd.js`
    - `html.worker.umd.js`
    - `json.worker.umd.js`
    - `ts.worker.umd.js`

限于 worker 加载的安全机制，如果要实现跨域加载，只能将下载后的代码以 blobUrl
的方式来供应给 monaco-editor。

以上模式实际上是最理想的 monaco-editor 的加载机制（monaco 官方沉迷于 amd 和 esm），
这里稍作解释：

基于对 monaco 源代码的研究，多语言注入的问题，很多写在程序运行时的变量里（运行时变量赋值）。
即当你的 monaco 在加载时，已经是简体中文的时候，你无法去改变那些已经加载过得 JS 的运行时的变量。

要动态更换多语言，最直接的做法，就是移除原来已经挂载的 JS（UMD 做这种事就很方便），
修改全局语言值，然后重新加载一次 monaco 主程序（因为你浏览器已经下载过了，第二次是从缓存里面拿，会很快）。

而 workers，他实际上每次创建一个 model 的时候，都会去重新加载，所以 blobUrl
模式反而是目前最高效的机制。

这时候的难题就来到了，如何更好的管理 monaco 前置脚本的加载问题。这洋洋洒洒的 6
个文件，从 0 开始下载，在网络不好的情况，体验感还是会很僵。

所以目前基于 fetch stream reader 的机制，实现下载进度条，以增强用户等待的体验，起码明确知道下载的进度。

并在此基础上实现的 [use-remote-loader](https://github.com/janpoem/react-monaco/blob/main/packages/use-remote-loader/README.md)。

实际上，现在 `@react-monaco/core` 所设计的机制是，在 monaco 的主程序和 workers
下载过程里，允许用户通过插件的方式，给这个过程去注入更多所需的依赖下载。

如多语言数据包、外部主题声明包、wasm 扩展等，可合并到下载流程里（合并成一个整体的下载进度）。

这样他就形成一个完整的机制，可以让开发者更自由轻松的对 monaco 进行扩展和定制。

## 插件开发说明

基于目前的机制，开发定制插件非常简单，以下演示一个例子：

```tsx
import {
  useMonaco,
  BaseEventsDelegator,
  MonacoEventsDefinition,
  EventsDelegatorOptions, monacoRepo,
} from '@react-monaco/core';

export const YourPlugin = () => {
  const { emitterRef, setError } = useMonaco();
  const delegatorRef = useRef<YourPluginEventsDelegator>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    try {
      delegatorRef.current = new YourPluginEventsDelegator({
        debug: true,
      });
      delegatorRef.current.inject(emitterRef.current);
    } catch (err) {
      setError(err);
    }

    return () => {
      delegatorRef.current?.eject(emitterRef.current);
      delegatorRef.current = null;
    };
  }, []);

  return null;
};

class YourPluginEventsDelegator extends BaseEventsDelegator<MonacoEventsDefinition> {
  // 便于本地调试，第二参数用于声明 debug scopeName 调试器显示样式
  scopeName = ['YourPlugin', 'color: green'];

  wasmKey = 'wasm/any-key';

  constructor(opts?: Partial<EventsDelegatorOptions>) {
    super(opts);
    // 以本类的 prepareAssets 方法注册到 monaco 事件里的 prepareAssets 事件
    this.register('prepareAssets');
    // 以本类的 assetWasm 注册到 asset:wasm/any-key 事件中去
    this.register('assetAnyWasm', `asset:${this.wasmKey}`);
    this.register('mounting');
    this.register('prepareModel');
  }

  prepareAssets = ({ preloadAssets }: MonacoEventsDefinition['prepareAssets']) => {
    preloadAssets.push({
      key: this.wasmKey,
      url: 'http://your.domain/any.wasm',
      priority: 100,
      type: 'wasm',
    });
  };

  assetAnyWasm = ({ key, task, handle }: MonacoEventsDefinition['asset']) => {
    // task 为下载的任务
    if (task.chunks != null) {
      // wasm 初始化
      initSync({ modlue: task.chunks.buffer });
    }
    // 表示接管该资源，不让他的结果进入默认的 monaco preload 的结果集中去
    handle();
  };

  // mounting 事件，表示初步将 monaco 主程序挂载到 head，全局已经存在 monaco 的全局对象
  mounting = ({ monaco }: MonacoEventsDefinition['mounting']) => {
    // 对 monaco 做点什么
  }

  // model 创建前的操作
  prepareModel = ({ input }: MonacoEventsDefinition['prepareModel']) => {
  }
}
```

然后，只要把 `YourPlugin` 放入到 `MonacoProvider` 之内，即可。

## 组件参数说明

涉及的内容太多，这里只对 `MonacoProvider` 和 `MonacoCodeEditor` 的组件参数做说明

```ts
export type MonacoProviderProps = {
  // 重载预设文本
  texts?: Partial<MonacoTexts>;
  // 重载预设组件，目前只有 ErrorDisplay / Loader / ProgressBar 
  components?: Partial<MonacoComponents>;
  // 加载器的参数配置
  loader?: MonacoLoaderProps;
  // 事件声明，可以是 EventEmitter ，也可以是事件函数定义，也可以是一个 EventsDelegator
  events?: EventsInput<MonacoEventsDefinition>;
  // 样式定义和 css 变量定义
  style?: Partial<PresetStyleVars & CSSProperties>;
  className?: string;
  children?: ReactNode;
};

export type PresetStyleVars = {
  '--rmBackdropBg': CSSProperties['backgroundColor'];
  '--rmBackdropZIndex': CSSProperties['zIndex'];
  '--rmGap': CSSProperties['gap'];
  '--rmBorderColor': CSSProperties['borderColor'];
  '--rmTextColor': CSSProperties['color'];
};

export type MonacoCodeEditorProps = {
  input: MonacoCodeInput;
  // 编辑器参数
  options?: Partial<
    Omit<monaco.editor.IStandaloneEditorConstructionOptions, 'value' | 'model'>
  >;
  className?: string;
  style?: CSSProperties;
  beforeModel?: (params: MonacoModelPrepareParams) => void;
  onModel?: (params: MonacoModelCreateParams) => void;
  onChange?: (params: MonacoModelChangeParams) => void;
  beforeMount?: (params: MonacoEditorPrepareParams) => void;
  onMount?: (params: MonacoEditorMountParams) => void;
  onFocus?: (params: MonacoEditorFocusAndBlurParams) => void;
  onBlur?: (params: MonacoEditorFocusAndBlurParams) => void;
};

export type MonacoFileCodeInput = {
  // 文件名，必须指定 
  filename: string;
  // 源代码，可选
  source?: string;
  // uri ，部分代码文件，必须指定  uri 才能正确高亮
  uri?: string;
};

export type MonacoCodeInput = MonacoFileCodeInput;
```

