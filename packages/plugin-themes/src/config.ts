import { makeConfigurable } from '@react-monaco/core';

export const [setupThemes, themesConfig] = makeConfigurable({
  baseUrl: 'https://cdn.jsdelivr.net/npm/@react-monaco/assets/assets/themes/',
});
