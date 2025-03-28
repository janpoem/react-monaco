export type MakeConfigurable<T extends object> = [
  (data: Partial<T>) => void,
  <K extends keyof T>(key: K) => T[K],
];

export const makeConfigurable = <T extends object>(
  presets: T,
): MakeConfigurable<T> => {
  const users: Partial<T> = {};

  const setup = (data: Partial<T>) => {
    Object.assign(users, data);
  };

  const getConfig = <K extends keyof T>(key: K): T[K] =>
    users[key] ?? presets[key];

  return [setup, getConfig];
};
