import { presetCls } from '../styles';
import type { MonacoPresetProgressBarProps } from './_components';

const ProgressBar = ({
  mode,
  percent,
  indeterminate,
  width = 320,
}: MonacoPresetProgressBarProps) => {
  const isIndeterminate = percent == null || indeterminate;
  if (!mode) return null;
  return (
    <progress
      max={100}
      className={presetCls.progressBar}
      value={isIndeterminate ? undefined : percent}
      style={{ width }}
    />
  );
};

export default ProgressBar;
