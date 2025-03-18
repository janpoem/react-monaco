import { useRef } from 'react';
import { compare } from 'use-the-loader';
import { useEventCallback, useIsomorphicLayoutEffect } from 'usehooks-ts';
import { useMonacoProvider } from '../_context';
import {
  type MonacoCodeEditorProps,
  type MonacoCodeInput,
  MonacoPresetError,
  MonacoReadyState,
} from '../types';
import { extractExtname, isFileInput } from '../utils';

export const useMonacoCodeEditorInit = ({
  input,
  options,
  onModel,
  onChange,
  onMounted,
}: MonacoCodeEditorProps) => {
  const monacoHook = useMonacoProvider();
  const {
    preset: { getText },
    emitteryRef,
    inMonaco,
    readyState,
    setError,
    setReadyState,
    globalMonacoThrow,
    findLanguage,
  } = monacoHook;

  const onModelFn = useEventCallback(onModel);
  const onChangeFn = useEventCallback(onChange);
  const onMountedFn = useEventCallback(onMounted);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | undefined>(
    undefined,
  );
  const modelRef = useRef<monaco.editor.ITextModel | undefined>(undefined);
  const inputRef = useRef(input);

  useIsomorphicLayoutEffect(() => {
    if (!inMonaco || readyState !== MonacoReadyState.Mounting) return;
    try {
      mountEditor();
      setReadyState(MonacoReadyState.Mounted);
    } catch (err) {
      setError(err);
    }
  }, [inMonaco, readyState]);

  useIsomorphicLayoutEffect(() => {
    if (editorRef.current == null) return;
    // @ts-ignore
    editorRef.current.updateOptions(options);
  }, [options]);

  useIsomorphicLayoutEffect(() => {
    if (editorRef.current == null) return;
    if (!compare(inputRef.current, input)) {
      inputRef.current = input;
      if (modelRef.current != null) {
        modelRef.current.dispose();
      }

      modelRef.current = createModel(input);
      editorRef.current.setModel(modelRef.current);
    }
  }, [input]);

  return {
    ...monacoHook,
    // refs
    containerRef,
    editorRef,
    modelRef,
    inputRef,
    createModel,
  };

  function createModel(input: MonacoCodeInput) {
    const $monaco = globalMonacoThrow();
    if (!isFileInput(input)) {
      throw getText(MonacoPresetError.INVALID_CODE_INPUT);
    }

    const { filename, source, uri: iUri } = input;
    const extname = extractExtname(filename);
    const language = findLanguage(extname);

    let id = language?.id;

    if (!id) {
      id = extname?.replace('.', '');
    }

    const uri = iUri ? $monaco.Uri.parse(iUri) : undefined;

    const params = {
      input,
      language,
      extname,
      uri,
      monaco: $monaco,
      editor: editorRef.current,
    };
    emitteryRef.current.emit('prepareModel', params);

    const model = $monaco.editor.createModel(source || '', id, uri);

    model.onDidChangeContent((event) => {
      onChangeFn?.({ ...params, model, event });
      emitteryRef.current.emit('changeModel', { ...params, model, event });
    });
    onModelFn?.({ ...params, model });
    emitteryRef.current.emit('createModel', { ...params, model });

    return model;
  }

  function mountEditor() {
    const $monaco = globalMonacoThrow();
    if (containerRef.current == null) {
      throw getText(MonacoPresetError.NO_CONTAINER);
    }

    if (modelRef.current == null) {
      modelRef.current = createModel(inputRef.current);
    }

    if (editorRef.current == null) {
      editorRef.current = $monaco.editor.create(containerRef.current, {
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
        monaco: $monaco,
        editor: editorRef.current,
        model: modelRef.current,
      };
      onMountedFn?.(params);
      emitteryRef.current.emit('mounted', params);
    }
  }
};
