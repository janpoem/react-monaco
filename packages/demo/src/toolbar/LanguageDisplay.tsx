import { Box, styled, Tooltip, useTheme } from '@mui/material';

export type LanguageDisplayProps = {
  value: string;
  tmActive?: boolean;
};

export const LanguageDisplay = ({ value, tmActive }: LanguageDisplayProps) => {
  const { palette } = useTheme();

  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      alignItems={'center'}
      gap={'0.5em'}
    >
      <Box
        sx={{
          color: palette.primary[palette.mode],
          fontFamily: 'var(--font-mono)',
          userSelect: 'none',
          textTransform: 'capitalize',
          letterSpacing: '-0.035em',
        }}
      >
        {value}
      </Box>
      {tmActive != null && (
        <Tooltip title={<TextmateHelpInfo />} arrow>
          <Box
            sx={{
              userSelect: 'none',
              color: tmActive ? palette.text.primary : palette.text.disabled,
            }}
          >
            <small>(Textmate {tmActive ? 'active' : 'inactive'})</small>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

const Info = styled(Box)`
  color: #ddd;
  a {
    color: #fff;
  }
`;

function Link({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} title={children} target={'_blank'} rel="noreferrer">
      {children}
    </a>
  );
}

function TextmateHelpInfo() {
  return (
    <Info>
      Formatter base on{' '}
      <Link href={'https://www.npmjs.com/package/vscode-oniguruma'}>
        vscode-oniguruma
      </Link>{' '}
      &{' '}
      <Link href={'https://www.npmjs.com/package/vscode-textmate'}>
        vscode-textmate
      </Link>{' '}
      &{' '}
      <Link href={'https://www.npmjs.com/package/monaco-editor-textmate'}>
        monaco-editor-textmate
      </Link>
      . tmLanguages are from{' '}
      <Link href={'https://github.com/microsoft/vscode'}>vscode</Link> project.
      And also can check from{' '}
      <Link href={'https://github.com/textmate/textmate'}>textmate</Link>{' '}
      project.
    </Info>
  );
}
