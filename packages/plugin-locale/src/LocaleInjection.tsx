import { useMonaco } from '@react-monaco/core';
import { useEffect, useRef } from 'react';
import { LocaleEventsDelegator } from './LocaleEventsDelegator';
import type { LocaleInjectionProps } from './types';

export const LocaleInjection = (props: LocaleInjectionProps) => {
  const { locale } = props;
  const localeRef = useRef(locale);
  const { emitterRef, setError } = useMonaco();
  const delegatorRef = useRef<LocaleEventsDelegator>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    try {
      delegatorRef.current = new LocaleEventsDelegator(props);
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

  useEffect(() => {
    if (localeRef.current !== locale) {
      localeRef.current = locale;
      delegatorRef.current?.switchLocale(locale);
    }
  }, [locale]);

  return null;
};
