import type { ComponentProps } from 'react';
import { usePresetCreateElement } from '../../preset-provider';
import type { MonacoPresetComponents } from '../types';

export type PresetComponentProps<Name extends keyof MonacoPresetComponents> = {
  name: Name;
  props: ComponentProps<MonacoPresetComponents[Name]>;
};

export const PresetComponent = <Name extends keyof MonacoPresetComponents>({
  name,
  props,
}: PresetComponentProps<Name>) => {
  const createElement = usePresetCreateElement<MonacoPresetComponents>();

  return <>{createElement(name, props)}</>;
};
