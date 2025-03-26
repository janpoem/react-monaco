import { Fragment, useMemo } from 'react';
import { MonacoLoaderProcess } from '../constants';
import {
  useMonacoCreateElement,
  useMonacoLoaderText,
  useMonacoPreset,
} from '../hooks';
import {
  cssLoaderBox,
  cssVerticalContainer,
  presetCls,
  styleLoaderContainer,
} from '../styles';
import type { MonacoPresetLoaderProps } from './_components';

const Loader = ({
  process,
  isFetchDownload,
  percent,
  withContainer,
  showText = true,
  progressBar = true,
  width,
  defaultText,
  dir = 'column',
  style,
  className,
}: MonacoPresetLoaderProps) => {
  const getText = useMonacoPreset().getText;

  const [Ele, props] = useMemo(() => {
    return [
      withContainer ? 'div' : Fragment,
      withContainer
        ? {
            className: `${presetCls.loaderContainer} ${cssVerticalContainer(styleLoaderContainer)}`,
          }
        : null,
    ];
  }, [withContainer]);

  const boxCls = useMemo(() => cssLoaderBox(dir), [dir]);

  const indeterminate = process !== MonacoLoaderProcess.Loading;

  return (
    <Ele {...props}>
      <div
        className={`${presetCls.loaderBox} ${boxCls}${className ? ` ${className}` : ''}`}
        style={style}
      >
        {showText && (
          <div className={presetCls.loaderText}>
            {useMonacoLoaderText({
              defaultText,
              process,
              isFetchDownload,
              percent,
            })}
          </div>
        )}
        {useMonacoCreateElement('ProgressBar', {
          mode: progressBar,
          indeterminate,
          percent,
          width,
        })}
      </div>
    </Ele>
  );
};

export default Loader;
