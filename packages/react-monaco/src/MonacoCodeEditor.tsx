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
import { useMonacoPreset, useMonacoTransientState } from './hooks';
import { type MonacoContextType, useMonaco } from './MonacoProvider';
import { cssVerticalContainer, presetCls } from './styles';
import type {
  MonacoCodeInput,
  MonacoEditorFocusAndBlurParams,
  MonacoEditorMountParams,
  MonacoEditorPrepareParams,
  MonacoModelChangeParams,
  MonacoModelCreateParams,
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
  options?: Partial<
    Omit<monaco.editor.IStandaloneEditorConstructionOptions, 'value' | 'model'>
  >;
  className?: string;
  style?: CSSProperties;
  beforeModel?: (params: MonacoModelPrepareParams) => void;
  onModel?: (params: MonacoModelCreateParams) => void;
  onChange?: (params: MonacoModelChangeParams) => void;
  beforeMount?: (params: MonacoEditorPrepareParams) => void;
  onMount?: (params: MonacoEditorMountParams) => void;
  onFocus?: (params: MonacoEditorFocusAndBlurParams) => void;
  onBlur?: (params: MonacoEditorFocusAndBlurParams) => void;
};

export const MonacoCodeEditor = forwardRef(
  (
    {
      input,
      options,
      className,
      style,
      beforeModel,
      onModel,
      onChange,
      beforeMount,
      onMount,
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

    const beforeModelFn = useEventCallback(beforeModel);
    const onModelFn = useEventCallback(onModel);
    const onChangeFn = useEventCallback(onChange);
    const beforeMountFn = useEventCallback(beforeMount);
    const onMountFn = useEventCallback(onMount);
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
      // @ts-ignore
      editorRef.current.updateOptions(options);
    }, [options]);

    useIsomorphicLayoutEffect(() => {
      if (editorRef.current == null) return;
      if (!compare(inputRef.current, input)) {
        try {
          inputRef.current = input;
          modelRef.current?.dispose();
          modelRef.current = createModel(input);
          editorRef.current.setModel(modelRef.current);
        } catch (error) {
          setError(error);
        }
      }
    }, [input]);

    if (readyState === MonacoReadyState.Prepare) return;

    return <div ref={containerRef} className={cls} />;

    function createModel(input: MonacoCodeInput) {
      const _monaco = refMonaco();
      if (!isFileInput(input)) {
        throw new Error(getText('ERR_INVALID_CODE_INPUT'));
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
        _monaco.editor.getModel(uri)?.dispose();
      }

      const params = {
        input,
        language,
        extname,
        uri,
        monaco: _monaco,
        editor: editorRef.current,
      };

      beforeModelFn?.(params);
      emitterRef.current?.emit('prepareModel', params);
      const model = _monaco.editor.createModel(source || '', languageId, uri);
      model.onDidChangeContent((event) => {
        onChangeFn?.({ ...params, model, event });
        emitterRef.current?.emit('changeModel', { ...params, model, event });
      });
      onModelFn?.({ ...params, model });
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

      beforeMount?.(beforeParams);
      emitterRef.current?.emit('prepareEditor', beforeParams);

      modelRef.current = createModel(
        source
          ? {
              ...inputRef.current,
              source,
            }
          : inputRef.current,
      );

      if (editorRef.current != null) {
        editorRef.current.dispose();
      }

      const editor = _monaco.editor.create(containerRef.current, {
        // value: inputRef.current.source || '',
        model: modelRef.current,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        autoIndent: 'full',
        formatOnPaste: true,
        formatOnType: true,
        fontLigatures: 'common-ligatures, slashed-zero',
        ...options,
      });

      const params = {
        mode: 'code',
        monaco: _monaco,
        editor,
        model: modelRef.current,
      };

      onMountFn?.({ ...params, image });
      emitterRef.current?.emit('editor', { ...params, image });

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
