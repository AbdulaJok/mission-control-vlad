'use client';

import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import TasksBoard from '@/components/TasksBoard';
import MemoryVault from '@/components/MemoryVault';
import TeamView from '@/components/TeamView';
import { Activity, Brain, Users } from 'lucide-react';

export default function Home() {
  const tasks = useQuery(api.tasks.list);
  const memories = useQuery(api.memories.listRecent, { limit: 10 });
  const agents = useQuery(api.agents.list);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Mission Control
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Цифровой офис Влад + Jake
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Activity className="w-4 h-4 mr-1" />
                Online
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Board - 2 колонки */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tasks Board
                </h2>
              </div>
              <TasksBoard tasks={tasks || []} />
            </div>
          </div>

          {/* Правая колонка - Team и Memory */}
          <div className="space-y-8">
            {/* Team View */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Team
                </h2>
              </div>
              <TeamView agents={agents || []} />
            </div>

            {/* Memory Vault */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <Brain className="w-5 h-5 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Memory
                </h2>
              </div>
              <MemoryVault memories={memories || []} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
