'use client';

import { Users, UserCheck, UserX, Laptop } from 'lucide-react';

interface Agent {
  _id: string;
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'offline';
  currentTask?: string;
  lastActive: number;
}

interface TeamViewProps {
  agents: Agent[];
}

export default function TeamView({ agents }: TeamViewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <Laptop className="w-5 h-5 text-green-500" />;
      case 'idle':
        return <UserCheck className="w-5 h-5 text-yellow-500" />;
      case 'offline':
        return <UserX className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      working: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      idle: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      offline: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    
    const labels = {
      working: 'Working',
      idle: 'Idle',
      offline: 'Offline',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, string> = {
      researcher: '🔍',
      coder: '💻',
      writer: '✍️',
      manager: '📋',
      default: '🤖',
    };
    
    return icons[role.toLowerCase()] || icons.default;
  };

  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const workingAgents = agents.filter(a => a.status === 'working');
  const idleAgents = agents.filter(a => a.status === 'idle');
  const offlineAgents = agents.filter(a => a.status === 'offline');

  return (
    <div className="space-y-4">
      {/* Working */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
          Working ({workingAgents.length})
        </h3>
        <div className="space-y-2">
          {workingAgents.map(agent => (
            <div
              key={agent._id}
              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-lg">
                  {getRoleIcon(agent.role)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {agent.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {agent.role}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(agent.status)}
                {agent.currentTask && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[120px] truncate">
                    {agent.currentTask}
                  </p>
                )}
              </div>
            </div>
          ))}
          {workingAgents.length === 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
              Нет активных агентов
            </p>
          )}
        </div>
      </div>

      {/* Idle */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
          Idle ({idleAgents.length})
        </h3>
        <div className="space-y-2">
          {idleAgents.map(agent => (
            <div
              key={agent._id}
              className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center text-lg">
                  {getRoleIcon(agent.role)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {agent.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {agent.role}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(agent.status)}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatLastActive(agent.lastActive)}
                </p>
              </div>
            </div>
          ))}
          {idleAgents.length === 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
              Нет свободных агентов
            </p>
          )}
        </div>
      </div>

      {/* Offline */}
      {offlineAgents.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
            Offline ({offlineAgents.length})
          </h3>
          <div className="space-y-2">
            {offlineAgents.map(agent => (
              <div
                key={agent._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 opacity-60"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg">
                    {getRoleIcon(agent.role)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {agent.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {agent.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(agent.status)}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatLastActive(agent.lastActive)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {workingAgents.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Working</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {idleAgents.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Idle</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {offlineAgents.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Offline</p>
          </div>
        </div>
      </div>
    </div>
  );
}
