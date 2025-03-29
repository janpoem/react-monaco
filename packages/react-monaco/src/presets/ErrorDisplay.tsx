import { errMsg } from '@zenstone/ts-utils';
import compare from 'just-compare';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { useMonacoSelectText } from '../hooks';
import {
  cssErrDisplay,
  cssErrMessage,
  cssErrScope,
  cssVerticalContainer,
  presetCls,
  styleFlexCC,
} from '../styles';
import type { MonacoPresetErrorDisplayProps } from './_components';

const ErrorDisplay = ({
  scope,
  error,
  withContainer,
  defaultText: iDefaultText,
  style,
  className,
}: MonacoPresetErrorDisplayProps) => {
  const errorRef = useRef<unknown>(undefined);
  const defaultText = useMonacoSelectText(iDefaultText, 'ERR_UNKNOWN');

  const [Ele, props] = useMemo(() => {
    return [
      withContainer ? 'div' : Fragment,
      withContainer
        ? {
            className: `${presetCls.errContainer} ${cssVerticalContainer(styleFlexCC)}`,
          }
        : null,
    ];
  }, [withContainer]);

  useEffect(() => {
    if (!compare(errorRef.current, error)) {
      errorRef.current = error;
      console.error(error);
    }
  }, [error]);

  return (
    <Ele {...props}>
      <div
        className={`${presetCls.errDisplay} ${cssErrDisplay}${className ? ` ${className}` : ''}`}
        style={style}
      >
        {scope && (
          <div className={`${presetCls.errScope} ${cssErrScope}`}>{scope}</div>
        )}
        <div className={`${presetCls.errMsg} ${cssErrMessage}`}>
          {errMsg(error) || defaultText}
        </div>
      </div>
    </Ele>
  );
};

export default ErrorDisplay;
