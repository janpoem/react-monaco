import { useMonaco } from '@react-monaco/core';
import { useEffect, useRef } from 'react';
import { TextmateEventsDelegator } from './TextmateEventsDelegator';
import type { TextmateInjectionProps } from './types';

export const TextmateInjection = (props: TextmateInjectionProps) => {
  const { emitterRef, setError, extendThemes, lifecycleId } = useMonaco();
  const delegatorRef = useRef<TextmateEventsDelegator>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    try {
      delegatorRef.current = new TextmateEventsDelegator(props);
      delegatorRef.current.setOptions({
        mounting: extendThemes,
        debug: props.debug,
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
