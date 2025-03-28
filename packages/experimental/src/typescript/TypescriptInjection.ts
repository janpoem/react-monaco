import { useMonaco } from '@react-monaco/core';
import { useEffect, useRef } from 'react';
import type { TypescriptInjectionProps } from './types';
import { TypescriptEventsDelegator } from './TypescriptEventsDelegator';

export const TypescriptInjection = (props: TypescriptInjectionProps) => {
  const { emitterRef, setError } = useMonaco();
  const delegatorRef = useRef<TypescriptEventsDelegator>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    try {
      delegatorRef.current = new TypescriptEventsDelegator(props);
      delegatorRef.current.setOptions({
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
  }, []);

  return null;
};
