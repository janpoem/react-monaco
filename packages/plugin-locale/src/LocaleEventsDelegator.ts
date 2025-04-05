import {
  BaseEventsDelegator,
  type MonacoEventsDefinition,
  updateMonacoEnvironment,
} from '@react-monaco/core';
import { isInferObj, notEmptyStr } from '@zenstone/ts-utils';
import { localeConfig } from './config';
import { MonacoLocales } from './locales';
import type { LocaleInjectionProps } from './types';

declare global {
  interface Window {
    MonacoLocales?: Record<string, unknown> | undefined;
  }
}

export class LocaleEventsDelegator extends BaseEventsDelegator<
  MonacoEventsDefinition,
  LocaleInjectionProps
> {
  scopeName = 'Locale';

  locale?: string;

  assetKey = '';

  constructor(props: LocaleInjectionProps) {
    super(props);
    this.locale = props.locale;
    this.register('prepareAssets').register('asset');
    this.debug(`constructor with locale '${this.locale}'`);
  }

  get baseUrl() {
    return this.options.baseUrl || localeConfig('baseUrl');
  }

  prepareAssets = ({
    preloadAssets,
  }: MonacoEventsDefinition['prepareAssets']) => {
    const locale = MonacoLocales.find((it) => it.key === this.locale);
    if (locale == null) {
      this.debug(`unknown locale '${this.locale}'`);
      return;
    }

    if (window.MonacoLocales?.[locale.key] != null) {
      updateMonacoEnvironment({ locale: locale.key });
      this.debug(`'${this.locale}' is loaded`);
      return;
    }

    this.assetKey = `locale/${locale.key}`;
    preloadAssets.push({
      key: this.assetKey,
      url: new URL(`${locale.key}.json`, this.baseUrl),
      priority: -1000,
      type: 'json',
    });
    this.debug(`add asset '${this.assetKey}'`);
  };

  asset = ({ key, handle, task }: MonacoEventsDefinition['asset']) => {
    if (notEmptyStr(this.locale) && this.assetKey === key) {
      try {
        const json = JSON.parse(new TextDecoder().decode(task.chunks));
        if (isInferObj(json)) {
          this.injectLocale(this.locale, json);
        }
      } catch (err) {
        console.error(`Locale: parse '${this.assetKey}' JSON error`, err);
      }
      handle();
    }
  };

  injectLocale = (locale: string, data: Record<string, unknown>) => {
    if (window.MonacoLocales == null) window.MonacoLocales = {};
    window.MonacoLocales[locale] = data;
    updateMonacoEnvironment({ locale });
    this.debug(`inject locale '${locale}' into MonacoEnvironment`);
  };

  switchLocale = async (locale?: string) => {
    if (typeof monaco === 'undefined') return;
    this.debug(`switch locale to '${locale}'`);
    this.locale = locale;
    // biome-ignore lint/performance/noDelete: <explanation>
    delete window.MonacoEnvironment;
  };
}
