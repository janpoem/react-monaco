import { Box, Button, Drawer, Link, Tooltip } from '@mui/material';
import type { MonacoCodeEditorProps } from '@react-monaco/core';
import { isInferObj } from '@zenstone/ts-utils/object';
import compare from 'just-compare';
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect, useTimeout } from 'usehooks-ts';
import JSONEditor from '../components/JSONEditor';

export type EditOptionsProps = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (next: MonacoCodeEditorProps['options']) => void;
  options?: MonacoCodeEditorProps['options'];
};

const EditOptions = ({
  open,
  onClose,
  onSubmit,
  options,
}: EditOptionsProps) => {
  const editorRef = useRef<typeof window.JSONEditor>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [tip, setTip] = useState<string | undefined>(undefined);

  const optionsRef = useRef(options);

  const [canSubmit, setCanSubmit] = useState(false);
  const [closeConfirm, setCloseConfirm] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    if (!shouldRender) {
      setShouldRender(true);
    }
  }, [open, shouldRender]);

  useIsomorphicLayoutEffect(() => {
    if (open) {
      return () => {
        setCloseConfirm(false);
      };
    }
  }, [open]);

  useTimeout(
    () => {
      setTip(undefined);
    },
    tip ? 3000 : null,
  );

  return (
    <Drawer
      open={!!open}
      onClose={closeConfirm ? undefined : close}
      anchor={'right'}
      slotProps={{
        paper: {
          sx: { width: '50%' },
        },
      }}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        flex={'1 1 auto'}
        sx={{ p: '0.5em', gap: '0.5em' }}
      >
        <strong>Editor Monaco Options</strong>
        <div>
          Some options require to refresh the browser. Submit will save the
          options in <code>localStorage</code>.
        </div>
        <Box display={'flex'} gap={'0.5em'}>
          <strong>Reference</strong>
          <Link
            href={
              'https://microsoft.github.io/monaco-editor/typedoc/variables/editor.EditorOptions.html'
            }
            target={'monaco-docs:EditorOptionsConst'}
          >
            EditorOptionsConst
          </Link>
        </Box>
        {shouldRender && (
          <JSONEditor
            ref={editorRef}
            mode={'code'}
            modes={['code', 'tree']}
            value={options}
            onChange={() => {
              setCanSubmit(false);
            }}
            onValidate={(data: unknown) => {
              if (isInferObj(data)) {
                setCanSubmit(true);
              }
              return [];
            }}
          />
        )}
        <Box display={'flex'} gap={'0.5em'} alignItems={'center'}>
          <Tooltip
            title={'Click submit will update current monaco editor options!!'}
            arrow
          >
            <div>
              <Button disabled={!canSubmit} size={'medium'} onClick={submit}>
                Submit
              </Button>
            </div>
          </Tooltip>
          <Tooltip
            open={closeConfirm}
            title={
              closeConfirm ? (
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  flex={'1 1 auto'}
                  sx={{ p: '0.5em', gap: '0.5em' }}
                >
                  There are something changed. Are you sure to dropped them?
                  <Box display={'flex'} gap={'0.5em'} alignItems={'center'}>
                    <Button
                      onClick={() => {
                        onClose?.();
                      }}
                    >
                      Sure, drop them!
                    </Button>
                    <Button
                      color={'info'}
                      onClick={() => setCloseConfirm(false)}
                    >
                      Let me think...
                    </Button>
                  </Box>
                </Box>
              ) : (
                'Current modify will be dropped!'
              )
            }
            arrow
          >
            <div>
              <Button color={'error'} size={'medium'} onClick={close}>
                Close
              </Button>
            </div>
          </Tooltip>
          <span>
            {tip || 'Please make sure you know what you are doing!!!'}
          </span>
        </Box>
      </Box>
    </Drawer>
  );

  function submit() {
    if (editorRef.current == null) return;
    const next = editorRef.current.get();
    if (compare(optionsRef.current, next)) {
      onClose?.();
      setCloseConfirm(false);
      return;
    }
    optionsRef.current = next;
    onSubmit?.(next);
    setCloseConfirm(false);
    onClose?.();
  }

  function close() {
    if (compare(optionsRef.current, editorRef.current.get())) {
      onClose?.();
      return;
    }
    setCloseConfirm(true);
  }
};

export default EditOptions;
