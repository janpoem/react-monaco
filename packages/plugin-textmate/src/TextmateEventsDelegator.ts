import {
  BaseEventsDelegator,
  type MonacoEventsDefinition,
} from '@react-monaco/core';
import {
  loadWASM as loadVSCodeOnigasmWasm,
  OnigScanner,
  OnigString,
} from 'vscode-oniguruma';
import {
  type IOnigLib,
  type IRawGrammar,
  parseRawGrammar,
  Registry as VSCodeRegistry,
} from 'vscode-textmate';
import { onigasmWasmUrlDefault, tmBaseUrlDefault } from './constants';
import { isTmSupportLanguage } from './languages';
import { wireTmGrammars } from './monaco-editor-textmate';
import type {
  TextmateCodeSet,
  TextmateInjectionProps,
  TextmateProvider,
  TextmateScope,
} from './types';

let isLoadWasm = false;

export class TextmateEventsDelegator extends BaseEventsDelegator<MonacoEventsDefinition> {
  wasmKey = 'wasm/onigasm';

  wireGrammars: Record<string, boolean> = {};

  providers: Record<string, TextmateProvider> = {};

  code?: TextmateCodeSet;

  vsRegistry?: VSCodeRegistry;

  vsOnigurumaLib?: Promise<IOnigLib>;

  constructor(public readonly props: TextmateInjectionProps) {
    super();
    this.register('prepareAssets')
      .register('onAssetVSCodeWasm', `asset:${this.wasmKey}`)
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

  onAssetVSCodeWasm = async ({
    task,
    handle,
  }: MonacoEventsDefinition['asset']) => {
    if (!isLoadWasm && task.chunks != null) {
      try {
        isLoadWasm = true;
        await loadVSCodeOnigasmWasm(task.chunks.buffer as ArrayBuffer);
        this.vsOnigurumaLib = Promise.resolve({
          createOnigScanner: (patterns) => new OnigScanner(patterns),
          createOnigString: (s) => new OnigString(s),
        });
        this.isDebug && console.log('vscode-oniguruma wasm loaded');
      } catch (err) {
        console.error('load vscode-oniguruma wasm error', err);
      }
    }
    if (this.vsOnigurumaLib == null) {
      console.error('vscode-oniguruma lib instance is null');
    } else {
      this.vsRegistry = this.newVsCodeRegistry(this.vsOnigurumaLib);
    }
    handle();
  };

  mounting = () => {
    if (typeof this.options.mounting === 'function') {
      this.options.mounting();
    }
  };

  prepareModel = (params: MonacoEventsDefinition['prepareModel']) => {
    const { provider: providerCallback, onChange } = this.props;
    const { language, extname } = params;
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

    this.code = this.createCodeSet(languageId, params, provider);
  };

  // 基于 prepareModel 派生，用于优先创建对应的 Code
  createCodeSet = (
    languageId: string | undefined,
    params: MonacoEventsDefinition['prepareModel'],
    provider?: TextmateProvider,
  ): TextmateCodeSet | undefined => {
    const { onChange, filter } = this.props;
    const timestamp = Date.now();
    const { monaco, language } = params;
    let isActive = false;
    const extname = (params.extname || '').toLowerCase();
    if (!languageId) {
      onChange?.({ isActive, languageId: 'plaintext', extname, timestamp });
      return undefined;
    }

    isActive = true;
    // 不存在的 language ，优先朝 monaco 注册语言
    if (language == null) {
      monaco.languages.register({
        id: languageId,
        extensions: [extname ?? ''],
      });
    }

    onChange?.({ isActive, languageId, extname, timestamp });
    const code = {
      ...this.selectTextmateScope(languageId, extname, language, provider),
      isWired: false,
      language,
      extname,
      languageId,
      provider: this.providers[languageId],
    };
    if (filter) {
      return filter(code);
    }
    return code;
  };

  /**
   * 基于 vscode 新规范，形成正规的 scopeName 和 tmName
   * @param languageId
   * @param extname
   * @param language
   * @param provider
   */
  selectTextmateScope = (
    languageId: string,
    extname: string,
    language?: monaco.languages.ILanguageExtensionPoint,
    provider?: TextmateProvider,
  ): TextmateScope => {
    let tmName = languageId;
    let scopeName = `source${extname}`;
    switch (extname) {
      case '.tsx':
        tmName = 'typescriptreact';
        break;
      case '.jsx':
        tmName = 'javascriptreact';
        break;
    }
    switch (language?.id) {
      case 'python':
        tmName = 'magicpython';
        scopeName = 'source.python';
        break;
      case 'scss':
        scopeName = 'source.css.scss';
        break;
      case 'rust':
        scopeName = 'source.rust';
        break;
    }
    if (provider?.scopeName) {
      scopeName = provider.scopeName;
    }
    return { scopeName, tmName };
  };

  createModel = ({ monaco, editor }: MonacoEventsDefinition['createModel']) =>
    this.wireVsCodeState(monaco, editor);

  editor = ({ monaco, editor }: MonacoEventsDefinition['editor']) =>
    this.wireVsCodeState(monaco, editor);

  wireVsCodeState = (
    _monaco: typeof monaco,
    editor?: monaco.editor.IStandaloneCodeEditor,
  ) => {
    if (
      _monaco == null ||
      editor == null ||
      this.code == null ||
      this.vsRegistry == null
    ) {
      return;
    }
    const { isWired, languageId, scopeName, tmName, language } = this.code;
    if (isWired) return;

    if (isTmSupportLanguage(tmName) || this.providers[languageId]) {
      this.isDebug &&
        console.log(`wireGrammars: ${languageId}/${scopeName}/${tmName} start`);
      if (!this.wireGrammars[tmName]) {
        this.wireGrammars[tmName] = true;
        const grammars = new Map();
        grammars.set(languageId, scopeName);
        // @ts-ignore typeof monacoNsps
        wireTmGrammars(_monaco, this.vsRegistry, grammars, editor).then(() => {
          this.isDebug &&
            console.log(
              `wireGrammars: ${languageId}/${scopeName}/${tmName} done`,
            );
        });
      }
    }
  };

  newVsCodeRegistry = (onigLib: Promise<IOnigLib>) =>
    new VSCodeRegistry({
      onigLib,
      loadGrammar: async (
        scopeName: string,
      ): Promise<IRawGrammar | undefined | null> => {
        if (this.code == null) return null;
        try {
          let url = new URL(
            `${this.code.tmName}.tmLanguage.json`,
            this.tmBaseUrl,
          );
          if (this.code.provider != null) {
            url = new URL(this.code.provider.url);
          }
          this.isDebug &&
            console.log(
              `loadGrammar: load ${this.code.languageId}:${scopeName} grammar from "${url}"`,
            );
          const resp = await fetch(url, { cache: 'force-cache' });
          const text = await resp.text();
          this.isDebug &&
            console.log(
              `loadGrammar: load ${this.code.languageId}:${scopeName} grammar success, content size: ${text.length}`,
            );
          // vscode-textmate 新版本，基于文件名来判断是  json 合适 plist
          return parseRawGrammar(text, url.toString());
        } catch (err) {
          console.log(`load ${scopeName} grammar error`, err);
        }
        return null;
      },
    });
}
