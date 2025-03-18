import { createContext, useContext } from 'react';
import type { useMonacoCodeEditorInit, useMonacoProviderInit } from './hooks';

export type MonacoContext = ReturnType<typeof useMonacoProviderInit>;

// @ts-ignore context init
const Context = createContext<MonacoContext>({
  inMonaco: false,
});

export const Provider = Context.Provider;

export const useMonacoProvider = () => useContext(Context);

export type MonacoCodeEditorContext = ReturnType<
  typeof useMonacoCodeEditorInit
>;

// @ts-ignore context init
const CodeEditorContext = createContext<MonacoCodeEditorContext>({});

export const CodeEditorProvider = CodeEditorContext.Provider;
