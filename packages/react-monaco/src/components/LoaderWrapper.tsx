import type { ReactNode } from 'react';
import { MonacoLoaderProcess } from '../constants';
import { useMonacoCreateElement } from '../hooks';
import type { MonacoPresetLoaderProps } from '../presets';

export type LoaderWrapperProps<Q = object> = MonacoPresetLoaderProps<Q> & {
  children?: ReactNode;
};

export const LoaderWrapper = <Q = object>({
  children,
  ...props
}: LoaderWrapperProps<Q>) =>
  props.process !== MonacoLoaderProcess.Completed ? (
    useMonacoCreateElement('Loader', props)
  ) : (
    <>{children}</>
  );
