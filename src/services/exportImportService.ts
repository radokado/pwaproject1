import { db } from '../database/db';
import { DatabaseBackup } from '../types';

export const exportImportService = {
  /**
   * Export entire IndexedDB database to downloadable JSON file
   */
  async exportDatabase(): Promise<string> {
    const customers = await db.customers.toArray();
    const gels = await db.gels.toArray();
    const visits = await db.visits.toArray();
    const settings = await db.settings.toArray();

    const backup: DatabaseBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      customers,
      gels,
      visits,
      settings,
    };

    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `NailStudio_Zaloha_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return jsonString;
  },

  /**
   * Import database from JSON file
   */
  async importDatabase(jsonFile: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const data: DatabaseBackup = JSON.parse(content);

          if (!data.customers || !data.gels || !data.visits) {
            throw new Error('Neplatná štruktúra zálohového súboru JSON.');
          }

          await db.transaction('rw', [db.customers, db.gels, db.visits, db.settings], async () => {
            await db.customers.clear();
            await db.gels.clear();
            await db.visits.clear();
            await db.settings.clear();

            if (data.customers.length) await db.customers.bulkAdd(data.customers);
            if (data.gels.length) await db.gels.bulkAdd(data.gels);
            if (data.visits.length) await db.visits.bulkAdd(data.visits);
            if (data.settings?.length) await db.settings.bulkAdd(data.settings);
          });

          resolve(true);
        } catch (err) {
          console.error('Import Error:', err);
          reject(err);
        }
      };

      reader.onerror = (err) => reject(err);
      reader.readAsText(jsonFile);
    });
  },
};
