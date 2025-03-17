import { lazy } from 'react';

export * from './js-api';

const BiomePlugin = lazy(() => import('./BiomePlugin'));

export { BiomePlugin };
