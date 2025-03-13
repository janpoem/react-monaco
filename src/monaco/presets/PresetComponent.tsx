import { type ComponentProps, useMemo } from 'react';
import type { PresetComponents } from '../types';
import { usePresetContext } from './PresetProvider';

export type PresetComponentProps<Name extends keyof PresetComponents> = {
  name: Name;
  props: ComponentProps<PresetComponents[Name]>;
};

export const PresetComponent = <Name extends keyof PresetComponents>({
  name,
  props,
}: PresetComponentProps<Name>) => {
  const { makeChildren } = usePresetContext();
  const children = useMemo(
    () => makeChildren(name, props),
    [name, props, makeChildren],
  );

  return <>{children}</>;
};
