import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import { ErrorDisplay } from './components';
import { useMonacoCodeEditorInit } from './hooks';
import { Container, cssDisableScroll } from './styled';
import type { MonacoCodeEditorProps } from './types';

const scope = 'MonacoCodeEditor';

export type MonacoCodeEditorRef = ReturnType<typeof useMonacoCodeEditorInit>;

export const MonacoCodeEditor = forwardRef(
  (props: MonacoCodeEditorProps, ref: ForwardedRef<MonacoCodeEditorRef>) => {
    const hook = useMonacoCodeEditorInit(props);
    const { inMonaco, containerRef } = hook;

    useImperativeHandle(ref, () => hook, [hook]);

    if (!inMonaco) {
      return (
        <ErrorDisplay
          scope={scope}
          error={'Not in Monaco context'}
          withContainer
        />
      );
    }

    return (
      <Container
        ref={containerRef}
        fluid
        className={`monaco-editor ${cssDisableScroll}`}
      />
    );
  },
);
