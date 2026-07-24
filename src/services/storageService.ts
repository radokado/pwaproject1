import { OfflineTask } from '../types/app';

const TASKS_KEY = 'pwaproject1_offline_tasks';
const SETTINGS_KEY = 'pwaproject1_user_settings';

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  offlineNotifications: boolean;
  autoSync: boolean;
}

export const storageService = {
  getTasks(): OfflineTask[] {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      if (!data) return this.getInitialTasks();
      return JSON.parse(data);
    } catch {
      return this.getInitialTasks();
    }
  },

  saveTasks(tasks: OfflineTask[]): void {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to local storage', err);
    }
  },

  addTask(title: string, category: string): OfflineTask {
    const tasks = this.getTasks();
    const newTask: OfflineTask = {
      id: crypto.randomUUID(),
      title,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      synced: navigator.onLine,
    };
    const updated = [newTask, ...tasks];
    this.saveTasks(updated);
    return newTask;
  },

  toggleTask(id: string): OfflineTask[] {
    const tasks = this.getTasks();
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    this.saveTasks(updated);
    return updated;
  },

  deleteTask(id: string): OfflineTask[] {
    const tasks = this.getTasks();
    const updated = tasks.filter((t) => t.id !== id);
    this.saveTasks(updated);
    return updated;
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        return { theme: 'dark', offlineNotifications: true, autoSync: true };
      }
      return JSON.parse(data);
    } catch {
      return { theme: 'dark', offlineNotifications: true, autoSync: true };
    }
  },

  saveSettings(settings: UserSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  getInitialTasks(): OfflineTask[] {
    const defaults: OfflineTask[] = [
      {
        id: '1',
        title: 'Nainštalovať aplikáciu pwaproject1 na domovskú obrazovku',
        category: 'PWA',
        completed: false,
        createdAt: new Date().toISOString(),
        synced: true,
      },
      {
        id: '2',
        title: 'Vyskúšať offline režim odpojením od internetu',
        category: 'Offline',
        completed: false,
        createdAt: new Date().toISOString(),
        synced: true,
      },
      {
        id: '3',
        title: 'Skontrolovať Lighthouse skóre a PWA audit',
        category: 'Performance',
        completed: true,
        createdAt: new Date().toISOString(),
        synced: true,
      },
    ];
    this.saveTasks(defaults);
    return defaults;
  },
};
