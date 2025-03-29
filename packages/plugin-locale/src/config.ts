import { makeConfigurable } from '@react-monaco/core';

// monacoAssetsOf('locales/')

export const [setupLocale, localeConfig] = makeConfigurable({
  baseUrl: 'https://cdn.jsdelivr.net/npm/@react-monaco/assets/assets/locales/',
});
