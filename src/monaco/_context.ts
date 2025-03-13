import { createContext, useContext } from 'react';
import type { useMonacoProviderInit } from './hooks';

export type MonacoProviderHook = ReturnType<typeof useMonacoProviderInit>;

// @ts-ignore context init
const Context = createContext<MonacoProviderHook>({ inMonaco: false });

export const Provider = Context.Provider;

export const useMonacoProvider = () => useContext(Context);
