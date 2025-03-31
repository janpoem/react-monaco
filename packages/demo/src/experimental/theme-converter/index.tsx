import {
  convertTheme,
  type IVSCodeTheme,
} from '@estruyf/vscode-theme-converter';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  styled,
  TextField,
} from '@mui/material';
import type { MonacoCustomTheme } from '@react-monaco/core';
import { isInferObj } from '@zenstone/ts-utils/object';
import { notEmptyStr } from '@zenstone/ts-utils/string';
import * as changeCase from 'change-case';
import type { ValidationError } from 'jsoneditor';
import compare from 'just-compare';
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect, useLocalStorage } from 'usehooks-ts';
import JSONEditor from '../../components/JSONEditor';

type MaybeVsTheme = IVSCodeTheme & {
  name?: string;
};

const isVSTheme = (obj: unknown) =>
  isInferObj<MaybeVsTheme>(
    obj,
    (it) =>
      isInferObj(it.colors) &&
      Array.isArray(it.tokenColors) &&
      notEmptyStr(it.type),
  );

const verifyVSTheme = (
  obj: unknown,
  errors: ValidationError[],
): obj is MaybeVsTheme => {
  if (!isInferObj(obj)) {
    errors.push({ path: [''], message: 'VSCode theme should be an object.' });
  } else {
    if (!notEmptyStr(obj.name)) {
      errors.push({
        path: ['name'],
        message: "the key of 'name' is required and it should be an string.",
      });
    }
    if (!notEmptyStr(obj.type)) {
      errors.push({
        path: ['type'],
        message: "the key of 'type' is required and it should be an string.",
      });
    }
    if (!isInferObj(obj.colors)) {
      errors.push({
        path: ['colors'],
        message: "the key of 'colors' is required and it should be an object.",
      });
    }
    if (!Array.isArray(obj.tokenColors)) {
      errors.push({
        path: ['tokenColors'],
        message:
          "the key of 'tokenColors' is required and it should be an array.",
      });
    }
  }
  return errors.length <= 0;
};

const ThemeConverter = () => {
  const [lastInput, setLastInput] = useLocalStorage<object>(
    'ThemeConverterLastInput',
    {},
  );
  const displayRef = useRef<typeof window.JSONEditor>(null);
  const valueRef = useRef<unknown>(lastInput);

  const [convertData, setConverterData] = useState<
    MonacoCustomTheme | undefined
  >();

  useIsomorphicLayoutEffect(() => {
    if (isVSTheme(lastInput)) {
      setConverterData(handleLastInput(lastInput));
    }
  }, [lastInput]);

  return (
    <Box
      position={'relative'}
      display={'flex'}
      flexDirection={'row'}
      flex={'1 1 auto'}
      sx={{ overflow: 'hidden', height: 0 }}
    >
      <Wrapper>
        <JSONEditor
          value={lastInput}
          colorPicker
          modes={['tree', 'view', 'code', 'text', 'preview']}
          onValidate={onValidate}
        />
      </Wrapper>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ mx: '0.5em' }}
      />
      <Wrapper>
        <TextField
          name={'monaco-theme-name'}
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
        <TextField
          name={'monaco-theme-display-name'}
          variant={'filled'}
          size={'small'}
          label={'Display Name'}
          value={convertData?.displayName ?? ''}
          onChange={(e) => {
            setConverterData((prev) =>
              prev == null
                ? undefined
                : { ...prev, displayName: e.target.value },
            );
          }}
        />
        <JSONEditor
          ref={displayRef}
          mode={'code'}
          value={convertData}
          syncValue
          colorPicker
        />
      </Wrapper>
    </Box>
  );

  function onValidate(value: unknown) {
    if (!compare(valueRef.current, value)) {
      valueRef.current = value;
      if (isInferObj(value)) {
        if (value.type == null) {
          if (notEmptyStr(value.name)) {
            value.type = value.name.toLowerCase().includes('light')
              ? 'light'
              : value.name.toLowerCase().includes('dark')
                ? 'dark'
                : 'light';
          }
        }
      }
      const errors: ValidationError[] = [];
      if (!verifyVSTheme(value, errors)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        errors.forEach((it) => console.log(it.message));
        return [];
      }

      console.log('VSCode theme is valid!');
      setLastInput(value);
    }
    return [];
  }

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

    if (colors.error == null) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      data.rules.forEach((rule) => {
        if (rule.token === 'invalid') {
          if (rule.foreground != null) {
            colors.error = rule.foreground;
          }
        }
      });
    }

    data.base = isDark ? 'vs-dark' : 'vs';

    return {
      name,
      displayName,
      isDark,
      colors,
      data,
    };
  }
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1 1 50%;
  overflow: hidden;
  gap: 0.5em;
`;

export type ThemeConverterDialogProps = {
  open?: boolean;
  onClose?: () => void;
};

ThemeConverter.Dialog = ({ open, onClose }: ThemeConverterDialogProps) => {
  const [shouldRender, setShouldRender] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    if (!shouldRender) {
      setShouldRender(true);
    }
  }, [open, shouldRender]);

  if (!shouldRender) return null;

  return (
    <Dialog open={!!open} onClose={onClose} fullScreen>
      <DialogTitle>VSCode Theme Converter</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}
      >
        <ThemeConverter />
      </DialogContent>
      <DialogActions>
        <Button color={'error'} onClick={() => onClose?.()}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThemeConverter;
