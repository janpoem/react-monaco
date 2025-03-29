import type { ReactNode } from 'react';
import { useMonacoCreateElement } from '../hooks';
import type { MonacoPresetErrorDisplayProps } from '../presets';

export type ErrorWrapperProps = MonacoPresetErrorDisplayProps & {
  children?: ReactNode;
};

export const ErrorWrapper = ({ children, ...props }: ErrorWrapperProps) =>
  props.error != null ? (
    useMonacoCreateElement('ErrorDisplay', props)
  ) : (
    <>{children}</>
  );
