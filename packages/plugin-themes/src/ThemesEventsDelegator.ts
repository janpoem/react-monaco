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

export class ThemesEventsDelegator extends BaseEventsDelegator<MonacoEventsDefinition> {
  assetKey?: string;

  themeName?: string;

  loadedThemes: Record<string, MonacoCustomTheme> = {};

  definedThemes: Record<string, boolean> = {};

  loading?: string;

  constructor(
    public readonly settings: CreateThemesPluginOptions,
    public readonly props: ThemeInjectionProps,
  ) {
    super();
    this.setTheme(props.theme);
    this.register('prepareAssets').register('asset').register('mounting');
  }

  get baseUrl() {
    return this.settings.baseUrl || themesConfig('baseUrl');
  }

  setTheme(name?: string) {
    this.themeName = name || undefined;
    return this;
  }

  pickTheme = (name?: string) => {
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
        this.isDebug && console.log(`Locale: '${theme.key}' is loaded`);
        this.defineTheme(loadedTheme);
        this.props.onLoad?.({
          isSuccess: true,
          theme: loadedTheme,
        });
        return;
      }

      this.assetKey = `theme/${theme.key}`;
      preloadAssets.push({
        key: this.assetKey,
        url: this.makeThemeUrl(theme),
        priority: -500,
        type: 'json',
      });
      this.isDebug &&
        console.log(`Themes: add asset '${this.assetKey}' to preload`);
    } catch (err) {
      this.isDebug && console.log(`Themes: ${errMsg(err)}`);
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
        this.props.onLoad?.({ isSuccess: true, theme });
      } catch (err) {
        console.error(`Themes: parse '${this.assetKey}' JSON error`, err);
        this.props.onLoad?.({ isSuccess: false });
      }
      handle();
    }
  };

  mounting = ({ monaco }: MonacoEventsDefinition['mounting']) => {
    if (notEmptyStr(this.themeName)) {
      this.defineTheme(this.loadedThemes[this.themeName]);
    }
  };

  preloadTheme = async (name?: string) => {
    try {
      if (typeof monaco === 'undefined') {
        throw new Error('Global monaco undefined');
      }
      if (this.loading) {
        throw new Error(`loading theme '${this.loading}'`);
      }

      if (name && isMonacoBuiltinTheme(name)) {
        this.isDebug &&
          console.log(`Themes: '${name}' is monaco builtin theme`);
        this.props.onLoad?.({
          isSuccess: true,
          theme: MonacoPresetThemes[name],
          isPreload: true,
        });
        return;
      }

      const themeDec = this.pickTheme(name);
      const loadedTheme = themeDec.theme ?? this.loadedThemes[themeDec.key];

      if (loadedTheme != null) {
        this.isDebug && console.log(`Themes: '${name}' is loaded`);
        this.defineTheme(loadedTheme);
        this.props.onLoad?.({
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
      this.props.onLoad?.({ isSuccess: true, theme, isPreload: true });
    } catch (err) {
      this.isDebug && console.log(`Themes: ${errMsg(err)}`);
      this.props.onLoad?.({ isSuccess: false, isPreload: true });
    } finally {
      this.loading = undefined;
    }
  };

  defineTheme = (theme?: MonacoCustomTheme) => {
    if (theme == null) return this;
    if (typeof monaco === 'undefined') {
      console.log('Themes: Global monaco undefined');
      return this;
    }
    if (!this.definedThemes[theme.name]) {
      this.definedThemes[theme.name] = true;
      monaco.editor.defineTheme(theme.name, theme.data);
    }
    return this;
  };
}
