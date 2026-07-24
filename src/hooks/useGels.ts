import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../database/db';
import { Gel } from '../types';

export function useGels(searchQuery = '', typeFilter?: string) {
  const gels = useLiveQuery(async () => {
    let all = await db.gels.toArray();

    if (typeFilter && typeFilter !== 'all') {
      all = all.filter((g) => g.gelType === typeFilter);
    }

    if (!searchQuery.trim()) {
      return all.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
    }

    const query = searchQuery.toLowerCase().trim();
    return all.filter(
      (g) =>
        g.manufacturer.toLowerCase().includes(query) ||
        g.name.toLowerCase().includes(query) ||
        g.shade.toLowerCase().includes(query) ||
        (g.codeNumber && g.codeNumber.toLowerCase().includes(query)) ||
        (g.note && g.note.toLowerCase().includes(query))
    );
  }, [searchQuery, typeFilter]);

  const addGel = async (gel: Omit<Gel, 'id' | 'createdAt'>) => {
    const id = await db.gels.add({
      ...gel,
      createdAt: new Date().toISOString(),
    });
    return id;
  };

  const updateGel = async (id: number, changes: Partial<Gel>) => {
    await db.gels.update(id, changes);
  };

  const deleteGel = async (id: number) => {
    await db.gels.delete(id);
  };

  return {
    gels: gels || [],
    isLoading: gels === undefined,
    addGel,
    updateGel,
    deleteGel,
  };
}
