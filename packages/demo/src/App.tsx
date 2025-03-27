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
  tmBaseUrlDefault,
} from '@react-monaco/plugin-textmate';
import { useMemo, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { createTheme } from './theme';
import { FileSelect, FileSelectOptions, LocaleSelect, TopBar } from './toolbar';
import type { SampleStorageData } from './types';

const baseUrl = 'https://static.summererp.com/misc/monaco-editor/0.52.2/';

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

const cssScrollBar = css`
  .scrollbar .slider {
    border-radius: 10px;
  }
  .scrollbar.vertical {
    padding-top: 2px;
    .slider {
      margin-left: 1px;
    }
  }
`;

const App = () => {
  const ref = useRef<MonacoCodeEditorRef | null>(null);

  const [sampleData, storeSample] = useLocalStorage<SampleStorageData>(
    'monaco-sample-data',
    {},
  );
  const { locale, theme, filename } = sampleData;

  const input = useMemo(
    () =>
      FileSelectOptions.find((it) => it.filename === filename) ??
      FileSelectOptions[0],
    [filename],
  );

  const [options, muiTheme, themeColors] = useMemo(() => {
    const { name, colors, isDark } = revertMonacoThemeSkeleton(
      'atom-material-theme',
    );
    console.log(name, colors, isDark);
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
        loader={{ baseUrl, query: { locale } }}
        style={{
          '--rmBackdropBg': themeColors.background,
          '--rmBorderColor': themeColors.borderColor,
          '--rmTextColor': themeColors.text,
        }}
        components={{ ProgressBar }}
        texts={{
          [MonacoLoaderProcess.Initializing]: 'Monaco is running...',
          [MonacoLoaderProcess.Loading]: ({
            isFetchDownload,
            percent,
          }: DownloadingParams) =>
            `Pulling monaco assets ${isFetchDownload ? ` ${percent}%` : ''}...`,
          [MonacoLoaderProcess.Preparing]: 'Going to fly...',
        }}
      >
        <TextmateInjection
          debug={false}
          // onChange={(active) => console.log(active)}
          provider={customTmProvider}
          filter={filterTmCodeSet}
        />
        <LocaleInjection
          locale={locale}
          baseUrl={`${location.origin}/assets/locales/`}
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
      url: new URL('prisma.tmLanguage.json', tmBaseUrlDefault),
      format: 'json',
      languageId: 'prisma',
    };
  }
  if (language?.id === 'kotlin') {
    return {
      url: new URL('kotlin.tmLanguage.json', `${location.origin}/tm/`),
      format: 'json',
      languageId: language.id,
      scopeName: 'source.gradle-kotlin-dsl',
    };
  }
};

const filterTmCodeSet: TextmateFilterCodeSetCallback = (
  code: TextmateCodeSet,
) => {
  return code;
};

export default App;
