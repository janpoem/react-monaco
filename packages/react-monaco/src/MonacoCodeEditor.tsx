import compare from 'just-compare';
import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type RefObject,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { useEventCallback, useIsomorphicLayoutEffect } from 'usehooks-ts';
import { MonacoReadyState } from './constants';
import {
  useMonacoDebug,
  useMonacoPreset,
  useMonacoTransientState,
} from './hooks';
import { type MonacoContextType, useMonaco } from './MonacoProvider';
import { cssVerticalContainer, presetCls } from './styles';
import type {
  MonacoCodeInput,
  MonacoEditorDisposeParams,
  MonacoEditorFocusAndBlurParams,
  MonacoEditorMountParams,
  MonacoEditorPrepareParams,
  MonacoFileCodeInput,
  MonacoInputChangeParams,
  MonacoModelChangeParams,
  MonacoModelCreateParams,
  MonacoModelDisposeParams,
  MonacoModelPrepareParams,
} from './types';
import { extractExtname, isFileInput } from './utils';

export type MonacoCodeEditorRef = MonacoContextType & {
  containerRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<MonacoCodeInput>;
  modelRef: RefObject<monaco.editor.ITextModel | undefined>;
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | undefined>;
};

export type MonacoCodeEditorProps = {
  input: MonacoCodeInput;
  debug?: boolean;
  options?: Partial<
    Omit<monaco.editor.IStandaloneEditorConstructionOptions, 'value' | 'model'>
  >;
  className?: string;
  style?: CSSProperties;
  onPrepareModel?: (params: MonacoModelPrepareParams) => void;
  onCreateModel?: (params: MonacoModelCreateParams) => void;
  onChangeModel?: (params: MonacoModelChangeParams) => void;
  onDisposeModel?: (params: MonacoModelDisposeParams) => void;
  onChangeInput?: (params: MonacoInputChangeParams) => void;
  onPrepareEditor?: (params: MonacoEditorPrepareParams) => void;
  onMountEditor?: (params: MonacoEditorMountParams) => void;
  onDisposeEditor?: (params: MonacoEditorDisposeParams) => void;
  onFocus?: (params: MonacoEditorFocusAndBlurParams) => void;
  onBlur?: (params: MonacoEditorFocusAndBlurParams) => void;
};

export const MonacoCodeEditor = forwardRef(
  (
    {
      input,
      debug: isDebug,
      options,
      className,
      style,
      onPrepareModel,
      onCreateModel,
      onChangeModel,
      onDisposeModel,
      onChangeInput,
      onPrepareEditor,
      onMountEditor,
      onDisposeEditor,
      onFocus,
      onBlur,
    }: MonacoCodeEditorProps,
    ref: ForwardedRef<MonacoCodeEditorRef>,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef(input);
    const modelRef = useRef<monaco.editor.ITextModel | undefined>(undefined);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | undefined>(
      undefined,
    );
    const isFocusRef = useRef<boolean>(false);
    const optionsRef = useRef(options);

    const { debug } = useMonacoDebug(['CodeEditor', 'color: yellow'], isDebug);

    const onPrepareModelFn = useEventCallback(onPrepareModel);
    const onCreateModelFn = useEventCallback(onCreateModel);
    const onChangeModelFn = useEventCallback(onChangeModel);
    const onDisposeModelFn = useEventCallback(onDisposeModel);
    const onChangeInputFn = useEventCallback(onChangeInput);

    const onPrepareEditorFn = useEventCallback(onPrepareEditor);
    const onMountEditorFn = useEventCallback(onMountEditor);
    const onDisposeEditorFn = useEventCallback(onDisposeEditor);
    const onFocusFn = useEventCallback(onFocus);
    const onBlurFn = useEventCallback(onBlur);

    const { imaging } = useMonacoTransientState();

    const { getText } = useMonacoPreset();
    const monacoCtx = useMonaco();
    const {
      emitterRef,
      readyState,
      setReadyState,
      setError,
      refMonaco,
      findLanguage,
    } = monacoCtx;

    useImperativeHandle(
      ref,
      () => ({
        ...monacoCtx,
        containerRef,
        inputRef,
        modelRef,
        editorRef,
      }),
      [monacoCtx],
    );

    const cls = useMemo(
      () =>
        [
          'monaco-editor',
          presetCls.codeEditor,
          cssVerticalContainer({ ...style, height: 0, overflow: 'hidden' }),
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [style, className],
    );

    useIsomorphicLayoutEffect(() => {
      if (readyState !== MonacoReadyState.Mounting) return;
      try {
        mountEditor();
        setReadyState(MonacoReadyState.Mounted);
      } catch (error) {
        setError(error);
      }
    }, [readyState]);

    useIsomorphicLayoutEffect(() => {
      if (editorRef.current == null) return;
      if (!compare(optionsRef.current, options)) {
        optionsRef.current = options;
        debug('update editor options', options);
        // @ts-ignore
        editorRef.current.updateOptions(options);
      }
    }, [options]);

    useIsomorphicLayoutEffect(() => {
      if (editorRef.current == null) return;
      debug('input changed');
      onChangeInputFn?.({ input, monaco });
      emitterRef.current?.emit('changeInput', { input, monaco });
      if (isFileInput(input)) {
        try {
          modelRef.current = createFileCodeModel(input);
          editorRef.current.setModel(modelRef.current);
        } catch (error) {
          setError(error);
        }
      }
    }, [input]);

    if (readyState === MonacoReadyState.Prepare) return;

    return <div ref={containerRef} className={cls} />;

    function createFileCodeModel(input: MonacoFileCodeInput) {
      const _monaco = refMonaco();
      if (!isFileInput(input)) {
        throw new Error(getText('ERR_INVALID_CODE_INPUT'));
      }

      if (input.model) {
        debug(`reuse '${input.model.getLanguageId()}' model`, {
          model: input.model,
        });
        return input.model;
      }

      const { filename, source, uri: iUri } = input;
      // 有一些特定的源代码，如 JSX/TSX ，必须基于 uri 才有效能激活
      const uri = iUri ? _monaco.Uri.parse(iUri) : undefined;
      const extname = extractExtname(filename);
      const language = findLanguage(extname);

      let languageId = language?.id;
      if (!languageId) {
        // 尝试通过 extname 虚构一个 language
        languageId = extname?.replace('.', '').toLowerCase();
      }

      // 如果指定了 uri ，需要检查全局 monaco 是否已经持有该 uri 的 model
      if (uri != null) {
        const existingModel = _monaco.editor.getModel(uri);
        if (existingModel != null) {
          const p = {
            input,
            language,
            extname,
            uri,
            monaco: _monaco,
            editor: editorRef.current,
            model: existingModel,
          };
          onDisposeModelFn?.(p);
          emitterRef.current?.emit('disposeModel', p);
          existingModel.dispose();
          debug(`dispose model by uri ${uri.toString()}`);
        }
      }

      const params = {
        input,
        language,
        extname,
        uri,
        monaco: _monaco,
        editor: editorRef.current,
      };

      onPrepareModelFn?.(params);
      emitterRef.current?.emit('prepareModel', params);

      const model = _monaco.editor.createModel(source || '', languageId, uri);
      debug(`create '${languageId}' model`, input);

      model.onDidChangeContent((event) => {
        onChangeModelFn?.({ ...params, model, event });
        emitterRef.current?.emit('changeModel', { ...params, model, event });
      });
      onCreateModelFn?.({ ...params, model });
      emitterRef.current?.emit('createModel', { ...params, model });
      return model;
    }

    function mountEditor() {
      const _monaco = refMonaco();
      if (containerRef.current == null) {
        throw new Error(getText('ERR_NO_CONTAINER'));
      }

      const image = imaging({
        editor: editorRef.current,
        model: modelRef.current,
      });

      const { source, scroll, position } = image;
      const beforeParams = {
        mode: 'code',
        monaco: _monaco,
        editor: editorRef.current,
        model: modelRef.current,
        image,
      };

      onPrepareEditorFn?.(beforeParams);
      emitterRef.current?.emit('prepareEditor', beforeParams);

      modelRef.current = createFileCodeModel(
        source
          ? {
              ...inputRef.current,
              source,
            }
          : inputRef.current,
      );

      if (editorRef.current != null) {
        onDisposeEditorFn?.(beforeParams);
        emitterRef.current?.emit('disposeEditor', beforeParams);
        editorRef.current.dispose();
        debug('dispose editor');
      }

      const opts: monaco.editor.IStandaloneEditorConstructionOptions = {
        // value: inputRef.current.source || '',
        model: modelRef.current,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        autoIndent: 'full',
        formatOnPaste: true,
        formatOnType: true,
        fontLigatures: 'common-ligatures, slashed-zero',
        ...options,
      };
      const editor = _monaco.editor.create(containerRef.current, opts);
      debug('create editor', opts);

      const params = {
        mode: 'code',
        monaco: _monaco,
        editor,
        model: modelRef.current,
      };

      onMountEditorFn?.({ ...params, image });
      emitterRef.current?.emit('mountEditor', { ...params, image });

      if (scroll) editor.setScrollPosition(scroll);
      if (position) {
        editor.focus();
        editor.setPosition(position);
      }

      editor.onDidFocusEditorText(() => {
        isFocusRef.current = true;
        onFocusFn?.(params);
      });
      editor.onDidBlurEditorText(() => {
        isFocusRef.current = false;
        onBlurFn?.(params);
      });

      editorRef.current = editor;
    }
  },
);
