import React, { useState, useEffect } from 'react';
import {
  WifiOff,
  Plus,
  CheckCircle,
  Circle,
  Trash2,
  Database,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { storageService } from '../services/storageService';
import { OfflineTask } from '../types/app';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { formatDate } from '../utils/formatters';

export const OfflinePage: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [tasks, setTasks] = useState<OfflineTask[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [category, setCategory] = useState('PWA');

  useEffect(() => {
    setTasks(storageService.getTasks());
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const added = storageService.addTask(newTitle.trim(), category);
    setTasks([added, ...tasks]);
    setNewTitle('');
  };

  const handleToggle = (id: string) => {
    const updated = storageService.toggleTask(id);
    setTasks(updated);
  };

  const handleDelete = (id: string) => {
    const updated = storageService.deleteTask(id);
    setTasks(updated);
  };

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white">Offline Správca Úloh</h1>
            <Badge variant={isOnline ? 'success' : 'warning'}>
              {isOnline ? 'Online Režim' : 'Offline Režim'}
            </Badge>
          </div>
          <p className="text-slate-400 mt-1">
            Úlohy pridané alebo zmenené v offline režime sa okamžite ukladajú do lokálneho úložiska.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <Card className="border-indigo-500/20 bg-slate-900/90">
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Napr.: Otestovať načítanie bez internetu..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="PWA">PWA</option>
            <option value="Offline">Offline</option>
            <option value="Performance">Performance</option>
            <option value="Cloudflare">Cloudflare</option>
          </select>
          <Button type="submit" variant="primary">
            <Plus className="w-4 h-4" />
            Pridať Úlohu
          </Button>
        </form>
      </Card>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 space-y-3">
            <Database className="w-8 h-8 text-slate-600 mx-auto" />
            <p>Žiadne offline úlohy. Pridajte svoju prvú úlohu vyššie!</p>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card
              key={task.id}
              className={`flex items-center justify-between gap-4 transition-all ${
                task.completed ? 'opacity-60 bg-slate-950/40' : 'bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handleToggle(task.id)}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                    } truncate`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {task.category}
                    </span>
                    <span>• {formatDate(task.createdAt)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Vymazať"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
