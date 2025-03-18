import Dexie, { type EntityTable } from 'dexie';
import type { RemoteSource } from './RemoteSource';

export * from './RemoteSource';

export const db = new Dexie('MonacoDevel') as Dexie & {
  sources: EntityTable<RemoteSource, 'id'>;
};

db.version(1).stores({
  sources: '++id, [key+version]',
});

db.version(2)
  .stores({
    sources: '++id, key',
  })
  .upgrade((trans) => {
    console.log('upgrade');
    trans
      .table('sources')
      .toArray()
      .then((res) => {
        // biome-ignore lint/complexity/noForEach: <explanation>
        res.forEach((row) => {
          trans.table('sources').delete(row.id);
        });
      });
  });
