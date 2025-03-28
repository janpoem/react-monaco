export default {
  // @ts-ignore
  filename: 'App.tsx',
  uri: 'App.tsx',
  source: `
import { css } from '@emotion/css';
import { CssBaseline, LinearProgress, ThemeProvider } from '@mui/material';
import {
  type DownloadingParams,
  MonacoCodeEditor,
  type MonacoCodeEditorProps,
  type MonacoCodeEditorRef,
  MonacoLoaderProcess,
  type MonacoPresetProgressBarProps,
  MonacoProvider,
  revertMonacoThemeSkeleton,
} from '@react-monaco/core';
import { LocaleInjection } from '@react-monaco/plugin-locale';
import {
  type TextmateCodeSet,
  type TextmateFilterCodeSetCallback,
  TextmateInjection,
  type TextmateProviderCallback,
  tmConfig,
} from '@react-monaco/plugin-textmate';
import { createThemesPlugin } from '@react-monaco/plugin-themes';
import { useMemo, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { assetsOf, monacoBaseUrl } from './presets';
import { createTheme } from './theme';
import {
  FileSelect,
  FileSelectOptions,
  LocaleSelect,
  ThemeSelect,
  TopBar,
} from './toolbar';
import type { NextTheme, SampleStorageData } from './types';

const editorOptions: MonacoCodeEditorProps['options'] = {
  lineHeight: 1.5,
  tabSize: 2,
  fontSize: 16,
  fontWeight: '300',
  fontFamily: 'var(--font-mono)',
  fontLigatures: 'no-common-ligatures, slashed-zero',
  letterSpacing: 0.025,
  minimap: { enabled: false },
  theme: 'vs',
  scrollbar: {
    verticalHasArrows: false,
    horizontalHasArrows: false,
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 13,
    horizontalScrollbarSize: 13,
    verticalSliderSize: 8,
    horizontalSliderSize: 8,
  },
};

const cssScrollBar = css\`
  .scrollbar .slider {
    border-radius: 10px;
  }
  .scrollbar.vertical {
    padding-top: 2px;
    .slider {
      margin-left: 1px;
    }
  }
\`;

const { themes, ThemesInjection } = createThemesPlugin({
  themes: [
    { key: 'atom-material-theme', name: 'Atom Material Theme' },
    { key: 'atom-one-light', name: 'Atom One Light' },
    { key: 'atomize', name: 'Atomize(Atom One Dark)' },
    { key: 'csb-default', name: 'CSB Default' },
    { key: 'github-light', name: 'GitHub Light' },
    { key: 'webstorm-darcula', name: 'Webstorm Darcula' },
    { key: 'webstorm-dark', name: 'Webstorm Dark' },
  ],
  // baseUrl: assetsOf('themes'),
});

const App = () => {
  const ref = useRef<MonacoCodeEditorRef | null>(null);

  const [sampleData, storeSample] = useLocalStorage<SampleStorageData>(
    'monaco-sample-data',
    {},
  );
  const { locale, theme, filename } = sampleData;

  const [nextTheme, setNextTheme] = useState<NextTheme>({ loading: false });

  const input = useMemo(
    () =>
      FileSelectOptions.find((it) => it.filename === filename) ??
      FileSelectOptions[0],
    [filename],
  );

  const [options, muiTheme, themeColors] = useMemo(() => {
    const { name, colors, isDark } = revertMonacoThemeSkeleton(theme);
    return [
      { ...editorOptions, theme: name },
      createTheme(isDark, colors),
      colors,
    ];
  }, [theme]);

  const update = (frag: Partial<SampleStorageData>) =>
    storeSample((prev) => ({ ...prev, ...frag }));

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <MonacoProvider
        loader={{ baseUrl: monacoBaseUrl, query: { locale } }}
        style={{
          '--rmBackdropBg': themeColors.background,
          '--rmBorderColor': themeColors.borderColor,
          '--rmTextColor': themeColors.text,
        }}
        components={{ ProgressBar }}
      >
        <TextmateInjection
          debug={false}
          // onChange={(active) => console.log(active)}
          provider={customTmProvider}
          filter={filterTmCodeSet}
          baseUrl={assetsOf('tm')}
        />
        <LocaleInjection
          locale={locale}
          // baseUrl={assetsOf('locales')}
        />
        <ThemesInjection
          debug
          theme={options.theme}
          loadTheme={nextTheme.name}
          onLoad={(res) => {
            if (res.isSuccess) {
              const { name, isDark, colors } = res.theme;
              update({ theme: { name, isDark, colors } });
            }
            setNextTheme((prev) => ({ ...prev, loading: false }));
          }}
        />
        <TopBar>
          <LocaleSelect
            value={locale}
            onChange={(locale) => update({ locale })}
          />
          <FileSelect
            value={input}
            onChange={(it) => update({ filename: it.filename })}
          />
          <ThemeSelect
            value={options.theme}
            themes={themes}
            disabled={nextTheme.loading}
            onChange={(name) => setNextTheme({ name, loading: true })}
          />
        </TopBar>
        <MonacoCodeEditor
          ref={ref}
          input={input}
          className={cssScrollBar}
          options={options}
        />
      </MonacoProvider>
    </ThemeProvider>
  );
};

const ProgressBar = ({
  mode,
  percent,
  indeterminate,
}: MonacoPresetProgressBarProps) => {
  const isIndeterminate = percent == null || indeterminate;
  if (!mode) return null;
  return (
    <LinearProgress
      variant={isIndeterminate ? 'indeterminate' : 'determinate'}
      value={percent}
      sx={{ minWidth: 320 }}
    />
  );
};

const customTmProvider: TextmateProviderCallback = ({ language, extname }) => {
  if (extname === '.prisma') {
    return {
      url: new URL('prisma.tmLanguage.json', tmConfig('baseUrl')),
      format: 'json',
      languageId: 'prisma',
    };
  }
  if (language?.id === 'kotlin') {
    return {
      url: new URL('kotlin.tmLanguage.json', tmConfig('baseUrl')),
      format: 'json',
      languageId: language.id,
      scopeName: 'source.gradle-kotlin-dsl',
    };
  }
};

const filterTmCodeSet: TextmateFilterCodeSetCallback = (
  code: TextmateCodeSet
) => {
  return code;
};

export default App;

`.trim(),
};
