import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
} from 'react';
import { CodeEditorProvider } from './_context';
import { ErrorDisplay } from './components';
import { useMonacoCodeEditorInit } from './hooks';
import { Container, cssDisableScroll } from './styled';
import type { MonacoCodeEditorProps } from './types';

const scope = 'MonacoCodeEditor';

export type MonacoCodeEditorRef = ReturnType<typeof useMonacoCodeEditorInit>;

export type MonacoCodeEditorAdditionalProps = {
  topBar?: ReactNode;
  footBar?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
};

export const MonacoCodeEditor = forwardRef(
  (
    {
      topBar,
      footBar,
      children,
      style,
      ...props
    }: MonacoCodeEditorProps & MonacoCodeEditorAdditionalProps,
    ref: ForwardedRef<MonacoCodeEditorRef>,
  ) => {
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
      <CodeEditorProvider value={hook}>
        {topBar}
        <Container
          ref={containerRef}
          fluid
          className={`monaco-editor ${cssDisableScroll}`}
          style={style}
        />
        {children}
        {footBar}
      </CodeEditorProvider>
    );
  },
);
