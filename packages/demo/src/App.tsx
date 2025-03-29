import { css } from '@emotion/css';
import Settings from '@mui/icons-material/Settings';
import {
  Box,
  Button,
  CssBaseline,
  LinearProgress,
  ThemeProvider,
} from '@mui/material';
import {
  MonacoCodeEditor,
  type MonacoCodeEditorProps,
  type MonacoCodeEditorRef,
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
import type { TextmateActiveLanguage } from '../../../src/plugins/textmate';
import ThemeConverter from './experimental/theme-converter';
import { TypescriptInjection } from './experimental/typescript';
import { assetsOf } from './presets';
import { createTheme } from './theme';
import githubLight from './thtmes/github-light';
import {
  FileSelect,
  FileSelectOptions,
  FootBar,
  LanguageDisplay,
  LocaleSelect,
  ThemeSelect,
  TopBar,
} from './toolbar';
import EditOptions from './toolbar/EditOptions';
import type { NextTheme, SampleStorageData } from './types';

const editorOptions: MonacoCodeEditorProps['options'] = {
  // seems the better in windows
  lineHeight: 1.65,
  tabSize: 2,
  fontSize: 14.5,
  fontWeight: '300',
  fontFamily: 'var(--font-mono)',
  fontLigatures: 'no-common-ligatures, slashed-zero',
  letterSpacing: 0.025,
  minimap: { enabled: false },
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

const { themes, ThemesInjection } = createThemesPlugin({
  themes: [
    { key: 'atom-material-theme', name: 'Atom Material Theme' },
    { key: 'atom-one-light', name: 'Atom One Light' },
    { key: 'atomize', name: 'Atomize(Atom One Dark)' },
    { key: 'csb-default', name: 'CSB Default' },
    { key: 'github-light', name: 'GitHub Light', theme: githubLight },
    {
      key: 'webstorm-darcula',
      name: 'Webstorm Darcula',
      url: new URL('webstorm-darcula.json', assetsOf('themes')),
    },
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
  const { locale, theme, filename, customOptions } = sampleData;

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
      { ...editorOptions, ...(customOptions ?? {}), theme: name },
      createTheme(isDark, colors),
      colors,
    ];
  }, [theme, customOptions]);

  const [activeLanguage, setActiveLanguage] = useState<
    TextmateActiveLanguage | undefined
  >();

  const [openThemeConverter, setOpenThemeConverter] = useState(false);
  const [openEditOptions, setOpenEditOptions] = useState(false);

  const update = (frag: Partial<SampleStorageData>) =>
    storeSample((prev) => ({ ...prev, ...frag }));

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ThemeConverter.Dialog
        open={openThemeConverter}
        onClose={() => setOpenThemeConverter(false)}
      />
      <EditOptions
        open={openEditOptions}
        onClose={() => setOpenEditOptions(false)}
        onSubmit={(nextOptions) => {
          update({ customOptions: nextOptions });
        }}
        options={customOptions ?? editorOptions}
      />
      <MonacoProvider
        loader={{ query: { locale } }}
        style={{
          '--rmBackdropBg': themeColors.background,
          '--rmBorderColor': themeColors.borderColor,
          '--rmTextColor': themeColors.text,
        }}
        components={{ ProgressBar }}
        texts={{
          tmStatus: ({ active }) =>
            `Textmate ${active ? 'active' : 'inactive'}`,
        }}
      >
        <TextmateInjection
          debug
          onChange={setActiveLanguage}
          provider={tmProvider}
          filter={tmFilter}
        />
        <LocaleInjection debug locale={locale} />
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
        <TypescriptInjection />
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
          <Box display={'flex'} sx={{ ml: 'auto' }} gap={'4px'}>
            <Button size={'medium'} onClick={() => setOpenThemeConverter(true)}>
              Theme Converter
            </Button>
            <Button
              sx={{ minWidth: 'auto' }}
              onClick={() => setOpenEditOptions(true)}
            >
              <Settings />
            </Button>
          </Box>
        </TopBar>
        <MonacoCodeEditor
          ref={ref}
          input={input}
          className={cssScrollBar}
          options={options}
        />
        <FootBar>
          <LanguageDisplay
            value={activeLanguage?.languageId ?? 'plaintext'}
            tmActive={activeLanguage?.isActive}
          />
        </FootBar>
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
      key={isIndeterminate ? 'indeterminate' : 'determinate'}
      variant={isIndeterminate ? 'indeterminate' : 'determinate'}
      value={percent}
      sx={{ minWidth: 320 }}
    />
  );
};

const tmProvider: TextmateProviderCallback = ({ language, extname }) => {
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

const tmFilter: TextmateFilterCodeSetCallback = (code: TextmateCodeSet) => {
  return code;
};

export default App;
