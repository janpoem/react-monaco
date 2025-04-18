import { useMonaco } from '@react-monaco/core';
import { useLayoutEffect, useRef } from 'react';
import { TextmateEventsDelegator } from './TextmateEventsDelegator';
import type { TextmateInjectionProps } from './types';

export const TextmateInjection = (props: TextmateInjectionProps) => {
  const { emitterRef, setError, extendThemes, lifecycleId } = useMonaco();
  const delegatorRef = useRef<TextmateEventsDelegator>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    try {
      delegatorRef.current = new TextmateEventsDelegator({
        ...props,
        mounting: extendThemes,
      });
      delegatorRef.current.inject(emitterRef.current);
    } catch (err) {
      setError(err);
    }

    return () => {
      delegatorRef.current?.eject(emitterRef.current);
      delegatorRef.current = null;
    };
  }, [lifecycleId]);

  return null;
};
