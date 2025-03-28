import { useMonaco } from '@react-monaco/core';
import { useEffect, useRef } from 'react';
import { ThemesEventsDelegator } from './ThemesEventsDelegator';
import type {
  CreateThemesPluginOptions,
  ThemeInjectionProps,
  ThemesPlugin,
} from './types';

export const createThemesPlugin = (
  options: CreateThemesPluginOptions,
): ThemesPlugin => {
  const { themes } = options;
  if (!themes.length) {
    throw new Error(
      'Creating a theme plugin requires at least a theme declaration',
    );
  }

  const ThemesInjection = (props: ThemeInjectionProps) => {
    const { loadTheme } = props;
    const loadThemeRef = useRef(loadTheme);

    const { emitterRef, setError } = useMonaco();
    const delegatorRef = useRef<ThemesEventsDelegator>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      try {
        delegatorRef.current = new ThemesEventsDelegator(options, props);
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
      if (delegatorRef.current == null) return;
      if (loadThemeRef.current !== loadTheme) {
        loadThemeRef.current = loadTheme;
        delegatorRef.current.preloadTheme(loadTheme);
      }
    }, [loadTheme]);

    return null;
  };

  return {
    ThemesInjection,
    // 避免数据被引用修改
    themes: themes.map((it) => ({ ...it })),
  };
};
