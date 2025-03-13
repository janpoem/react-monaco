import type { ReactNode } from 'react';
import { PresetComponent } from '../presets';
import type { PresetErrorProps } from '../types';

export type ErrorDisplayProps = PresetErrorProps & {
  children?: ReactNode;
};

export const ErrorDisplay = ({
  scope,
  error,
  withContainer,
  defaultText,
  className,
  children,
}: ErrorDisplayProps) => {
  if (error) {
    return (
      <PresetComponent
        name={'ErrorInfo'}
        props={{
          scope,
          error,
          withContainer,
          defaultText,
          className,
        }}
      />
    );
  }

  return <>{children}</>;
};
