import { isInferObj } from '@zenstone/ts-utils';
import Emittery from 'emittery';
import { useRef } from 'react';
import type {
  EventEmitter,
  EventsCallbacks,
  EventsDefinition,
  EventsDelegator,
  EventsInput,
} from '../types';

export const isEventsDelegator = <
  E extends EventsDefinition = EventsDefinition,
>(
  obj: unknown,
) =>
  isInferObj<EventsDelegator<E>>(
    obj,
    (it) => typeof it.inject === 'function' && typeof it.eject === 'function',
  );

export const isEventEmitter = <E extends EventsDefinition = EventsDefinition>(
  obj: unknown,
) =>
  isInferObj<EventEmitter<E>>(
    obj,
    (it) =>
      typeof it.emit === 'function' &&
      typeof it.on === 'function' &&
      typeof it.off === 'function',
  );

const createEventEmitter = <
  E extends EventsDefinition = EventsDefinition,
>(): EventEmitter<E> => {
  return new Emittery<E>();
};

export const initEventEmitter = <E extends EventsDefinition = EventsDefinition>(
  input: EventsInput<E> | null | undefined,
  create = createEventEmitter,
): EventEmitter<E> => {
  if (input == null) return create();
  if (isEventEmitter<E>(input)) return input;
  return linkEvents(create(), input);
};

export type LinkEventMode = 'on' | 'off';

export const linkEvents = <E extends EventsDefinition = EventsDefinition>(
  emitter: EventEmitter<E>,
  input: EventsCallbacks<E> | EventsDelegator<E>,
  mode: LinkEventMode = 'on',
) => {
  if (isEventsDelegator(input)) {
    mode === 'on' ? input.inject(emitter) : input.eject(emitter);
    return emitter;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const linkCurry = (name: PropertyKey) => (fn: any) => {
    mode === 'on' ? emitter.on(name, fn) : emitter.off(name, fn);
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

export const useEventEmitterRef = <
  E extends EventsDefinition = EventsDefinition,
>(
  input: EventsInput<E> | null | undefined,
) => {
  const ref = useRef<EventEmitter<E> | undefined>(undefined);

  if (ref.current == null) {
    ref.current = initEventEmitter(input);
  }

  return ref;
};
