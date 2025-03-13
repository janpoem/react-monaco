import Dexie, { type EntityTable } from 'dexie';
import type { RemoteSource } from './RemoteSource';

export * from './RemoteSource';

export const db = new Dexie('MonacoDevel') as Dexie & {
  sources: EntityTable<RemoteSource, 'id'>;
};

db.version(1).stores({
  sources: '++id, [key+version]',
});
