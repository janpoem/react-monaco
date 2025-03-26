import { isInferObj } from '@zenstone/ts-utils/object';
import Emittery from 'emittery';
import { useRef } from 'react';

type MaybePromise<T> = T | Promise<T>;

export type EmitteryEventCallbacks<T> = (
  params: T,
) => MaybePromise<void> | ((params: T) => MaybePromise<void>[]);

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type EmitteryEventsDefinition = Record<PropertyKey, any>;

export type EmitteryEventsInput<
  Events extends EmitteryEventsDefinition = EmitteryEventsDefinition,
> = Partial<{
  [Key in keyof Events]: EmitteryEventCallbacks<Events[Key]>;
}>;

export interface EmitteryEventsDelegator<
  E extends EmitteryEventsDefinition = EmitteryEventsDefinition,
> {
  __inject: (emitter: Emittery<E>) => void;

  __eject: (emitter: Emittery<E>) => void;
}

export const isEventsDelegator = <
  E extends EmitteryEventsDefinition = EmitteryEventsDefinition,
>(
  obj: unknown,
) =>
  isInferObj<EmitteryEventsDelegator<E>>(
    obj,
    (it) =>
      Object.hasOwn(it, '__inject') &&
      typeof it.__inject === 'function' &&
      Object.hasOwn(it, '__eject') &&
      typeof it.__eject === 'function',
  );

export type EmitteryLinkType = 'on' | 'off';

export const initEmittery = <
  E extends EmitteryEventsDefinition = EmitteryEventsDefinition,
>(
  input?: Emittery<E> | EmitteryEventsInput<E> | EmitteryEventsDelegator<E>,
): Emittery<E> => {
  if (input == null) return new Emittery<E>();
  if (input instanceof Emittery) return input;
  return linkEmitteryEvents(new Emittery<E>(), input);
};

export const linkEmitteryEvents = <
  E extends EmitteryEventsDefinition = EmitteryEventsDefinition,
>(
  emitter: Emittery<E>,
  input: EmitteryEventsInput<E> | EmitteryEventsDelegator<E>,
  type: EmitteryLinkType = 'on',
) => {
  if (isEventsDelegator(input)) {
    type === 'on' ? input.__inject(emitter) : input.__eject(emitter);
    return emitter;
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const linkCurry = (name: PropertyKey) => (fn: any) => {
    type === 'on' ? emitter.on(name, fn) : emitter.off(name, fn);
  };

  for (const [name, callback] of Object.entries(input)) {
    if (!name || callback == null) continue;
    const link = linkCurry(name);
    if (Array.isArray(callback)) {
      callback.forEach(link);
    } else {
      link(callback);
    }
  }
  return emitter;
};

export const useEmitteryInit = <
  E extends EmitteryEventsDefinition = EmitteryEventsDefinition,
>(
  input?: Emittery<E> | EmitteryEventsInput<E>,
) => {
  const ref = useRef<Emittery<E> | undefined>(undefined);

  if (ref.current == null) {
    ref.current = initEmittery(input);
  }

  return ref;
};
