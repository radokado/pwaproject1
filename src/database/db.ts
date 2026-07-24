import Dexie, { type Table } from 'dexie';
import { Customer, Gel, Visit, AppSetting } from '../types';

export class NailStudioDatabase extends Dexie {
  customers!: Table<Customer, number>;
  gels!: Table<Gel, number>;
  visits!: Table<Visit, number>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super('NailStudioDatabase');

    this.version(1).stores({
      customers: '++id, name, phone, instagram, createdAt, lastVisitAt',
      gels: '++id, manufacturer, name, shade, codeNumber, gelType, createdAt',
      visits: '++id, customerId, date, createdAt',
      settings: 'key',
    });
  }

  /**
   * Seed initial data if the database is brand new
   */
  async seedInitialData(): Promise<void> {
    const gelsCount = await this.gels.count();
    if (gelsCount === 0) {
      const defaultGels: Omit<Gel, 'id'>[] = [
        {
          manufacturer: 'Indigo',
          name: 'Mineral Base',
          shade: 'Natural Blush',
          codeNumber: 'MB-01',
          hexColor: '#f472b6',
          gelType: 'base',
          volumeMl: 13,
          note: 'Najobľúbenejšia minerálna báza pre prirodzený vzhľad.',
          createdAt: new Date().toISOString(),
        },
        {
          manufacturer: 'Indigo',
          name: 'Protein Base',
          shade: 'Clear',
          codeNumber: 'PB-00',
          hexColor: '#e2e8f0',
          gelType: 'base',
          volumeMl: 13,
          note: 'Spevňujúca proteínová báza pre poškodené nechty.',
          createdAt: new Date().toISOString(),
        },
        {
          manufacturer: 'Victoria Vynn',
          name: 'Mega Base',
          shade: 'Nude Blush',
          codeNumber: '#02',
          hexColor: '#fb7185',
          gelType: 'base',
          volumeMl: 15,
          note: 'Elastická báza ideálna na predĺženie na šablónu.',
          createdAt: new Date().toISOString(),
        },
        {
          manufacturer: 'Semilac',
          name: 'Extend Base',
          shade: 'Milky Pink',
          codeNumber: '#802',
          hexColor: '#fbcfe8',
          gelType: 'builder',
          volumeMl: 11,
          note: 'Mliečno-ružový stavebný gél v fľaštičke.',
          createdAt: new Date().toISOString(),
        },
        {
          manufacturer: 'Indigo',
          name: 'Super Matte',
          shade: 'Top Coat',
          codeNumber: 'TOP-M',
          hexColor: '#94a3b8',
          gelType: 'top',
          volumeMl: 13,
          note: 'Zamatový matný záverečný top bez výpotku.',
          createdAt: new Date().toISOString(),
        },
      ];

      await this.gels.bulkAdd(defaultGels);

      const customerId = await this.customers.add({
        name: 'Mária Kováčová',
        phone: '+421 905 123 456',
        instagram: '@maria_kovac',
        note: 'Preferuje kratšie mandľové nechty, má citlivé nechtové lôžka.',
        createdAt: new Date().toISOString(),
        lastVisitAt: new Date().toISOString(),
        visitCount: 1,
      });

      await this.visits.add({
        customerId,
        date: new Date().toISOString().split('T')[0],
        photos: [],
        gelIds: [1, 5],
        note: 'Doplnenie minerálnou bázou Natural Blush + matný top.',
        durationMinutes: 75,
        priceEur: 35,
        tags: ['Gél lak', 'Matný', 'Mandľa'],
        createdAt: new Date().toISOString(),
      });
    }
  }
}

export const db = new NailStudioDatabase();

// Run initial seed asynchronously
db.seedInitialData().catch((err) => {
  console.error('Failed to seed initial database:', err);
});
