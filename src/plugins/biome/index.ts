import { lazy } from 'react';

export * from './js-api';

const BiomeTest = lazy(() => import('./BiomePlugin'));

export { BiomeTest };
