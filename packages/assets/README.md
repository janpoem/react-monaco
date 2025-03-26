# @react-monaco/assets

React monaco editor related assets.

- locales 取自 [wang12124468/monaco-editor-nls](https://github.com/wang12124468/monaco-editor-nls) 
- tm languages 取自 [microsoft/vscode](https://github.com/microsoft/vscode)
- themes 取自 vscode 的主题，并进行转换

## 主题定义说明

```ts
// 主题定义结构
export type MonacoCustomTheme = {
  // 主题内部名，用于 monaco.editor.defineTheme 的名称，不要包含敏感字，应该采用中划线命名
  name: string;
  // 主题对外的显示名
  displayName: string;
  // 主题的主要颜色的摘要
  colors: Partial<MonacoThemeColors>;
  // 是否为 dark 主题
  isDark: boolean;
  // 具体的主题定义数据
  data: monaco.editor.IStandaloneThemeData;
};

export type MonacoThemeColors = {
  // UI 主要颜色 
  primary: string;
  // UI 次要颜色
  secondary: string;
  // 成功/UI的颜色
  success: string;
  // 错误的颜色
  error: string;
  // 主体背景色（页面）
  background: string;
  // 全局文本颜色
  text: string;
  // 边框颜色
  borderColor: string;
};
```

