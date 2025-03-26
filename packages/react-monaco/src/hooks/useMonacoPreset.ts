import {
  type PresetTextCallback,
  usePresetProvider,
} from '@zenstone/preset-provider';
import { type ComponentProps, useMemo } from 'react';
import type { MonacoPresetComponents, MonacoPresetTexts } from '../presets';

export const useMonacoPreset = usePresetProvider<
  MonacoPresetComponents,
  MonacoPresetTexts
>;

type TextsParams<T> = T extends PresetTextCallback<infer P> ? P : unknown;

export const useMonacoText = <
  Key extends keyof MonacoPresetTexts,
  Params extends TextsParams<MonacoPresetTexts[Key]>,
>(
  key: Key,
  // @ts-ignore
  params: Params = {},
) => {
  const text = useMonacoPreset().getText<Key, Params>;
  return useMemo(() => text(key, params), [text, key, params]);
};

export const useMonacoSelectText = <
  Key extends keyof MonacoPresetTexts,
  Params extends TextsParams<MonacoPresetTexts[Key]>,
>(
  text: string | null | undefined,
  key: Key,
  // @ts-ignore
  params: Params = {},
) => {
  const select = useMonacoPreset().selectText<Key, Params>;
  return useMemo(() => select(text, key, params), [select, text, key, params]);
};

export const useMonacoCreateElement = <
  Name extends keyof MonacoPresetComponents,
>(
  name: Name,
  props: ComponentProps<MonacoPresetComponents[Name]>,
) => {
  const create = useMonacoPreset().makeChildren<Name>;
  return useMemo(() => create(name, props), [create, name, props]);
};
