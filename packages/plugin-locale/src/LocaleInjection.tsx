import { useMonaco } from '@react-monaco/core';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { LocaleEventsDelegator } from './LocaleEventsDelegator';
import type { LocaleInjectionProps } from './types';

export const LocaleInjection = (props: LocaleInjectionProps) => {
  const { locale, debug } = props;
  const localeRef = useRef(locale);
  const { emitterRef, setError } = useMonaco();
  const delegatorRef = useRef<LocaleEventsDelegator>(null);

  if (delegatorRef.current == null) {
    try {
      delegatorRef.current = new LocaleEventsDelegator(props, { debug });
      delegatorRef.current.inject(emitterRef.current);
    } catch (err) {
      setError(err);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    return () => {
      delegatorRef.current?.eject(emitterRef.current);
      delegatorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (localeRef.current !== locale) {
      localeRef.current = locale;
      delegatorRef.current?.switchLocale(locale);
    }
  }, [locale]);

  return null;
};
