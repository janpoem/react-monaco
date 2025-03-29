import { isInferObj, isNumber, notEmptyStr } from '@zenstone/ts-utils';
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
  'registerEvent', 'inject', 'eject', 'toString', 'setOptions', 'debug'
] as const;
// biome-ignore format: no format here
type IgnoreMethods =
  'registerEvent'| 'inject'| 'eject'| 'toString'| 'setOptions'| 'debug'
// 这个写法，理论上没错，但不知道为什么，实际就不生效，很神奇
// type IgnoreMethods = (typeof ignoreMethods)[number];

export enum EventsDebug {
  base = 0b00_10,
}

export type EventsDelegatorOptions = {
  debug: boolean | EventsDebug | number;
  [key: string]: unknown;
};

export abstract class BaseEventsDelegator<
  Events extends EventsDefinition = EventsDefinition,
  Options extends EventsDelegatorOptions = EventsDelegatorOptions,
> implements EventsDelegator<Events>
{
  protected scopeName?: string | string[];

  options: EventsDelegatorOptions = {
    debug: false,
  };

  #events: EventsCallbacks<Events> = {};

  #ejection?: () => void;

  constructor(options?: Partial<Options>) {
    if (options != null) {
      this.setOptions(options);
    }
  }

  get isDebug() {
    return !!this.options.debug;
  }

  get isDebugBase() {
    return (
      isNumber(this.options.debug) &&
      (this.options.debug & EventsDebug.base) === EventsDebug.base
    );
  }

  debug(...args: unknown[]) {
    if (!this.isDebug) return this;
    let name: string | undefined;
    let style: string | undefined;
    if (notEmptyStr(this.scopeName)) {
      name = this.scopeName;
    } else if (Array.isArray(this.scopeName)) {
      [name, style] = this.scopeName;
    }
    if (name) {
      console.log(
        `%c[%c${name}%c]`,
        'color: gray',
        style || 'color: cyan',
        'color: gray',
        ...args,
      );
    } else {
      console.log(...args);
    }
    return this;
  }

  setOptions = (options: Partial<Options>) => {
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
            | string]?: keyof Events;
        },
    event?: keyof Events,
  ): this {
    if (isInferObj(methodName)) {
      for (const [m, e] of Object.entries(methodName)) {
        this.register(m, e as keyof Events);
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

  inject = (emitter?: EventEmitter<Events>) => {
    if (!emitter) {
      if (this.isDebug) {
        console.warn(
          `EventsDelegator ${this.constructor.name} inject failed, emitter is null!`,
        );
      }
      return;
    }
    if (this.isDebugBase) {
      this.debug('inject events', this.#events);
    }
    linkEvents(emitter, this.#events, 'on');
    this.#ejection = () => linkEvents(emitter, this.#events, 'off');
  };

  eject = (emitter?: EventEmitter<Events>) => {
    if (this.#ejection != null) {
      if (this.isDebugBase) {
        this.debug('eject events by ejection');
      }
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
    if (this.isDebugBase) {
      this.debug('eject events', this.#events);
    }
    linkEvents(emitter, this.#events, 'off');
  };
}
