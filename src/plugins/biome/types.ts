import type { Biome } from './js-api';

export type BiomePluginProps = {
  enable?: boolean;
  onLoad?: (biome: Biome) => void;
};
