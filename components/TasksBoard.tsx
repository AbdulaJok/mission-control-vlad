'use client';

import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { CheckCircle, Circle, Clock, Trash2 } from 'lucide-react';

interface Task {
  _id: string;
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: number;
  updatedAt: number;
}

interface TasksBoardProps {
  tasks: Task[];
}

export default function TasksBoard({ tasks }: TasksBoardProps) {
  const updateStatus = useMutation(api.tasks.updateStatus);
  const removeTask = useMutation(api.tasks.remove);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    
    const labels = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    const styles = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const handleStatusChange = (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    updateStatus({ id: taskId, status: newStatus });
  };

  const handleDelete = (taskId: string) => {
    if (confirm('Удалить эту задачу?')) {
      removeTask({ id: taskId });
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="space-y-6">
      {/* To Do */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          To Do ({todoTasks.length})
        </h3>
        <div className="space-y-2">
          {todoTasks.map(task => (
            <div
              key={task._id}
              className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-start space-x-3 flex-1">
                {getStatusIcon(task.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {task.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.category}
                      </span>
                    )}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStatusChange(task._id, 'in_progress')}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Start
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {todoTasks.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
              Нет задач
            </p>
          )}
        </div>
      </div>

      {/* In Progress */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          In Progress ({inProgressTasks.length})
        </h3>
        <div className="space-y-2">
          {inProgressTasks.map(task => (
            <div
              key={task._id}
              className="flex items-start justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
            >
              <div className="flex items-start space-x-3 flex-1">
                {getStatusIcon(task.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {task.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.category}
                      </span>
                    )}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStatusChange(task._id, 'done')}
                  className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {inProgressTasks.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
              Нет активных задач
            </p>
          )}
        </div>
      </div>

      {/* Done */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Done ({doneTasks.length})
        </h3>
        <div className="space-y-2">
          {doneTasks.slice(0, 5).map(task => (
            <div
              key={task._id}
              className="flex items-start justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 opacity-75"
            >
              <div className="flex items-start space-x-3 flex-1">
                {getStatusIcon(task.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-through">
                    {task.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {doneTasks.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
              Нет выполненных задач
            </p>
          )}
          {doneTasks.length > 5 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
              + ещё {doneTasks.length - 5}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
