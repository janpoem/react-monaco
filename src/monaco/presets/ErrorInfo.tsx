import { css } from '@emotion/css';
import { errMsg } from '@zenstone/ts-utils/error';
import { Container } from '../styled';
import type { PresetErrorProps } from '../types';

const PresetErrorInfo = ({
  scope,
  error,
  withContainer,
  defaultText = 'unknown error',
  className,
}: PresetErrorProps) => {
  const children = (
    <Container gap={'0.5em'} className={css`max-width: 480px;`}>
      <div>{scope && <strong>{scope}</strong>} error:</div>
      {errMsg(error) || defaultText}
    </Container>
  );

  if (!withContainer) {
    return <>{children}</>;
  }

  return (
    <Container
      fluid
      justifyContent={'center'}
      alignItems={'center'}
      className={className}
    >
      {children}
    </Container>
  );
};

export default PresetErrorInfo;
