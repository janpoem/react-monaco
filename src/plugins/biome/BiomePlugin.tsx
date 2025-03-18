import { Box, CircularProgress, useTheme } from '@mui/material';
import type { DownloadQueue } from '@zenstone/ts-utils/fetch-download';
import { useState } from 'react';
import { useEventCallback, useIsomorphicLayoutEffect } from 'usehooks-ts';
import {
  AssetsLoader,
  ErrorDisplay,
  type MonacoPreloadAsset,
  MonacoPreloadState,
} from '../../monaco';
import { biomeWasmUrl } from '../../preset-old';
import { Biome } from './js-api';
import type { BiomePluginProps } from './types';

const biomeAssets: MonacoPreloadAsset[] = [
  {
    localeKey: 'biome/wasm',
    url: new URL(biomeWasmUrl),
    priority: 0,
  },
];

let biomeBlobUrl: string | undefined;
let biomeInstance: Biome | undefined;

const BiomePlugin = ({ enable, onLoad }: BiomePluginProps) => {
  const { palette } = useTheme();

  const onLoadFn = useEventCallback(onLoad);

  const [error, setError] = useState<unknown>();
  const [biome, setBiome] = useState(biomeInstance);
  const [shouldPreload, setShouldPreload] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!enable) {
      setShouldPreload(false);
      return;
    }
    if (!biomeInstance) {
      setShouldPreload(true);
    }
  }, [enable]);

  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{
        height: 20,
        userSelect: 'none',
        color: enable ? palette.action.active : palette.action.disabled,
      }}
    >
      {enable ? (
        <ErrorDisplay error={error}>
          <AssetsLoader
            assets={biomeAssets}
            shouldPreload={shouldPreload && biome == null}
            render={({ percent, process, defaultText }) =>
              process?.state === MonacoPreloadState.Download ? (
                <CircularProgress
                  variant={'determinate'}
                  value={percent}
                  size={18}
                />
              ) : (
                defaultText
              )
            }
            onError={setError}
            onLoad={handleLoad}
          >
            Biome on
          </AssetsLoader>
        </ErrorDisplay>
      ) : (
        'Biome off'
      )}
    </Box>
  );

  async function handleLoad(queue: DownloadQueue) {
    try {
      const task = queue.tasks[0];
      const chunks = task.chunks;
      if (chunks == null) {
        throw new Error('Load biome/wasm-web error, empty chunks response');
      }
      const blob = new Blob([chunks], { type: 'application/wasm' });
      biomeBlobUrl = URL.createObjectURL(blob);
      biomeInstance = await Biome.create({ input: biomeBlobUrl });
      onLoadFn?.(biomeInstance);
      setShouldPreload(false);
      setBiome(biomeInstance);
    } catch (err) {
      console.warn(err);
      setError(err);
    }
  }
};

export default BiomePlugin;
