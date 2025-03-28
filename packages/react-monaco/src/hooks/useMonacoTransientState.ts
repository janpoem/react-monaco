import type { Position } from 'monaco-editor';

export type MonacoTransientStateImagingInput = {
  editor?: monaco.editor.IStandaloneCodeEditor;
  model?: monaco.editor.ITextModel;
};

export type MonacoTransientStateImage = {
  position?: Position | null;
  scroll?: monaco.editor.INewScrollPosition;
  source?: string;
};

export const useMonacoTransientState = () => {
  return { imaging };
  function imaging({
    editor,
    model,
  }: MonacoTransientStateImagingInput): MonacoTransientStateImage {
    return {
      position: editor?.getPosition(),
      scroll: editor
        ? {
            scrollLeft: editor.getScrollLeft(),
            scrollTop: editor.getScrollTop(),
          }
        : undefined,
      source: model?.getValue(),
    };
  }
};
