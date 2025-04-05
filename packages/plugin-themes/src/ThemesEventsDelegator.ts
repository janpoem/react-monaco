import {
  BaseEventsDelegator,
  isMonacoBuiltinTheme,
  isMonacoCustomTheme,
  type MonacoCustomTheme,
  type MonacoEventsDefinition,
  MonacoPresetThemes,
} from '@react-monaco/core';
import { errMsg, notEmptyStr } from '@zenstone/ts-utils';
import { themesConfig } from './config';
import type {
  CreateThemesPluginOptions,
  MonacoThemeDeclaration,
  ThemeInjectionProps,
} from './types';

// 这个代码有待优化，做得太心急了
export class ThemesEventsDelegator extends BaseEventsDelegator<
  MonacoEventsDefinition,
  ThemeInjectionProps
> {
  scopeName = ['Themes', 'color: lightgreen'];

  assetKey?: string;

  themeName?: string;

  loadedThemes: Record<string, MonacoCustomTheme> = {};

  definedThemes: Record<string, boolean> = {};

  loading?: string;

  constructor(
    public readonly settings: CreateThemesPluginOptions,
    props: ThemeInjectionProps,
  ) {
    super(props);
    this.setTheme(props.theme);
    this.register('prepareAssets').register('asset').register('mounting');
    this.debug(`constructor with theme '${props.theme}'`);
  }

  get baseUrl() {
    return this.settings.baseUrl || themesConfig('baseUrl');
  }

  setTheme(name?: string) {
    this.themeName = name || undefined;
    return this;
  }

  pickTheme = (name?: string, checkBuiltin = true) => {
    if (checkBuiltin && name && isMonacoBuiltinTheme(name)) {
      throw new Error(`'${name}' is a monaco builtin theme`);
    }
    const theme = this.settings.themes.find((it) => it.key === name);
    if (theme == null) {
      throw new Error(`unknown theme '${this.themeName}'`);
    }
    return theme;
  };

  makeThemeUrl = (theme: MonacoThemeDeclaration) =>
    new URL(theme.url || `${theme.key}.json`, this.baseUrl);

  prepareAssets = ({
    preloadAssets,
  }: MonacoEventsDefinition['prepareAssets']) => {
    try {
      const theme = this.pickTheme(this.themeName);
      const loadedTheme = theme.theme ?? this.loadedThemes[theme.key];

      if (loadedTheme != null) {
        this.debug(`theme '${theme.key}' is defined`);
        // this.defineTheme(loadedTheme);

        return;
      }

      this.assetKey = `theme/${theme.key}`;
      preloadAssets.push({
        key: this.assetKey,
        url: this.makeThemeUrl(theme),
        priority: -500,
        type: 'json',
      });
      this.debug(`add asset '${this.assetKey}'`);
    } catch (err) {
      this.debug(errMsg(err));
    }
  };

  asset = ({ key, handle, task }: MonacoEventsDefinition['asset']) => {
    if (notEmptyStr(this.themeName) && this.assetKey === key) {
      try {
        const theme = JSON.parse(new TextDecoder().decode(task.chunks));
        if (!isMonacoCustomTheme(theme)) {
          throw new Error(`'${this.assetKey}' not a valid monaco theme data`);
        }
        this.loadedThemes[this.themeName] = theme;
        this.options.onLoad?.({ isSuccess: true, theme });
      } catch (err) {
        this.debug(`parse '${this.assetKey}' JSON error`, err);
        this.options.onLoad?.({ isSuccess: false });
      }
      handle();
    }
  };

  mounting = ({ monaco }: MonacoEventsDefinition['mounting']) => {
    if (notEmptyStr(this.themeName) && !isMonacoBuiltinTheme(this.themeName)) {
      const themeDec = this.settings.themes.find(
        (it) => it.key === this.themeName,
      );
      const theme = themeDec?.theme ?? this.loadedThemes[this.themeName];
      if (theme) {
        this.defineTheme(theme);
        this.options.onLoad?.({
          isSuccess: true,
          theme: theme,
        });
      }
    }
  };

  preloadTheme = async (name?: string) => {
    this.debug(`preloadTheme ${name}`);
    try {
      if (typeof monaco === 'undefined') {
        throw new Error('Global monaco undefined');
      }
      if (this.loading) {
        throw new Error(`loading theme '${this.loading}'`);
      }

      if (name && isMonacoBuiltinTheme(name)) {
        this.debug(`'${name}' is monaco builtin theme`);
        this.options.onLoad?.({
          isSuccess: true,
          theme: MonacoPresetThemes[name],
          isPreload: true,
        });
        return;
      }

      const themeDec = this.pickTheme(name);
      const loadedTheme = themeDec.theme ?? this.loadedThemes[themeDec.key];

      if (loadedTheme != null) {
        this.debug(`'${name}' is loaded`);
        this.defineTheme(loadedTheme);
        this.options.onLoad?.({
          isSuccess: true,
          theme: loadedTheme,
          isPreload: true,
        });
        return;
      }

      this.loading = themeDec.key;

      const resp = await fetch(this.makeThemeUrl(themeDec), {
        cache: 'force-cache',
      });
      const theme = await resp.json();

      if (!isMonacoCustomTheme(theme)) {
        throw new Error(`'${this.assetKey}' not a valid monaco theme data`);
      }

      this.loadedThemes[themeDec.key] = theme;
      this.defineTheme(theme);
      this.options.onLoad?.({ isSuccess: true, theme, isPreload: true });
    } catch (err) {
      this.debug('preload theme error:', errMsg(err));
      this.options.onLoad?.({ isSuccess: false, isPreload: true });
    } finally {
      this.loading = undefined;
    }
  };

  defineTheme = (theme?: MonacoCustomTheme) => {
    if (theme == null) return this;
    if (typeof monaco === 'undefined') {
      this.debug('Global monaco undefined');
      return this;
    }
    if (!this.definedThemes[theme.name]) {
      this.definedThemes[theme.name] = true;
      monaco.editor.defineTheme(theme.name, theme.data);
      this.debug(`define theme '${theme.name}' to monaco`);
    }
    return this;
  };
}
