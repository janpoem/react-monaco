import { wireTmGrammars } from 'monaco-editor-textmate';
import { type IGrammarDefinition, Registry } from 'monaco-textmate';
import { loadWASM as loadOnigasmWasm } from 'onigasm';
import { useRef, useState } from 'react';
import { compare } from 'use-the-loader';
import { useEventCallback, useIsomorphicLayoutEffect } from 'usehooks-ts';
import {
  mimeTypes,
  type MonacoCodeEditorMountedParams,
  type MonacoHandleAssetParams,
  type MonacoModelCreateParams,
  type MonacoModelPrepareParams,
  type MonacoMountingParams,
  type MonacoPrepareAssetsParams,
} from '../../monaco';
import { useMonacoProvider } from '../../monaco/_context';
import hcBlack from '../themes/hc-black';
import hcLight from '../themes/hc-light';
import vs from '../themes/vs';
import vsDark from '../themes/vs-dark';
import { onigasmWasmUrlDefault, tmBaseUrlDefault } from './constants';
import { isTmSupportLanguage } from './languages';
import type {
  CurrentCodeRef,
  TextmateActiveLanguage,
  TextmateInjectionProps,
  TextmateProvider,
} from './types';

let isLoadWasm = false;

const TextmateInjection = ({
  assetKey = 'wasm/onigasm',
  assetPriority = 100,
  onigasmWasmUrl = onigasmWasmUrlDefault,
  tmBaseUrl = tmBaseUrlDefault,
  provider: providerCallback,
  onChange,
}: TextmateInjectionProps) => {
  const isInjectRef = useRef(false);
  const registryRef = useRef<Registry | null>(null);
  const codeRef = useRef<CurrentCodeRef | undefined>(undefined);

  const providersRef = useRef<Record<string, TextmateProvider>>({});
  const wireGrammarsRef = useRef<Record<string, boolean>>({});

  const { emitteryRef } = useMonacoProvider();

  const [active, setActive] = useState<TextmateActiveLanguage>({
    isActive: false,
    languageId: '',
    timestamp: Date.now(),
  });
  const activeRef = useRef(active);

  const onChangeFn = useEventCallback(onChange);

  useIsomorphicLayoutEffect(() => {
    if (isInjectRef.current) return;
    isInjectRef.current = true;
    mountTextmate();

    return () => {
      isInjectRef.current = false;
      unmountTextmate();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!compare(activeRef.current, active)) {
      activeRef.current = active;
      onChangeFn?.(active);
    }
  }, [active]);

  return null;

  function onPrepareAssets({ preloadAssets }: MonacoPrepareAssetsParams) {
    preloadAssets.push({
      key: assetKey,
      url: new URL(onigasmWasmUrl),
      priority: assetPriority,
    });
  }

  async function onAssetWasm({ task, handle }: MonacoHandleAssetParams) {
    if (!isLoadWasm && task.chunks != null) {
      isLoadWasm = true;
      const blob = new Blob([task.chunks], { type: mimeTypes.wasm });
      const url = URL.createObjectURL(blob);
      await loadOnigasmWasm(url);
    }
    // wasm 可以不用 re-mount，但 registry 必须在每次重建
    registryRef.current = newRegistry();
    handle();
  }

  function onMounting({ monaco }: MonacoMountingParams) {
    // vs-light 默认的主题是 vs ，没有 vs-light
    monaco.editor.defineTheme(vs.name, vs.data);
    monaco.editor.defineTheme(vsDark.name, vsDark.data);
    monaco.editor.defineTheme(hcLight.name, hcLight.data);
    monaco.editor.defineTheme(hcBlack.name, hcBlack.data);
  }

  function onPrepareModel(params: MonacoModelPrepareParams) {
    prepareCodeState(params);
  }

  function onCreateModel({ editor, monaco }: MonacoModelCreateParams) {
    wireCodeState(monaco, editor);
  }

  function onMounted({ editor, monaco }: MonacoCodeEditorMountedParams) {
    wireCodeState(monaco, editor);
  }

  function mountTextmate() {
    emitteryRef.current.on('prepareAssets', onPrepareAssets);
    emitteryRef.current.on(`asset:${assetKey}`, onAssetWasm);
    emitteryRef.current.on('mounting', onMounting);
    emitteryRef.current.on('prepareModel', onPrepareModel);
    emitteryRef.current.on('createModel', onCreateModel);
    emitteryRef.current.on('mounted', onMounted);
  }

  function unmountTextmate() {
    emitteryRef.current.off('prepareAssets', onPrepareAssets);
    emitteryRef.current.off(`asset:${assetKey}`, onAssetWasm);
    emitteryRef.current.off('mounting', onMounting);
    emitteryRef.current.off('prepareModel', onPrepareModel);
    emitteryRef.current.off('createModel', onCreateModel);
    emitteryRef.current.off('mounted', onMounted);
  }

  function prepareCodeState(params: MonacoModelPrepareParams) {
    const { monaco, language, extname } = params;
    let languageId: string | undefined;
    let provider: TextmateProvider | undefined;
    if (providerCallback != null) {
      provider = providerCallback(params);
    }
    if (provider != null) {
      languageId = provider.languageId;
      providersRef.current[languageId] = provider;
    } else {
      if (language != null) {
        languageId = language.id;
      } else if (extname != null) {
        const ext = (extname || '').replace(/^./gm, '').toLowerCase();
        if (isTmSupportLanguage(ext)) {
          languageId = ext;
        }
      }
    }

    const timestamp = Date.now();
    if (languageId) {
      if (language == null) {
        monaco.languages.register({
          id: languageId,
          extensions: [extname ?? ''],
        });
      }
      codeRef.current = {
        isWired: false,
        language: language,
        extname,
        languageId,
        provider,
      };
      setActive({ isActive: true, languageId, extname, timestamp });
    } else {
      codeRef.current = undefined;
      setActive({
        isActive: false,
        languageId: 'plaintext',
        extname,
        timestamp,
      });
    }
  }

  function wireCodeState(
    _monaco: typeof monaco,
    editor?: monaco.editor.IStandaloneCodeEditor,
  ) {
    if (
      _monaco == null ||
      editor == null ||
      codeRef.current == null ||
      registryRef.current == null
    ) {
      return;
    }
    const { isWired, languageId, extname, language } = codeRef.current;
    if (isWired) return;

    let scopeName = languageId;
    const ext = (extname || '').toLowerCase();

    switch (ext) {
      case '.tsx':
        scopeName = 'typescriptreact';
        break;
      case '.jsx':
        scopeName = 'javascriptreact';
        break;
    }
    switch (language?.id) {
      case 'python':
        scopeName = 'magicpython';
        break;
    }

    if (isTmSupportLanguage(scopeName) || providersRef.current[scopeName]) {
      // console.log('wireCodeState-wireTmGrammars', scopeName);
      // wireGrammarsRef.current[scopeName] = true;
      // const grammars = new Map();
      // grammars.set(languageId, scopeName);
      // // @ts-ignore typeof monacoNsps
      // wireTmGrammars(_monaco, registryRef.current, grammars, editor).then(
      //   () => {
      //     // console.log('wireTmGrammars', grammars);
      //   },
      // );
      console.log(languageId, extname, language, scopeName);
      if (!wireGrammarsRef.current[scopeName]) {
        // console.log('wireCodeState-wireTmGrammars', scopeName);
        wireGrammarsRef.current[scopeName] = true;
        const grammars = new Map();
        grammars.set(languageId, scopeName);
        // @ts-ignore typeof monacoNsps
        wireTmGrammars(_monaco, registryRef.current, grammars, editor).then(
          () => {
            // console.log('wireTmGrammars', grammars);
          },
        );
      }
    }
  }

  function newRegistry() {
    return new Registry({
      // @ts-ignore
      getGrammarDefinition: async (
        scopeName: string,
        _dependentScope: string,
      ): Promise<IGrammarDefinition | undefined> => {
        try {
          let format: IGrammarDefinition['format'] = 'json';
          let url = new URL(`${scopeName}.tmLanguage.json`, tmBaseUrl);
          if (providersRef.current[scopeName]) {
            format = providersRef.current[scopeName].format;
            url = new URL(providersRef.current[scopeName].url);
          }
          url.searchParams.set('v', '2');

          let text = await (await fetch(url, { cache: 'force-cache' })).text();
          if (format === 'json') {
            // 源文件中的 "include":"source.xxxx.xxx" 引用文件，要去掉 .source
            // yaml.1.2, yaml.embedded => yaml-1.2, yaml-embedded
            text = text.replace(
              /\"include\":\"(source\.)([^\"]+)(\#[^\"]+)?\"/gm,
              (_ma, _p1, p2, p3) => {
                let name = p2;
                if (name.startsWith('yaml.')) {
                  name = name.replace(/yaml\./, 'yaml-');
                }
                return `"include":"${name}${p3 || ''}"`;
              },
            );
          }
          return {
            format,
            content: text,
          };
        } catch (error) {
          console.warn(`Get ${scopeName}.tmLanguage.json Error`, error);
        }

        return undefined;
      },
    });
  }
};

export default TextmateInjection;
