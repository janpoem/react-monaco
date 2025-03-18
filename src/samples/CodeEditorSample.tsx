import { Box, Button, CssBaseline, ThemeProvider } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';
import {
  MonacoCodeEditor,
  type MonacoCodeEditorRef,
  MonacoPresetError,
  MonacoProvider,
} from '../monaco';
import { DtsInjection } from '../plugins/dts';
import { useLocaleSwitch } from '../plugins/hooks';
import {
  type TextmateActiveLanguage,
  TextmateInjection,
  type TextmateProviderCallback,
  tmBaseUrlDefault,
} from '../plugins/textmate';
import { createTheme } from '../theme';
import {
  FileSelect,
  FileSelectOptions,
  FootBar,
  LanguageDisplay,
  LocaleSelect,
  TopBar,
} from '../toolbar';
import { getCustomTheme, isBuiltinTheme, ThemeSelect } from './ThemeSelect';
import { useMonacoProviderProps } from './useMonacoProviderProps';

const texts = {
  [MonacoPresetError.INVALID_PRELOAD_PROCESS]: () => '无效的预加载状态',
};

const CodeEditorSample = () => {
  const mqDark = useMediaQuery('(prefers-color-scheme: dark)');
  const ref = useRef<MonacoCodeEditorRef | null>(null);

  const [locale, storeLocale] = useLocalStorage<string>('MonacoLocale', 'en');
  const [theme, storeTheme] = useLocalStorage<string | undefined>(
    'MonacoTheme',
    undefined,
  );

  const props = useMonacoProviderProps();
  const [input, setInput] = useState(FileSelectOptions[0]);

  const [activeLanguage, setActiveLanguage] = useState<
    TextmateActiveLanguage | undefined
  >();
  const [options, _setOptions] = useState({
    lineHeight: 1.5,
    tabSize: 2,
    fontSize: 14,
    fontFamily: 'var(--rm-mono-font)',
    fontLigatures: 'no-common-ligatures, slashed-zero',
    minimap: { enabled: false },
  });

  const { localeKey, recoveryEditorLastState } = useLocaleSwitch(ref, locale);

  const [customTheme, muiTheme] = useMemo(() => {
    const [_theme, colors] = getCustomTheme(theme, mqDark);
    const muiTheme = createTheme(mqDark, colors);
    return [_theme, muiTheme];
  }, [mqDark, theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <MonacoProvider
        {...props}
        locale={locale}
        injections={
          <>
            <TextmateInjection
              key={`tm_${localeKey}`}
              provider={customTextmateProvider}
              onChange={setActiveLanguage}
            />
            <DtsInjection key={`dls_${localeKey}`} />
          </>
        }
        texts={texts}
        onMounting={({ monaco }) => {
          if (!isBuiltinTheme(customTheme.name)) {
            monaco.editor.defineTheme(customTheme.name, customTheme.data);
          }
        }}
      >
        <MonacoCodeEditor
          ref={ref}
          input={input}
          options={{
            ...options,
            theme: customTheme.name,
          }}
          onMounted={({ editor }) => recoveryEditorLastState(editor)}
          topBar={
            <TopBar>
              <LocaleSelect value={locale} onChange={storeLocale} />
              <FileSelect value={input} onChange={setInput} />
              <ThemeSelect
                value={theme}
                onChange={(theme) => {
                  const [cTheme] = getCustomTheme(theme, mqDark);
                  if (!isBuiltinTheme(cTheme.name)) {
                    monaco.editor.defineTheme(cTheme.name, cTheme.data);
                  }
                  storeTheme(theme);
                }}
              />
              <Box display={'flex'} sx={{ ml: 'auto' }} gap={'4px'}>
                <Button
                  size={'medium'}
                  href={'#/theme-converter'}
                  target={'theme-converter'}
                >
                  Theme Converter
                </Button>
              </Box>
            </TopBar>
          }
          footBar={
            <FootBar>
              <LanguageDisplay
                value={activeLanguage?.languageId ?? 'Unknown'}
                tmActive={activeLanguage?.isActive}
              />
            </FootBar>
          }
        />
      </MonacoProvider>
    </ThemeProvider>
  );
};

const customTextmateProvider: TextmateProviderCallback = ({ extname }) => {
  if (extname === '.prisma') {
    return {
      url: new URL('prisma.tmLanguage.json', tmBaseUrlDefault),
      format: 'json',
      languageId: 'prisma',
    };
  }
};

export default CodeEditorSample;
