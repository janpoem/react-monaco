# @react-monaco/plugin-locale

Locale plugin for react monaco editor.

react monaco editor 多语言插件。

多语言相关翻译不是我做的，取自 [wang12124468/monaco-editor-nls](https://github.com/wang12124468/monaco-editor-nls)
项目。

目前已有：

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

## 配置

默认配置

```ts
import { makeConfigurable } from '@react-monaco/core';

export const [setupLocale, localeConfig] = makeConfigurable({
  baseUrl: 'https://cdn.jsdelivr.net/npm/@react-monaco/assets/assets/locales/',
});
```

## 加载机制

目前已改为支持 json 格式的多语言数据文件，并且通过异步远程获取，非打包在源代码中。

```tsx
import { LocaleInjection } from '@react-monaco/plugin-locale';

const [local, setLocal] = useState('zh-hans');

<MonacoProvider loader={{ query: { locale } }}>
  <LocaleInjection
    locale={locale}
    baseUrl={`${location.origin}/assets/locales/`}
  />
</MonacoProvider>
```

如果不需要在线实时切换多语言，只需要确保在 `<MonacoProvider>` 内包含了
`<LocaleInjection />`，也不需要在 loader 里声明 query。

loader query 的参数，用于确保当 query 里面的数据发生变化时，会自动触发整体重载（重新下载
monaco 的主文件，以覆盖全局已加载，这和 monaco 本身的多语言机制有关）。

## 全局变量

多语言的数据存在 `window.MonacoLocales` 这个全局变量下，比如
`window.MonacoLocales['zh-hans']` 。

动态加载多语言时，已经加载过一次的，下一次切换就不会再次去远端下载（使用本地）。

为 monaco 标记当前多语言，基于 `window.MonacoEnvironment.locale` ，这个不是官方的配置。

具体 `window.MonacoEnvironment.locale`
如何生效，可以参考我做的 [monaco umd 打包](https://github.com/janpoem/rollup-monaco-bundler)
项目。

