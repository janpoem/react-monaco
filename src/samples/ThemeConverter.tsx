import { convertTheme } from '@estruyf/vscode-theme-converter';
import type {
  IVSCodeTheme,
} from '@estruyf/vscode-theme-converter/dist/interfaces';
import { Backdrop, Box, Divider, styled, TextField } from '@mui/material';
import { isInferObj } from '@zenstone/ts-utils/object';
import { mountRemote } from '@zenstone/ts-utils/remote';
import { notEmptyStr } from '@zenstone/ts-utils/string';
import * as changeCase from 'change-case';
import type JSONEditor from 'jsoneditor';
import { useMemo, useRef, useState } from 'react';
import { compare } from 'use-the-loader';
import { useIsomorphicLayoutEffect, useLocalStorage } from 'usehooks-ts';
import {
  AssetsLoader,
  ErrorDisplay,
  type MonacoCustomTheme,
  type MonacoPreloadAsset,
  type MonacoPresetComponents,
  type MonacoPresetTexts,
} from '../monaco';
import { initComponents, initTexts } from '../monaco/presets';
import { PresetProvider, usePresetProviderInit } from '../preset-provider';

type MaybeVsTheme = IVSCodeTheme & {
  name?: string;
};

const ThemeConverter = () => {
  const preset = usePresetProviderInit<
    MonacoPresetComponents,
    MonacoPresetTexts
  >({
    initComponents,
    initTexts,
  });
  const [jsonEditorReady, setJsonEditorReady] = useState(false);
  const [jsonEditorError, setJsonEditorError] = useState<unknown>();
  const jsonEditorAssets = useMemo(() => getJsonEditorAssets(), []);

  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<JSONEditor | null>(null);

  const lastInputRef = useRef<object | undefined>(undefined);
  const [lastInput, setLastInput] = useLocalStorage<object>(
    'ThemeConverterLastInput',
    {},
  );

  const [convertData, setConverterData] = useState<
    MonacoCustomTheme | undefined
  >();

  useIsomorphicLayoutEffect(() => {
    if (!compare(lastInputRef.current, lastInput)) {
      lastInputRef.current = lastInput;
      console.log('change theme', lastInput);
      if (isVSTheme(lastInput)) {
        setConverterData(handleLastInput(lastInput));
      }
    }
  }, [lastInput]);

  return (
    <PresetProvider preset={preset}>
      <Box
        position={'relative'}
        display={'flex'}
        flexDirection={'column'}
        flex={'1 1 auto'}
        sx={{ overflow: 'hidden', height: 0 }}
      >
        <Backdrop open={!jsonEditorReady}>
          <ErrorDisplay scope={'JSONEditorLoader'} error={jsonEditorError}>
            <AssetsLoader
              shouldPreload={!jsonEditorReady}
              assets={jsonEditorAssets}
              withContainer
              onLoad={(_q, assets) => {
                Promise.all(
                  assets.map((it) =>
                    mountRemote({
                      id: `jsoneditor_${it.key}`,
                      url: it.url.toString(),
                      type: it.key === 'css' ? 'css' : 'js',
                    }),
                  ),
                )
                  .then(() => {
                    try {
                      if (window.JSONEditor == null) {
                        throw new Error('JSONEditor undefined');
                      }
                      inputRef.current = new window.JSONEditor(
                        inputWrapperRef.current,
                        {
                          mode: 'code',
                          modes: ['tree', 'view', 'code', 'text'],
                          onValidate: (value: unknown) => {
                            if (isInferObj(value)) {
                              if (value.type == null) {
                                if (notEmptyStr(value.name)) {
                                  value.type = value.name
                                    .toLowerCase()
                                    .includes('light')
                                    ? 'light'
                                    : value.name.toLowerCase().includes('dark')
                                      ? 'dark'
                                      : 'light';
                                }
                              }
                            }
                            console.log(value);
                            if (isVSTheme(value)) {
                              setLastInput(value);
                            }
                          },
                        },
                      );
                      inputRef.current?.set(lastInput);
                      setJsonEditorReady(true);
                    } catch (err) {
                      setJsonEditorError(err);
                    }
                  })
                  .catch(setJsonEditorError);
              }}
            />
          </ErrorDisplay>
        </Backdrop>
        <Box
          display={'flex'}
          flexDirection={'row'}
          flex={'1 1 auto'}
          sx={{ overflow: 'hidden', height: 0 }}
        >
          <Wrapper ref={inputWrapperRef} />
          <Divider orientation="vertical" variant="middle" flexItem />
          <Wrapper>
            <TextField
              variant={'filled'}
              size={'small'}
              label={'Theme Name'}
              value={convertData?.name ?? ''}
              onChange={(e) => {
                setConverterData((prev) =>
                  prev == null ? undefined : { ...prev, name: e.target.value },
                );
              }}
            />
            <TextArea value={JSON.stringify(convertData, null, 2)} readOnly />
          </Wrapper>
        </Box>
      </Box>
    </PresetProvider>
  );

  function handleLastInput(input: MaybeVsTheme) {
    const isDark = input.type == null ? false : input.type === 'dark';
    const displayName = input.name ?? '';
    const name = changeCase.kebabCase(input.name ?? '');

    const data = convertTheme(input);

    const colors = {
      primary: data.colors['activityBarBadge.background'],
      secondary: data.colors['editor.selectionHighlightBackground'],
      success: data.colors['ports.iconRunningProcessForeground'],
      error: data.colors['statusBarItem.errorBackground'],
      background: data.colors['editor.background'],
      text: data.colors['editor.foreground'],
      borderColor: data.colors['checkbox.border'],
    };

    return {
      name,
      displayName,
      isDark,
      colors,
      data,
    };
  }

  // function onValidateInput(data: MaybeVsTheme) {
  //   let isDark = data.type == null ? false : data.type === 'dark';
  //
  //   console.log(isDark);
  //
  //
  // }
};

const getJsonEditorAssets = (): MonacoPreloadAsset[] => [
  {
    key: 'main',
    url: new URL(
      'https://cdn.jsdelivr.net/npm/jsoneditor@10.1.3/dist/jsoneditor.min.js',
    ),
    priority: -10,
  },
  {
    key: 'css',
    url: new URL(
      'https://cdn.jsdelivr.net/npm/jsoneditor@10.1.3/dist/jsoneditor.min.css',
    ),
    priority: -10,
  },
];

const isVSTheme = (obj: unknown) =>
  isInferObj<MaybeVsTheme>(
    obj,
    (it) =>
      isInferObj(it.colors) &&
      Array.isArray(it.tokenColors) &&
      notEmptyStr(it.type),
  );

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1 1 50%;
  padding: 0.5em;
  overflow: hidden;
  gap: 0.5em;
`;

const TextArea = styled('textarea')`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 0.5em;
  resize: none;
  border-radius: 4px;
  outline-color: ${({ theme }) => theme.palette.primary.main};
`;

export default ThemeConverter;
