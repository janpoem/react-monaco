import './App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { unmountRemote } from '@zenstone/ts-utils/remote';
import type { Position } from 'monaco-editor';
import { useMemo, useRef, useState } from 'react';
import {
  useIsomorphicLayoutEffect,
  useLocalStorage,
  useMediaQuery,
} from 'usehooks-ts';
import {
  MonacoCodeEditor,
  type MonacoCodeEditorRef,
  MonacoProvider,
  MonacoReadyState,
} from './monaco';
import { createMonacoProviderProps, monacoCodeEditorOptions } from './preset';
import { createTheme } from './theme';
import { getCustomTheme, isDarkMonacoTheme, setupTheme } from './themes';
import {
  FileSelect,
  FileSelectOptions,
  FootBar,
  LanguageDisplay,
  LocaleSelect,
  ThemeSelect,
  TopBar,
} from './toolbar';

const App = () => {
  const ref = useRef<MonacoCodeEditorRef | null>(null);

  const mqDark = useMediaQuery('(prefers-color-scheme: dark)');

  const [monacoTheme, setMonacoTheme] = useLocalStorage<string | undefined>(
    'MonacoTheme',
    undefined,
  );

  const [locale, setLocale] = useLocalStorage<string>('MonacoLocale', 'en');
  const localeRef = useRef(locale);

  const [assets, _setAssets] = useState(() => createMonacoProviderProps());
  const [input, setInput] = useState(FileSelectOptions[0]);
  const [language, setLanguage] = useState('');

  const lastPositionRef = useRef<Position | null>(null);
  const lastScrollRef = useRef<monaco.editor.INewScrollPosition | undefined>(
    undefined,
  );

  useIsomorphicLayoutEffect(() => {
    if (ref.current == null || ref.current.editorRef.current == null) return;
    const { editorRef, modelRef, assetsIds, inputRef, setReadyState } =
      ref.current;

    if (localeRef.current !== locale) {
      assetsIds.length && assetsIds.forEach(removeAsset);
      // @ts-ignore
      // biome-ignore lint/performance/noDelete: <explanation>
      delete window.monaco;
      //
      inputRef.current.source = editorRef.current?.getValue() || '';
      // editor state mark
      markEditorLastState(editorRef.current);
      modelRef.current?.dispose();
      editorRef.current?.dispose();
      setReadyState(MonacoReadyState.Init);
      localeRef.current = locale;
    }
  }, [locale]);

  const [monacoOptions, muiTheme, customTheme] = useMemo(() => {
    let mTheme = monacoTheme;
    let isDark = mqDark;
    if (mTheme == null || !mTheme) {
      mTheme = mqDark ? 'vs-dark' : 'vs-light';
    } else {
      isDark = isDarkMonacoTheme(mTheme);
    }
    const customTheme = getCustomTheme(mTheme);
    if (customTheme != null) {
      isDark = !!customTheme.isDark;
    }
    const _muiTheme = createTheme(isDark);

    return [
      {
        ...monacoCodeEditorOptions,
        theme: mTheme,
      },
      _muiTheme,
      customTheme,
    ];
  }, [monacoTheme, mqDark]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <MonacoProvider {...assets} onMounting={onMount} locale={locale}>
        <TopBar>
          <LocaleSelect value={locale} onChange={setLocale} />
          <FileSelect value={input} onChange={setInput} />
          <ThemeSelect value={monacoTheme} onChange={setMonacoTheme} />
        </TopBar>
        <MonacoCodeEditor
          ref={ref}
          input={input}
          options={monacoOptions}
          onCreateModel={(model) => setLanguage(model.getLanguageId())}
          onCreateEditor={(editor) => {
            if (lastPositionRef.current != null) {
              editor.focus();
              editor.setPosition(lastPositionRef.current);
              lastPositionRef.current = null;
            }
            if (lastScrollRef.current != null) {
              editor.setScrollPosition(lastScrollRef.current);
              lastScrollRef.current = undefined;
            }
          }}
        />
        <FootBar>
          <LanguageDisplay value={language} />
        </FootBar>
      </MonacoProvider>
    </ThemeProvider>
  );

  function onMount(_monaco: typeof monaco) {
    _monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    _monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: _monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      target: _monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution:
        _monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: _monaco.languages.typescript.ModuleKind.ESNext,
      esModuleInterop: true,
      noEmit: true,
    });
    setupTheme(_monaco, customTheme);
  }

  function markEditorLastState(editor?: monaco.editor.IStandaloneCodeEditor) {
    if (editor == null) return;

    lastPositionRef.current = editor.getPosition();
    lastScrollRef.current = {
      scrollLeft: editor.getScrollLeft(),
      scrollTop: editor.getScrollTop(),
    };
  }

  function removeAsset(id: string) {
    unmountRemote(id);
  }
};

export default App;
