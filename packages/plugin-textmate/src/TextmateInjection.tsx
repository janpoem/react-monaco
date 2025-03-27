import { useMonaco } from '@react-monaco/core';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { TextmateEventsDelegator } from './TextmateEventsDelegator';
import type { TextmateInjectionProps } from './types';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const TextmateInjection = (props: TextmateInjectionProps) => {
  const { emitterRef, setError, extendThemes } = useMonaco();
  const delegatorRef = useRef<TextmateEventsDelegator>(null);

  useIsomorphicLayoutEffect(() => {
    if (delegatorRef.current == null) {
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
    }
    return () => {
      delegatorRef.current?.eject(emitterRef.current);
      delegatorRef.current = null;
    };
  }, []);

  return null;
};
