# @zenstone/react-monaco

`monaco-editor` 的 react 实现。核心源代码目录在 `src/monaco` ，其他代码皆为用于演示
App 的代码。

[react-monaco 演示](https://static.kephp.com/react-monaco/0.0.2/index.html)，第一次打开下载很慢（本身绕国外就慢），实际走 github 下载的，下载后保存到 indexeddb ，第二次打开就很快了。

## 更新日志

### 25/03/19

- `preset-provider` 提高层级，作为公共部分，由调用者传入 `C` `T` 决定具体实现。
  - check like [MonacoProvider.tsx](src/monaco/MonacoProvider.tsx)
- 基于 [emittery](https://www.npmjs.com/package/emittery) 改用事件机制
  - `prepareAssets` `interceptPrepareAssets` 资产准备阶段（拦截）
  - `preload` `asset` `asset:${key}` `interceptMountAssets` 资产预载完毕，资产处理接管，资产挂载前拦截
  - `mounting` MonacoProvider 挂载，专指资产挂载完毕
  - `mounted` MonacoCodeEditor 挂载完毕 
  - `prepareModel` `createModel` `changeModel` model 相关（前、创建后、onChange）
- 预设文本完善
- 基于 `onigasm` `monaco-textmate` `monaco-editor-textmate` 实现接入 textmate 的文法解析。
  - 实现于 [TextmateInjection.tsx](src/plugins/textmate/TextmateInjection.tsx)，外挂式注入（结合事件）
  - 主题全部转 tm 主题（没人会喜欢 monaco 原本自带的主题，太单调）
- 目录结构调整，删除多余文件

    src 目录结构调整说明
    
    ```
    src
     ├── db               前端 indexedDB
     ├── monaco           * monaco-editor 相关封装
     ├── plugins          * 插件库
     ├── preset-provider  * 组件、文本供给器
     ├── samples          示例入口
     └── toolbar          工具栏相关
    ```
    
    标 `*` 为该项目核心代码，其他为示例所需。

- 组件调用层级关系简化，为后面的 IDE 示例预简化：

  ```tsx
  <MonacoProvider injections={<TextmateInjection/>}>
    <MonacoCodeEditor
      topBar={<div>TopBar</div>}
      footBar={<div>FootBar</div>}
    />
  </MonacoProvider>;
  ```
  - 在 monaco 相关资产为完全加载完毕前，MonacoProvider 的 children 处于未可挂载的状态。
  - 可通过 `injections` 来注入需要和资产挂载时同时注入的组件（事件）
  - 但需要注意事件需要有完整的挂载和卸载，否则可能导致事件被多次触发。

### 25/03/15

- resolve react tsx 的代码正确渲染的问题：

  1. model 要指定 uri: `xxx.tsx`
  2. 正确的 `monaco.languages.typescript` 配置，尤其是 `jsx: monaco.languages.typescript.JsxEmit.ReactJSX`
    ```ts
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution:
        monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      esModuleInterop: true,
      noEmit: true,
    });
    ```
  3. 加载额外的 d.ts ，必须要附加 `react` 和 `react/jsx-runtime` ，通过 `languages.typescript.typescriptDefaults.addExtraLib`

- 嵌入 `@biomejs/wasm-web` 试验，已经解决，可参考：[BiomePlugin.tsx](src/plugins/biome/BiomePlugin.tsx) 。

  1. 后续会添加基于 biome 的针对 js/ts/html/json/css 的语法检查和格式化。 
  2. 该插件模式后续会继续扩展包括加入 `oxc` ，主要针对 JS/TS 的语法检查。 
  3. biome wasm 嵌入方式采用代码魔改，因为这版本 npm 源码很多都是错误的地方，需要本地做大量修改。
  4. monaco-editor 主题色会和 mui 主题色联动。

- 嵌入 d.ts 加载，测试部分库可正确提示（如 `usehooks-ts`，`@zenstone/ts-utils/remote`）。后续基于 `oxc` 进行语法分析，即可动态提取文件中的 import ，以动态加载 d.ts 文件（目前是写死的）。

- 简化 `AssetsLoader` ，移除函数 `assets` 传入

## 废话连篇

23年某个项目里，大量使用了 `CodeMirror` ，但 `CodeMirror` 要扩展 auto complete
功能的工作量实在太大， 接入 LSP 服务，或者嵌入其他的 lint（formatter
反而好做），语法检查插件，都非常麻烦。按照官方的说法是可以支持 `.d.ts`
，不过我折腾了半天，很麻烦。

经过再三研究，决定改用 `monaco-editor` 。24年里将在线编辑器切换到 `monaco-editor`
，对其多语言、umd 打包，做了一些深入的研究。

0.50.0 版本以前，`monaco-editor` 默认标配以 amd 机制来加载多语言，他利用 amd 加载时的
moduleId ，来注入对应 module 的多语言文本。这个做法是很混蛋的做法，显然官方自己也意识到了，所以
0.50.0 以后，就改变了做法，但新的做法采用将多语言内容进行压缩，简化了 nls
的实现，但这仍不是一个好的做法，我估计后面他还会大改。

除此之外，通过翻他的源代码，很多语言的变量，实在全局运行时绑定的，假定设定了全局语言为
`zh-cn`，那么该次所有的全局变量都变成了 `zh-cn` 。这意味着，一旦已经加载了主程序、各个
worker ，这些 JS 文件运行时的多语言就无法被改变了。

其次是，monaco-editor 关联的文件特别多，编译压缩后的文件也很大（如果算上多语言包的话，就更大），所以要针对他的加载机制做对应的优化。

而 monaco-editor 的 worker ，是采用浏览器 Worker 去加载的，他不但强约束了同源性的限制，而且要求服务器端输出
JS 的时候，也要准确得输出 Response Header 的 Content-Type，如果 Content-Type
不对，他也会无法正确加载 Worker。

针对上述的弊端，该项目主要提供以下的解决方案：

1. 基于 [rollup-monaco-bundler](https://www.npmjs.com/package/rollup-monaco-bundler)
提供 umd 打包机制，便于将 monaco 所有所需的文件变为独立、可稳定后加载。
2. 基于 [rollup-monaco-bundler](https://www.npmjs.com/package/rollup-monaco-bundler)
提供基于 umd 机制的 nls 注入机制，提供针对 0.50.0 以前和 0.51.0
以后两种模式。但不可能去解决他全局变量的情况，不过目前已经有解决的方案，即移除已经加载的
monaco 资源，删除全局变量，设定新的语言，并重新加载对应的资源（包括 Worker）。
3. 基于 fetch steam reader [@zenstone/ts-utils](https://www.npmjs.com/package/@zenstone/ts-utils)，提供下载进度条管理，在缓冲所需文件时，会先采用有进度条机制的下载，增强用户体验。
4. 根据 assets 声明，来决定 Worker 的加载机制，如果是非同域（或强制指定
   `isBlobWorker`），在 Worker 缓冲后，会转为 blob 的同域 URL。
5. 多语言切换，参考 2.
6. 动态注入 monaco 主题皮肤。

## 组件结构

```
PresetContext -> 预定义组件、文本上下文
 └── MonacoProvider -> assets 管理，加载器包装
      ├── MonacoCodeEditor -> 代码编辑器
      └── MonacoDiffEditor -> 差异比较编辑器（未实现）
```

最简易的调用代码：

```tsx
function App() {

  return (
    <MonacoProvider {...providerProps}>
      <MonacoCodeEditor
        input={{ filename: 'test.js', source: '// ...' }}
        options={...editorOptions}
      />
    </MonacoProvider>
  );
}
```

[App.tsx](src/CodeEditor.tsx) 可以视作一个最基础的扩展开发。

其中加入了：

- 切换多语言（动态切换）
- 切换文件
- 切换主题（自定义主题动态注入）
- 为了加速加载，第一次下载完成后会保存到本地的 indexeddb
  （可参考 [preset.ts](src/preset-old.ts)）
- monaco 主题（明/暗）和 mui 主题（明/暗）联动（初始状态，基于 media query）

[react-monaco 演示](https://static.kephp.com/react-monaco/0.0.2/index.html)，第一次打开下载很慢（本身绕国外就慢），实际走 github 下载的，下载后保存到 indexeddb ，第二次打开就很快了。

## 特别说明

该项目主要将 24 年的一些成果转化为一个独立的项目（旨在为后续某些项目中能更简单快速的调用），最终以发布 npm 方式（后续开发视乎实际情况），目前的架构分层已经明确（不会大改）。

在此要特别感谢 D 姓友人，他的软件定制机制给我开拓了很大的思路，以极大决心于在线代码编辑器的研究。
