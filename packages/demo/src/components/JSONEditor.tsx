import { Box, LinearProgress, styled } from '@mui/material';
import { errMsg } from '@zenstone/ts-utils/error';
import { toNumber } from '@zenstone/ts-utils/number';
import useRemoteLoader from '@zenstone/use-remote-loader';
import type { JSONEditorOptions } from 'jsoneditor';
import compare from 'just-compare';
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

const assets = [
  {
    key: 'main',
    url: new URL(
      'https://cdn.jsdelivr.net/npm/jsoneditor@10.1.3/dist/jsoneditor.min.js',
    ),
    type: 'js',
    priority: -10,
  },
  {
    key: 'css',
    url: new URL(
      'https://cdn.jsdelivr.net/npm/jsoneditor@10.1.3/dist/jsoneditor.min.css',
    ),
    type: 'css',
    priority: 0,
  },
];

type JSONEditorProps = JSONEditorOptions & {
  className?: string;
  onMount?: (editor: typeof window.JSONEditor) => void | Promise<void>;
  value?: unknown;
  fontSize?: number;
  syncValue?: boolean;
};

const JSONEditor = forwardRef(
  (
    {
      className,
      value,
      syncValue,
      onMount,
      fontSize,
      ...options
    }: JSONEditorProps,
    ref?: ForwardedRef<typeof window.JSONEditor | null>,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [ready, setReady] = useState(false);
    const [error, setError] = useState<unknown>();
    const [instance, setInstance] = useState<typeof window.JSONEditor | null>(
      null,
    );

    const valueRef = useRef(value);

    useImperativeHandle(ref, () => instance, [instance]);

    useIsomorphicLayoutEffect(() => {
      if (!syncValue || instance == null) return;
      if (!compare(valueRef.current, value)) {
        instance.set(value);
      }
    }, [syncValue, instance, value]);

    const state = useRemoteLoader({
      key: 'jsoneditor',
      assets,
      onLoad: async () => {
        try {
          if (window.JSONEditor == null) {
            throw new Error('JSONEditor undefined');
          }
          const editor = new window.JSONEditor(containerRef.current, {
            mode: 'code',
            ...options,
          });
          editor.set(value);

          setReady(true);
          setInstance(editor);
          await onMount?.(editor);
        } catch (err) {
          setError(err);
        }
      },
      onError: setError,
    });

    return (
      <Container
        ref={containerRef}
        display={'flex'}
        flexDirection={'column'}
        flex={'1 1 auto'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={'0.5em'}
        className={className}
      >
        {error != null ? (
          <Box sx={{ maxWidth: 420 }}>
            JSONEditor loader error:{' '}
            <div>{errMsg(error) || 'unknown error'}</div>
          </Box>
        ) : !ready ? (
          <>
            Loading {state.percent}%
            <LinearProgress
              variant={'determinate'}
              value={state.percent}
              sx={{ minWidth: 250 }}
            />
          </>
        ) : null}
      </Container>
    );
  },
);

const Container = styled(Box)<{ fontSize?: number }>`
  --jeFontSizeInput: ${({ fontSize }) => toNumber(fontSize, 14)};
  --jeLineHeightInput: 1.5;
  
  --jeFontWeight: var(--font-mono-weight);
  --jeFontSize: calc(var(--jeFontSizeInput) * 1px);
  --jeLineHeight: calc(var(--jeFontSizeInput) * var(--jeLineHeightInput) * 1px);

  ${({ theme: { palette, shape } }) => ({
    '--jeText': palette.text.primary,
    '--jeTextSecondary': palette.text.secondary,
    '--jeBorderColor': palette.divider,
    '--jeBg': palette.background.default,
    '--jeBgPaper': palette.background.paper,
    '--jeActiveColor': palette.action.active,
    '--jeFocusColor': palette.action.focus,
    '--jeHoverColor': palette.action.hover,
    '--jePrimary': palette.primary.main,
    '--jePrimaryDark': palette.primary.dark,
    '--jePrimaryLight': palette.primary.light,
    '--jeSuccess': palette.success.main,
    '--jeWarning': palette.warning.main,
    '--jeInfo': palette.info.main,
    '--jeError': palette.error.main,
    '--jeCursor':
      palette.mode === 'dark' ? palette.grey[400] : palette.primary.main,
    '--jeScrollBarThumbColor':
      palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.3)',
    '--jeScrollBarThumbHoverColor':
      palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.45)',
    '--jeBorderRadius': `${shape.borderRadius}px`,
    '--jeStatusBarColor': 'rgba(255, 255, 255, 0.7)',
    '--jeSelectedColor':
      palette.mode === 'dark' ? palette.primary.dark : palette.primary.light,
  })}

  overflow: hidden;
  height: 0px;

  //////////////////////////////////////////////////////////////////////////////
  // jsoneditor common
  //////////////////////////////////////////////////////////////////////////////

  .jsoneditor {
    font-size: calc(var(--jeFontSize) * 0.8) !important;
    font-family: var(--font-sans) !important;
    color: var(--jeTextColor);
    border-color: var(--jePrimary);
    //border-width: 0px;
    border-radius: var(--jeBorderRadius);
    overflow: hidden;

    * {
      -webkit-font-smoothing: subpixel-antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-feature-settings: "liga", "clig", "zero";
      font-optical-sizing: auto;
      font-stretch: normal;
      font-variant-east-asian: simplified;
      font-variant-ligatures: common-ligatures;
      font-variant-numeric: slashed-zero;
      font-weight: 400;
      hyphenate-character: auto;
    }
  }

  .jsoneditor-popover,
  .jsoneditor-schema-error,
  div.jsoneditor td,
  div.jsoneditor textarea,
  div.jsoneditor th,
  div.jsoneditor-field,
  div.jsoneditor-value,
  pre.jsoneditor-preview {
    font-size: calc(var(--jeFontSize) * 0.9) !important;
    font-family: var(--font-mono) !important;
    font-weight: var(--jeFontWeight) !important;
    color: var(--jeText);
    line-height: calc(var(--jeLineHeight) * 0.9) !important;
  }

  .jsoneditor-navigation-bar, .jsoneditor-treepath-element {
    font-size: calc(var(--jeFontSize) * 0.8) !important;
    font-family: var(--font-mono) !important;
  }

  .jsoneditor-navigation-bar {
    background: var(--jePrimaryDark);
    color: var(--jeStatusBarColor);
    border-color: var(--jePrimaryDark);
  }

  .jsoneditor-menu {
    * {
      font-family: var(--font-sans) !important;
      font-size: calc(var(--jeFontSize) * 0.8) !important;
    }

    border-color: var(--jePrimary);
    background-color: var(--jePrimary);
  }

  .jsoneditor-statusbar {
    font-size: 12px;
    padding-left: 0.5em;
    line-height: 24px;
    font-family: var(--font-sans) !important;
    background: var(--jePrimary);
    color: var(--jeStatusBarColor);
    border-color: var(--jePrimary);
  }

  .jsoneditor .jsoneditor-validation-errors-container {
    background-color: var(--jePrimary);
    text-decoration: red;
  }

  .jsoneditor .jsoneditor-text-errors {
    border-top: 0px;
  }

  //////////////////////////////////////////////////////////////////////////////
  // code mode about ace_editor
  //////////////////////////////////////////////////////////////////////////////

  .ace-jsoneditor.ace_editor,
  textarea.jsoneditor-text.ace_editor {
    font-size: var(--jeFontSize) !important;
    font-family: var(--font-mono) !important;
    font-weight: var(--jeFontWeight) !important;
    line-height: var(--jeLineHeight) !important;
  }

  .ace-jsoneditor .ace_variable {
    color: var(--jeText);
  }

  .ace-jsoneditor .ace_gutter {
    background: var(--jeBgPaper);
    color: var(--jeText);
  }

  .ace-jsoneditor .ace_cursor {
    border-left: 2px solid var(--jeCursor);
  }

  .ace-jsoneditor .ace_overwrite-cursors .ace_cursor {
    border-left: 0px;
    border-bottom: 1px solid var(--jeCursor);
  }

  .ace-jsoneditor.ace_editor {
    background: var(--jeBg);
  }

  .ace-jsoneditor .ace_scroller {
    background-color: var(--jeBg);
  }

  .ace-jsoneditor .ace_marker-layer .ace_active-line {
    background: var(--jeFocusColor);
  }

  .ace-jsoneditor .ace_gutter-active-line {
    background-color: var(--jeHoverColor);
  }

  .ace-jsoneditor .ace_marker-layer .ace_selection {
    background: var(--jeSelectedColor);
  }

  .ace-jsoneditor.ace_multiselect .ace_selection.ace_start {
    box-shadow: 0 0 3px 0px var(--jePrimary);
    border-radius: 2px;
  }

  // types

  .ace-jsoneditor .ace_string {
    color: var(--jeSuccess);
  }

  .ace-jsoneditor .ace_constant.ace_numeric {
    color: var(--jeError);
  }

  .ace-jsoneditor .ace_constant.ace_language {
    color: var(--jeWarning);
  }

  .ace-jsoneditor .ace_entity.ace_name.ace_tag,
  .ace-jsoneditor .ace_entity.ace_other.ace_attribute-name {
    color: var(--jeTextSecondary);
  }

  .ace-jsoneditor.ace_multiselect .ace_selection.ace_start {
    box-shadow: 0 0 3px 0px red;
    border-radius: 2px;
  }

  .ace-jsoneditor .ace_indent-guide {
    position: relative;
    background-image: none;

    &:after {
      content: '';
      border-left: 1px dotted var(--jeBorderColor);
      display: inline-block;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      height: calc(var(--jeLineHeight) - 1px);
    }
  }

  .ace_scrollbar, div.jsoneditor-tree, textarea.jsoneditor-text, pre.jsoneditor-preview {
    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }
  }

  .ace_scrollbar, div.jsoneditor-tree, textarea.jsoneditor-text, pre.jsoneditor-preview {
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }

  .ace_scrollbar, div.jsoneditor-tree, textarea.jsoneditor-text, pre.jsoneditor-preview {
    &::-webkit-scrollbar-thumb {
      background-color: var(--jeScrollBarThumbColor);
      border-radius: 6px;
      border: 2px solid rgba(0, 0, 0, 0);
      background-clip: padding-box;
      transition: background-color 250ms;

      &:hover {
        background-color: var(--jeScrollBarThumbHoverColor);
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // json editor context menu
  //////////////////////////////////////////////////////////////////////////////

  div.jsoneditor-tree {
    background-color: var(--jeBg);
  }

  tr.jsoneditor-highlight,
  tr.jsoneditor-selected {
    background-color: var(--jePrimaryDark);
  }

  .jsoneditor-mode-tree {
    .jsoneditor-outer > .jsoneditor-tree > .jsoneditor-tree-inner > table {
      > tbody {
        & > tr > td:nth-of-type(-n + 2) {
          background-color: var(--jeBgPaper);
        }
      }
    }
  }

  div.jsoneditor td.jsoneditor-separator {
    vertical-align: middle;
  }

  div.jsoneditor td.jsoneditor-tree {
    vertical-align: middle;
  }

  .jsoneditor-mode-view {
    div.jsoneditor-tree {
      background-color: var(--jeBg);
    }

    div.jsoneditor-tree button.jsoneditor-button:focus {
      background-color: var(--jePrimaryLight);
      outline: var(--jePrimaryLight) solid 1px;
      border-radius: var(--jeBorderRadius);
    }
  }

  .jsoneditor-mode-text {
    textarea.jsoneditor-text {
      background-color: var(--jeBg);
    }
  }

  .jsoneditor-modal #query,
  .jsoneditor-modal .jsoneditor-transform-preview {
    font-family: var(--font-mono) !important;
  }

  .jsoneditor-contextmenu .jsoneditor-menu {
    background: var(--jeBgPaper);
    border: 0px solid transparent;
    box-shadow: none;
    border-radius: var(--jeBorderRadius);
    overflow: hidden;

    button {
      color: var(--jeText);

      &:focus, &:hover {
        color: var(--jeStatusBarColor);
        background-color: var(--jePrimaryDark);
      }
    }
  }

  .jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected,
  .jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected:focus,
  .jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected:hover {
    color: var(--jeStatusBarColor);
    background-color: var(--jePrimary);
  }

  .jsoneditor-contextmenu .jsoneditor-text {
    padding: 0;
    height: 26px;
    line-height: 26px;
    padding-left: 2.25em;
  }

  .jsoneditor-contextmenu .jsoneditor-type-modes .jsoneditor-text {
    padding-left: 0.5em;
  }

  div.jsoneditor-value.jsoneditor-string {
    color: var(--jeSuccess);
  }

  div.jsoneditor-value.jsoneditor-number {
    color: var(--jeError);
  }

  div.jsoneditor-value.jsoneditor-boolean {
    color: var(--jeWarning);
  }

  div.jsoneditor-value.jsoneditor-null {
    color: var(--jeInfo);
  }

  div.jsoneditor-value.jsoneditor-color-value {
    color: var(--jeText);
  }

  div.jsoneditor-value.jsoneditor-invalid {
    color: var(--jeText);
  }

  div.jsoneditor-value.jsoneditor-array, div.jsoneditor-value.jsoneditor-object {
    color: var(--jeBorderColor);
  }

  div.jsoneditor-busy span {
    background-color: var(--jePrimary);
    border: 1px solid var(--jePrimary);
  }

  div.jsoneditor-field.jsoneditor-highlight,
  div.jsoneditor-field[contenteditable="true"]:focus,
  div.jsoneditor-field[contenteditable="true"]:hover,
  div.jsoneditor-value.jsoneditor-highlight,
  div.jsoneditor-value[contenteditable="true"]:focus,
  div.jsoneditor-value[contenteditable="true"]:hover {
    background-color: var(--jeHoverColor);
    border: 1px solid var(--jeHoverColor);
  }

  .jsoneditor-popover {
    background-color: var(--jePrimaryDark);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
    color: var(--jeStatusBarColor);

    //&.jsoneditor-above:before, &.jsoneditor-below:before, &.jsoneditor-left:before, &.jsoneditor-right:before {
    //  border-top-color: var(--jeBg);
    //}
  }

  .jsoneditor-popover.jsoneditor-above:before {
    border-top: 7px solid var(--jePrimaryDark);
  }

  .jsoneditor-popover.jsoneditor-below:before {
    border-bottom: 7px solid var(--jePrimaryDark);
  }

  .jsoneditor-popover.jsoneditor-left:before {
    border-left: 7px solid var(--jePrimaryDark);
  }

  .jsoneditor-popover.jsoneditor-right:before {
    border-right: 7px solid var(--jePrimaryDark);
  }
`;

export default JSONEditor;
