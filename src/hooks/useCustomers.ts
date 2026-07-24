import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../database/db';
import { Customer } from '../types';

export function useCustomers(searchQuery = '') {
  const customers = useLiveQuery(async () => {
    const all = await db.customers.toArray();
    if (!searchQuery.trim()) {
      return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    const query = searchQuery.toLowerCase().trim();
    return all.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.includes(query) ||
        (c.instagram && c.instagram.toLowerCase().includes(query)) ||
        (c.note && c.note.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt' | 'visitCount'>) => {
    const id = await db.customers.add({
      ...customer,
      createdAt: new Date().toISOString(),
      visitCount: 0,
    });
    return id;
  };

  const updateCustomer = async (id: number, changes: Partial<Customer>) => {
    await db.customers.update(id, changes);
  };

  const deleteCustomer = async (id: number) => {
    await db.transaction('rw', [db.customers, db.visits], async () => {
      await db.customers.delete(id);
      await db.visits.where('customerId').equals(id).delete();
    });
  };

  return {
    customers: customers || [],
    isLoading: customers === undefined,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
