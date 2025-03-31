# @react-monaco/repo

基于 UMD 打包方式加载 monaco 相关资源的 react 实现方案。

主要特性：

- 动态切换多语言
- 外部加载多语言
- 外部加载主题
- textmate 解析支持
- 完整事件流程（便于插件扩展）
- 核心代码少

已经拆分 8 个子项目：

两个基础库：

- [
  `@zenstone/use-remote-loader`](./packages/use-remote-loader)[![version](https://img.shields.io/npm/v/@zenstone/use-remote-loader?style=for-the-badge)](https://www.npmjs.com/package/@zenstone/use-remote-loader) -
  外部资源加载 hook，实现 js/css 异步加载后挂载到 DOM head，额外支持
  json/text/wasm/blobUrl 等加载机制
- [
  `@zenstone/preset-provider`](./packages/preset-provider)[![version](https://img.shields.io/npm/v/@zenstone/preset-provider?style=for-the-badge)](https://www.npmjs.com/package/@zenstone/preset-provider) -
  预定义组件和文本上下文 Provider，实现组件和文本重载。

`@react-monaco` 相关

- [
  `@react-monaco/core`](./packages/react-monaco)[![version](https://img.shields.io/npm/v/@react-monaco/core?style=for-the-badge)](https://www.npmjs.com/package/@react-monaco/core) -
  `MonacoProvider` 和 `MonacoCodeEditor` 实现，核心的一些方法（主题判断，可配置化，事件抽象封装等）
- [
  `@react-monaco/assets`](./packages/assets)[![version](https://img.shields.io/npm/v/@react-monaco/assets?style=for-the-badge)](https://www.npmjs.com/package/@react-monaco/assets) -
  相关资产，包含 monaco 0.52.2 本体/locales/themes/tmLanguages 等。
- [
  `@react-monaco/plugin-locale`](./packages/plugin-locale)[![version](https://img.shields.io/npm/v/@react-monaco/plugin-locale?style=for-the-badge)](https://www.npmjs.com/package/@react-monaco/plugin-locale) -
  多语言插件，提供外部加载机制（JSON）实现多语言
- [
  `@react-monaco/plugin-themes`](./packages/plugin-themes)[![version](https://img.shields.io/npm/v/@react-monaco/plugin-themes?style=for-the-badge)](https://www.npmjs.com/package/@react-monaco/plugin-themes) -
  主题插件，提供外部加载机制挂载主题
- [
  `@react-monaco/plugin-textmate`](./packages/plugin-textmate)[![version](https://img.shields.io/npm/v/@react-monaco/plugin-textmate?style=for-the-badge)](https://www.npmjs.com/package/@react-monaco/plugin-textmate) -
  textmate 解析插件，可以与 vscode 主题兼容

[`@react-monaco/demo`](./packages/demo) - 上述所有功能特性的合并演示项目。

[@react-monaco 在线演示](https://static.kephp.com/react-monaco/0.1.5/index.html)
（使用 jsdelivr CDN 资源，可能国内访问略慢）。

![react-monaco-0.1.4-5](https://doc-assets.janpoem.workers.dev/images/react-monaco-0.1.4-5.png)

![react-monaco-0.1.4-1](https://doc-assets.janpoem.workers.dev/images/react-monaco-0.1.4-1.png)

![react-monaco-0.1.4-3](https://doc-assets.janpoem.workers.dev/images/react-monaco-0.1.4-3.png)

![react-monaco-0.1.4-4](https://doc-assets.janpoem.workers.dev/images/react-monaco-0.1.4-4.png)

- [开发说明](https://github.com/janpoem/react-monaco/blob/main/docs/DEVEL_GUIDE.md)
- [旧版说明](https://github.com/janpoem/react-monaco/blob/main/docs/README_OLD.md)

具体请参考具体子项目的说明文档。

