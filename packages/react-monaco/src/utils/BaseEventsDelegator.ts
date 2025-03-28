import { isInferObj, notEmptyStr } from '@zenstone/ts-utils';
import type {
  EventEmitter,
  EventsCallbacks,
  EventsDefinition,
  EventsDelegator,
} from '../types';
import { linkEvents } from './event-emitter';

type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

// biome-ignore format: no format here
const ignoreMethods: string[] = [
  'registerEvent', 'inject', 'eject', 'toString', 'setOptions'
] as const;
// biome-ignore format: no format here
type IgnoreMethods =
  'registerEvent'| 'inject'| 'eject'| 'toString'| 'setOptions'
// 这个写法，理论上没错，但不知道为什么，实际就不生效，很神奇
// type IgnoreMethods = (typeof ignoreMethods)[number];

export type BaseEventsDelegatorOptions = {
  debug: boolean;
  [key: string]: unknown;
};

export abstract class BaseEventsDelegator<
  E extends EventsDefinition = EventsDefinition,
> implements EventsDelegator<E>
{
  options: BaseEventsDelegatorOptions = {
    debug: false,
  };

  #events: EventsCallbacks<E> = {};

  #ejection?: () => void;

  get isDebug() {
    return this.options.debug;
  }

  setOptions = (options: Partial<BaseEventsDelegatorOptions>) => {
    Object.assign(this.options, options);
    return this;
  };

  register(
    methodName:
      | Exclude<KeysMatching<this, () => unknown>, IgnoreMethods>
      | string
      | (Exclude<KeysMatching<this, () => unknown>, IgnoreMethods> | string)[]
      | {
          [K in
            | Exclude<KeysMatching<this, () => unknown>, IgnoreMethods>
            | string]?: keyof E;
        },
    event?: keyof E,
  ): this {
    if (isInferObj(methodName)) {
      for (const [m, e] of Object.entries(methodName)) {
        this.register(m, e as keyof E);
      }
      return this;
    }
    if (Array.isArray(methodName)) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      methodName.forEach((it) => this.register(it));
      return this;
    }
    const name = methodName.toString();
    if (!notEmptyStr(name) || ignoreMethods.includes(name)) return this;
    if (!(name in this)) return this;
    // @ts-ignore
    const method = this[name];
    if (typeof method !== 'function') return this;
    this.#events[event || name] = method.bind(this);
    return this;
  }

  inject = (emitter?: EventEmitter<E>) => {
    if (!emitter) {
      if (this.isDebug) {
        console.warn(
          `EventsDelegator ${this.constructor.name} inject failed, emitter is null!`,
        );
      }
      return;
    }
    linkEvents(emitter, this.#events, 'on');
    this.#ejection = () => linkEvents(emitter, this.#events, 'off');
  };

  eject = (emitter?: EventEmitter<E>) => {
    if (this.#ejection != null) {
      this.#ejection();
      this.#ejection = undefined;
      return;
    }
    if (!emitter) {
      if (this.isDebug) {
        console.warn(
          `EventsDelegator ${this.constructor.name} eject failed, emitter is null!`,
        );
      }
      return;
    }
    linkEvents(emitter, this.#events, 'off');
  };
}
