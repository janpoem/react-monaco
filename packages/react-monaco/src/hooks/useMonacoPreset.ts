import { usePresetProvider } from '@zenstone/preset-provider';
import { type ComponentProps, useMemo } from 'react';
import type { MonacoComponents, MonacoTexts } from '../presets';
import type { _PresetTextCallback } from '../types';

export const useMonacoPreset = usePresetProvider<MonacoComponents, MonacoTexts>;

type TextsParams<T> = T extends _PresetTextCallback<infer P> ? P : unknown;

export const useMonacoText = <
  Key extends keyof MonacoTexts,
  Params extends TextsParams<MonacoTexts[Key]>,
>(
  key: Key,
  // @ts-ignore
  params: Params = {},
) => {
  const text = useMonacoPreset().getText<Key, Params>;
  return useMemo(() => text(key, params), [text, key, params]);
};

export const useMonacoSelectText = <
  Key extends keyof MonacoTexts,
  Params extends TextsParams<MonacoTexts[Key]>,
>(
  text: string | null | undefined,
  key: Key,
  // @ts-ignore
  params: Params = {},
) => {
  const select = useMonacoPreset().selectText<Key, Params>;
  return useMemo(() => select(text, key, params), [select, text, key, params]);
};

export const useMonacoCreateElement = <Name extends keyof MonacoComponents>(
  name: Name,
  props: ComponentProps<MonacoComponents[Name]>,
) => {
  const create = useMonacoPreset().makeChildren<Name>;
  return useMemo(() => create(name, props), [create, name, props]);
};
