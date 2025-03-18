import type { DefaultRegistryData } from './types';

type MaybeNothing<T = unknown> = T | undefined | null;

type ValueOrSetter<T = unknown> = T | ((v: MaybeNothing<T>) => T);

const isSetter = <T = unknown>(
  v: ValueOrSetter<T>,
): v is (v: MaybeNothing<T>) => T => typeof v === 'function';

export class MonacoRegistry {
  #data: DefaultRegistryData = {};

  constructor(data?: DefaultRegistryData) {
    if (data != null) this.assign(data);
  }

  get = <T = unknown>(key: string, dft?: T): MaybeNothing<T> => {
    return (this.#data[key] ?? dft) as MaybeNothing<T>;
  };

  set = <T = unknown>(key: string, value: ValueOrSetter<T>) => {
    this.#data[key] = isSetter(value) ? value(this.get(key)) : value;
    return this;
  };

  get data() {
    return structuredClone(this.#data);
  }

  assign = <Data = DefaultRegistryData>(
    data: Data | ((data: Data) => Data),
  ) => {
    Object.assign(
      this.#data,
      // @ts-ignore
      typeof data === 'function' ? data(this.data) : data,
    );
    return this;
  };
}
