import {
  BaseEventsDelegator,
  type MonacoEventsDefinition,
} from '@react-monaco/core';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { type IGrammarDefinition, Registry } from 'monaco-textmate';
import { loadWASM as loadOnigasmWasm } from 'onigasm';
import { onigasmWasmUrlDefault, tmBaseUrlDefault } from './constants';
import { isTmSupportLanguage } from './languages';
import type {
  CurrentCode,
  TextmateInjectionProps,
  TextmateProvider,
} from './types';

let isLoadWasm = false;

export class TextmateEventsDelegator extends BaseEventsDelegator<MonacoEventsDefinition> {
  wasmKey = 'wasm/onigasm';

  registry?: Registry;

  wireGrammars: Record<string, boolean> = {};

  providers: Record<string, TextmateProvider> = {};

  code?: CurrentCode;

  constructor(public readonly props: TextmateInjectionProps) {
    super();
    this.register('prepareAssets')
      .register('onAssetWasm', `asset:${this.wasmKey}`)
      .register('mounting')
      .register('prepareModel')
      .register('createModel')
      .register('editor');
  }

  get tmBaseUrl() {
    return this.props.tmBaseUrl || tmBaseUrlDefault;
  }

  get wasmAsset() {
    return {
      key: this.wasmKey,
      url: new URL(this.props.onigasmWasmUrl || onigasmWasmUrlDefault),
      priority: 100,
      type: 'wasm',
    };
  }

  prepareAssets = ({
    preloadAssets,
  }: MonacoEventsDefinition['prepareAssets']) => {
    preloadAssets.push(this.wasmAsset);
  };

  onAssetWasm = async ({ task, handle }: MonacoEventsDefinition['asset']) => {
    if (!isLoadWasm && task.chunks != null) {
      try {
        isLoadWasm = true;
        // console.log(task.chunks.buffer);
        // const blob = new Blob([task.chunks], { type: mimeTypes.wasm });
        // const url = URL.createObjectURL(blob);
        await loadOnigasmWasm(task.chunks.buffer as ArrayBuffer);
      } catch (e) {}
    }
    this.registry = this.newRegistry();
    handle();
  };

  mounting = () => {
    if (typeof this.options.mounting === 'function') {
      this.options.mounting();
    }
  };

  prepareModel = (params: MonacoEventsDefinition['prepareModel']) => {
    const { provider: providerCallback, onChange } = this.props;
    const { monaco, language, extname } = params;
    let languageId: string | undefined;
    let provider: TextmateProvider | undefined;
    if (providerCallback != null) {
      provider = providerCallback(params);
    }
    if (provider != null) {
      languageId = provider.languageId;
      this.providers[languageId] = provider;
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
      this.code = {
        isWired: false,
        language: language,
        extname,
        languageId,
        provider,
      };
      onChange?.({ isActive: true, languageId, extname, timestamp });
      // setActive({ isActive: true, languageId, extname, timestamp });
    } else {
      this.code = undefined;
      onChange?.({
        isActive: false,
        languageId: 'plaintext',
        extname,
        timestamp,
      });
    }
  };

  createModel = ({ monaco, editor }: MonacoEventsDefinition['createModel']) =>
    this.wireCodeState(monaco, editor);

  editor = ({ monaco, editor }: MonacoEventsDefinition['editor']) =>
    this.wireCodeState(monaco, editor);

  wireCodeState = (
    _monaco: typeof monaco,
    editor?: monaco.editor.IStandaloneCodeEditor,
  ) => {
    if (
      _monaco == null ||
      editor == null ||
      this.code == null ||
      this.registry == null
    ) {
      return;
    }

    const { isWired, languageId, extname, language } = this.code;
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

    if (isTmSupportLanguage(scopeName) || this.providers[scopeName]) {
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
      if (!this.wireGrammars[scopeName]) {
        // console.log('wireCodeState-wireTmGrammars', scopeName);
        this.wireGrammars[scopeName] = true;
        const grammars = new Map();
        grammars.set(languageId, scopeName);
        // @ts-ignore typeof monacoNsps
        wireTmGrammars(_monaco, this.registry, grammars, editor).then(() => {
          // console.log('wireTmGrammars', grammars);
        });
      }
    }
  };

  newRegistry = () =>
    new Registry({
      // @ts-ignore
      getGrammarDefinition: async (
        scopeName: string,
        _dependentScope: string,
      ): Promise<IGrammarDefinition | undefined> => {
        try {
          let format: IGrammarDefinition['format'] = 'json';
          let url = new URL(`${scopeName}.tmLanguage.json`, this.tmBaseUrl);
          if (this.providers[scopeName]) {
            format = this.providers[scopeName].format;
            url = new URL(this.providers[scopeName].url);
          }
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
