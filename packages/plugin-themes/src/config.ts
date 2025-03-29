import { makeConfigurable, monacoAssetsOf } from '@react-monaco/core';

export const [setupThemes, themesConfig] = makeConfigurable({
  baseUrl: monacoAssetsOf('themes/'),
});
