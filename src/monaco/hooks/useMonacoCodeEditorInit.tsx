import { useRef } from 'react';
import { compare } from 'use-the-loader';
import { useEventCallback, useIsomorphicLayoutEffect } from 'usehooks-ts';
import { useMonacoProvider } from '../_context';
import { type MonacoCodeEditorProps, MonacoReadyState } from '../types';
import { createModel, globalMonacoThrow } from '../utils';

export const useMonacoCodeEditorInit = ({
  input,
  options,
  onCreateModel,
  onCreateEditor,
  onChange,
}: MonacoCodeEditorProps) => {
  const monacoHook = useMonacoProvider();
  const { inMonaco, readyState, setError } = monacoHook;

  const onCreateModelFn = useEventCallback(onCreateModel);
  const onCreateEditorFn = useEventCallback(onCreateEditor);
  const onChangeFn = useEventCallback(onChange);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | undefined>(
    undefined,
  );
  const modelRef = useRef<monaco.editor.ITextModel | undefined>(undefined);
  const inputRef = useRef(input);

  useIsomorphicLayoutEffect(() => {
    if (!inMonaco) return;

    if (readyState === MonacoReadyState.Mounting) {
      try {
        mountEditor();
      } catch (err) {
        setError(err);
      }
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
      modelRef.current.onDidChangeContent((ev) => onChangeFn?.(ev));
      onCreateModelFn?.(modelRef.current);
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
  };

  function mountEditor() {
    const $monaco = globalMonacoThrow();
    if (containerRef.current == null) {
      throw 'Missing editor mount container';
    }

    if (modelRef.current == null) {
      modelRef.current = createModel(inputRef.current);
      modelRef.current.onDidChangeContent((ev) => onChangeFn?.(ev));
      onCreateModelFn?.(modelRef.current);
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
      onCreateEditorFn?.(editorRef.current);
    }
  }
};
