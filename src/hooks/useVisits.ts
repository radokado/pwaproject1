import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../database/db';
import { Visit } from '../types';

export function useVisits(customerId?: number) {
  const visits = useLiveQuery(async () => {
    if (customerId) {
      const list = await db.visits.where('customerId').equals(customerId).toArray();
      return list.sort((a, b) => b.date.localeCompare(a.date));
    }
    const all = await db.visits.toArray();
    return all.sort((a, b) => b.date.localeCompare(a.date));
  }, [customerId]);

  const addVisit = async (visit: Omit<Visit, 'id' | 'createdAt'>) => {
    return await db.transaction('rw', [db.visits, db.customers], async () => {
      const id = await db.visits.add({
        ...visit,
        createdAt: new Date().toISOString(),
      });

      // Update customer last visit date and increment visit count
      const customer = await db.customers.get(visit.customerId);
      if (customer) {
        await db.customers.update(visit.customerId, {
          lastVisitAt: visit.date,
          visitCount: (customer.visitCount || 0) + 1,
        });
      }

      return id;
    });
  };

  const deleteVisit = async (id: number) => {
    await db.visits.delete(id);
  };

  return {
    visits: visits || [],
    isLoading: visits === undefined,
    addVisit,
    deleteVisit,
  };
}
