import { Option } from './Option';
import { Cell } from './Cell';

interface Singleton<T> {
  clear: () => void;
  isSet: () => boolean;
  set: (value: T) => void;
}

export interface Api<T> extends Singleton<T> {
  run: (fn: (data: T) => void) => void;
}

export interface Value<T> extends Singleton<T> {
  on: (fn: (data: T) => void) => void;
}

const revocable = <T> (doRevoke: (data: T) => void): Singleton<T> => {
  const subject = Cell(Option.none<T>());

  const revoke = (): void => subject.get().each(doRevoke);

  const clear = () => {
    revoke();
    subject.set(Option.none());
  };

  const isSet = () => subject.get().isSome();

  const set = (s: T) => {
    revoke();
    subject.set(Option.some(s));
  };

  return {
    clear,
    isSet,
    set
  };
};

export const destroyable = <T extends { destroy: () => void }> (): Singleton<T> => revocable<T>((s) => s.destroy());

export const unbindable = <T extends { unbind: () => void }> (): Singleton<T> => revocable<T>((s) => s.unbind());

export const api = <T extends { destroy: () => void }> (): Api<T> => {
  const subject = Cell(Option.none<T>());

  const revoke = () => subject.get().each((s) => s.destroy());

  const clear = () => {
    revoke();
    subject.set(Option.none());
  };

  const set = (s: T) => {
    revoke();
    subject.set(Option.some(s));
  };

  const run = (f: (data: T) => void) => subject.get().each(f);

  const isSet = () => subject.get().isSome();

  return {
    clear,
    isSet,
    set,
    run
  };
};

export const value = <T> (): Value<T> => {
  const subject = Cell(Option.none<T>());

  const clear = () => subject.set(Option.none());

  const set = (s: T) => subject.set(Option.some(s));

  const isSet = () => subject.get().isSome();

  const on = (f: (data: T) => void) => subject.get().each(f);

  return {
    clear,
    set,
    isSet,
    on
  };
};
