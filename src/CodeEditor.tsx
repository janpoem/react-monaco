import { CssBaseline, ThemeProvider } from '@mui/material';
import { isNumber } from '@zenstone/ts-utils/number';
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
import type { Biome } from './plugins/biome';
import BiomePlugin from './plugins/biome/BiomePlugin';
import { createMonacoProviderProps, monacoCodeEditorOptions } from './preset';
import { createTheme } from './theme';
import {
  getCustomTheme,
  getThemeColor,
  isDarkMonacoTheme,
  setupTheme,
} from './themes';
import {
  FileSelect,
  FileSelectOptions,
  FootBar,
  LanguageDisplay,
  LocaleSelect,
  ThemeSelect,
  TopBar,
} from './toolbar';

const CodeEditor = () => {
  const ref = useRef<MonacoCodeEditorRef | null>(null);
  const monacoRef = useRef<typeof monaco | undefined>(undefined);
  const biomeRef = useRef<Biome | undefined>(undefined);

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

  const [monacoOptions, muiTheme, customTheme, themeMainColor] = useMemo(() => {
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
    const themeMainColor = getThemeColor(mTheme, isDark);
    const _muiTheme = createTheme(isDark, themeMainColor);

    return [
      {
        ...monacoCodeEditorOptions,
        theme: mTheme,
      },
      _muiTheme,
      customTheme,
      themeMainColor,
    ];
  }, [monacoTheme, mqDark]);

  const biomeEnable = useMemo(() => {
    return ['javascript', 'typescript'].includes(language);
  }, [language]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <MonacoProvider {...assets} onMounting={onMount} locale={locale}>
        <MonacoCodeEditor
          ref={ref}
          input={input}
          options={monacoOptions}
          onCreateModel={(model) => setLanguage(model.getLanguageId())}
          onCreateEditor={recoveryEditorLastState}
          style={{
            outlineColor: themeMainColor.primary,
          }}
          topBar={
            <TopBar>
              <LocaleSelect
                value={locale}
                onChange={(v) => {
                  setLocale(v);
                }}
              />
              <FileSelect value={input} onChange={setInput} />
              <ThemeSelect
                value={monacoTheme}
                onChange={onChangeDelegation(setMonacoTheme)}
              />
            </TopBar>
          }
          footBar={
            <FootBar>
              <LanguageDisplay value={language} />
              <BiomePlugin enable={biomeEnable} onLoad={onBiomeLoad} />
            </FootBar>
          }
        />
      </MonacoProvider>
    </ThemeProvider>
  );

  function onMount(_monaco?: typeof monaco) {
    if (_monaco == null) return;
    monacoRef.current = monaco;
    _monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      // noSemanticValidation: false,
      // noSyntaxValidation: false,
      // noSyntaxValidation: true,
    });

    _monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: _monaco.languages.typescript.JsxEmit.ReactJSX,
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

    fetchDts([
      'react',
      'react/jsx-runtime',
      '@mui/material',
      'usehooks-ts',
      '@zenstone/ts-utils/remote',
    ]);

    fetch('https://dts.kephp.com/pkg/react/').then((resp) =>
      resp.json().then((json) =>
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `declare module 'react' {
${json.source}
}`,
          'react.d.ts',
        ),
      ),
    );
  }

  function markEditorLastState(editor?: monaco.editor.IStandaloneCodeEditor) {
    if (editor == null) return;

    lastPositionRef.current = editor.getPosition();
    lastScrollRef.current = {
      scrollLeft: editor.getScrollLeft(),
      scrollTop: editor.getScrollTop(),
    };
  }

  function recoveryEditorLastState(
    editor?: monaco.editor.IStandaloneCodeEditor,
    delay?: number,
  ) {
    if (editor == null) return;
    const fn = () => {
      if (lastPositionRef.current != null) {
        editor.focus();
        editor.setPosition(lastPositionRef.current);
        lastPositionRef.current = null;
      }
      if (lastScrollRef.current != null) {
        editor.setScrollPosition(lastScrollRef.current);
        lastScrollRef.current = undefined;
      }
    };
    if (isNumber(delay) && delay > 0) {
      setTimeout(fn, delay);
    } else {
      fn();
    }
  }

  function onChangeDelegation<V>(setValue: (value: V) => void) {
    return (value: V) => {
      markEditorLastState(ref.current?.editorRef.current);
      setValue(value);
      recoveryEditorLastState(ref.current?.editorRef.current, 100);
    };
  }

  function removeAsset(id: string) {
    unmountRemote(id);
  }

  function fetchDts(libs: string[]) {
    if (monacoRef.current == null) return;
    for (const lib of libs) {
      fetch(`https://dts.kephp.com/pkg/${lib}`).then((resp) =>
        resp.json().then((json) => {
          monacoRef.current?.languages.typescript.typescriptDefaults.addExtraLib(
            `declare module '${lib}' {
${json.source}
}`,
            `${lib}.d.ts`,
          );
        }),
      );
    }
  }

  function onBiomeLoad(biome: Biome) {
    biomeRef.current = biome;

    biome.applyConfiguration('Test', {
      formatter: {
        enabled: true,
        formatWithErrors: false,
        indentStyle: 'space',
        indentWidth: 2,
        lineEnding: 'lf',
        lineWidth: 80,
        attributePosition: 'auto',
      },
      javascript: {
        formatter: {
          semicolons: 'always',
          quoteStyle: 'single',
        },
      },
    });

    if (monacoRef.current == null) return;

    monacoRef.current.languages.registerDocumentFormattingEditProvider(
      'typescript',
      {
        provideDocumentFormattingEdits(
          model: monaco.editor.ITextModel,
          _options: monaco.languages.FormattingOptions,
          _token: monaco.CancellationToken,
        ): monaco.languages.ProviderResult<monaco.languages.TextEdit[]> {
          return [
            {
              text: biome.formatContent('Test', model.getValue(), {
                filePath: input.filename,
              }).content,
              range: model.getFullModelRange(),
            },
          ];
        },
      },
    );
  }
};

export default CodeEditor;
