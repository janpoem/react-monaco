# @react-monaco/plugin-themes

Themes plugin for react monaco editor.

React Monaco Editor 的主题管理插件。

`@react-monaco/core` 内置四个主题 `vs` `vs-dark` `hc-light` `hc-black` （Textmate
主题扩展）。

目前允许三种方式声明主题：

1. 项目本地代码实现 `MonacoCustomTheme`
2. 外部远程 json 声明
3. 基于 cdn 仓库（或者自己设定 baseUrl）

目前 `@react-monaco/assets` 包含的默认主题如下：

- `atom-material-theme`
- `atom-one-light`
- `atomize`
- `csb-default`
- `github-light`
- `webstorm-darcula`
- `webstorm-dark`

如需自行转换 vscode 的主题，可通过 `@react-monaco/core` 在线演示提供的 [**Theme Converter**](https://static.kephp.com/react-monaco-demo/index.html#theme-converter)：

![react-monaco-0.1.4-4](https://doc-assets.janpoem.workers.dev/images/react-monaco-0.1.4-4.png)

## 使用说明

因为要保证主题可外部加载，所以主题插件稍微设计的有些复杂。

首先要通过 `createThemesPlugin` 来创建主题插件。

```tsx
import { createThemesPlugin } from '@react-monaco/plugin-themes';
import githubLight from './themes/github-light';

const { themes, ThemesInjection } = createThemesPlugin({
  themes: [
    { key: 'atom-material-theme', name: 'Atom Material Theme' },
    { key: 'atom-one-light', name: 'Atom One Light' },
    { key: 'atomize', name: 'Atomize(Atom One Dark)' },
    { key: 'csb-default', name: 'CSB Default' },
    // 使用本地源代码的主题
    { key: 'github-light', name: 'GitHub Light', theme: githubLight },
    {
      key: 'webstorm-darcula',
      name: 'Webstorm Darcula',
      // 自定义主题 url 提供
      url: `http://your.domain/monaco-themes/webstorm-darcula.json`,
    },
    { key: 'webstorm-dark', name: 'Webstorm Dark' },
  ],
  baseUrl: 'http://your.domain2/themes/',
});
```

这样会基于指定的主题，创建对应的主题环境。

```tsx
import { MonacoCodeEditor, MonacoProvider } from '@react-monaco/core';
import { useState } from 'react';

function App() {
  const [theme, setTheme] = useState('webstorm-dark');

  return (
    <MonacoProvider>
      <ThemesInjection theme={theme}/>
      <MonacoCodeEditor input={{ filename: 'xxx.ts' }} options={{ theme }}/>
    </MonacoProvider>
  );
}
```

`ThemesInjection` 负责主题的远程加载，并定义到全局的 monaco 环境。

`MonacoCodeEditor` 是主题的使用者。

## 动态切换主题

因为主题不在代码中打包，所以，当动态切换皮肤时：

1. 需要对外请求皮肤主题 json
2. 定义主题：monaco.editor.defineTheme
3. 然后才可以触发改变主题 `options.theme`

所以要实现换肤，可以借用一个额外的 state 来做一个桥。

```tsx
import { MonacoCodeEditor, MonacoProvider } from '@react-monaco/core';
import { useState } from 'react';

type NextTheme = {
  name?: string;
  loading: boolean;
};

function App() {
  const [theme, setTheme] = useState('webstorm-dark');

  const [nextTheme, setNextTheme] = useState<NextTheme>({ loading: false });

  return (
    <MonacoProvider>
      <ThemesInjection
        theme={theme}
        loadTheme={nextTheme.name}
        onLoad={(res) => {
          if (res.isSuccess) {
            // 主题加载成功时，才修改 theme 
            setTheme(res.theme.name);
          }
          // 释放锁
          setNextTheme((prev) => ({ ...prev, loading: false }));
        }}
      />
      <ThemeSelect
        value={theme}
        themes={themes}
        // 每当触发选择变更时，先锁定 select ，等皮肤加载完毕后，再释放
        disabled={nextTheme.loading}
        onChange={(name) => setNextTheme({ name, loading: true })}
      />
      <MonacoCodeEditor input={{ filename: 'xxx.ts' }} options={{ theme }}/>
    </MonacoProvider>
  );
}
```

`ThemesInjection` 的 `onLoad` 回调，不管成功失败，都会被触发。

`ThemesInjection` 的 `loadTheme` 用于接收变更后的主题名，接受到变化后，会触发
`ThemesInjection` 内部去加载对应的主题（如果主题已存在，会以成功状态回调 `onLoad`）。


## 开发说明

请参考 [开发说明](https://github.com/janpoem/react-monaco/blob/main/docs/DEVEL_GUIDE.md)


## 主题进阶

**首先**，对主题定义的结构进行了扩展，参考如下 `MonacoCustomTheme` 。

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
  // monaco 原来的主题定义数据
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

一个主题，必须明确声明 `name` 和 `isDark`，且 `data` 的数据，必须符合
`monaco.editor.IStandaloneThemeData` 的类型。

也可以参考这两个辅助方法的定义：

```ts
export const isMonacoCustomTheme = (obj: unknown) =>
  isInferObj<MonacoCustomTheme>(
    obj,
    (it) =>
      notEmptyStr(it.name) &&
      'isDark' in it &&
      typeof it.isDark === 'boolean' &&
      isMonacoThemeData(it.data),
  );

export const isMonacoThemeData = (obj: unknown) =>
  isInferObj<monaco.editor.IStandaloneThemeData>(
    obj,
    (it) =>
      notEmptyStr(it.base) &&
      Array.isArray(it.rules) &&
      it.rules.length > 0 &&
      isInferObj(it.colors),
  );
```

**其次**，一个有效的主题，应该导出必要的 `colors: Partial<MonacoThemeColors>`
，用于对外声明这个主题的主要色调。

目前为了兼容多数主题，不要求 `colors` 完整声明，可以声明部分。

基于明确的 `isDark` ，最终再复原一个主题的主要色调声明时候，会和 `vs` (light) 或
`vs-dark` (dark) 的 `colors` 进行合并。以使每个主题都有完整的 colors。

```ts
export type MonacoThemeFrag = {
  name?: string;
  isDark?: boolean;
  colors?: Partial<MonacoThemeColors>;
};

export type MonacoThemeInput =
  | undefined
  | null
  | boolean
  | MonacoThemeFrag
  | string;

export type MonacoThemeSkeleton = {
  name: string;
  isDark: boolean;
  colors: MonacoThemeColors;
};
```

`@react-monaco/core` 提供一个方法 `revertMonacoThemeSkeleton` ，会尝试从
`MonacoThemeInput` 复原出 `MonacoThemeSkeleton` ，以确保复原的主题的完整性。

基于 `MonacoThemeSkeleton` 即可拿去与外部的 UI 系统的主题环境进行同步。

以下是简单的和 mui 主题同步的例子：

```tsx
import {
  MonacoCodeEditor,
  MonacoProvider,
  revertMonacoThemeSkeleton,
  type MonacoThemeColors,
  type MonacoThemeInput,
} from '@react-monaco/core';
import { useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

type NextTheme = {
  name?: string;
  loading: boolean;
};

function App() {
  const [themeData, setThemeData] = useLocalStorage<MonacoThemeInput>('monaco-theme', {});

  const [themeName, muiTheme] = useMemo(() => {
    const { name, colors, isDark } = revertMonacoThemeSkeleton(themeData);
    return [
      name,
      createMuiTheme(isDark, colors), // 创建 mui 主题
    ];
  }, [themeData]);

  const [nextTheme, setNextTheme] = useState<NextTheme>({ loading: false });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline/>
      <MonacoProvider>
        <ThemesInjection
          theme={theme}
          loadTheme={nextTheme.name}
          onLoad={(res) => {
            if (res.isSuccess) {
              const { name, isDark, colors } = res.theme;
              setThemeData({ name, isDark, colors });
            }
            // 释放锁
            setNextTheme((prev) => ({ ...prev, loading: false }));
          }}
        />
        <ThemeSelect
          value={themeName}
          themes={themes}
          // 每当触发选择变更时，先锁定 select ，等皮肤加载完毕后，再释放
          disabled={nextTheme.loading}
          onChange={(name) => setNextTheme({ name, loading: true })}
        />
        <MonacoCodeEditor
          input={{ filename: 'xxx.ts' }}
          options={{ theme: themeName }}
        />
      </MonacoProvider>
    </ThemeProvider>
  );
}


export const createMuiTheme = (
  darkMode: boolean,
  {
    primary,
    secondary,
    success,
    error,
    background,
    text,
    borderColor,
  }: MonacoThemeColors,
) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      text: {
        primary: text,
      },
      success: {
        main: success,
      },
      error: {
        main: error,
      },
      divider: borderColor,
      background: {
        default: background,
        paper: background,
      },
    },
  });
```

其核心的思路就是：将 `isDark` 和 `colors` 外部存储，并可优先于 monaco editor
主题加载时存在，这样我们可以确保基础 UI 的主题先行，以达到整个 UI 和 monaco editor
的主题保持同协状态。

每次更换主题时 `setThemeData({ name, isDark, colors })` ，都会触发 `themeData`
更新，从而更新 mui 的主题，完成闭环。
