'use client';

import { useState } from 'react';
import { Search, FileText, Calendar, Tag } from 'lucide-react';

interface Memory {
  _id: string;
  id: string;
  content: string;
  date: string;
  type: 'daily' | 'curated' | 'note';
  tags?: string[];
  createdAt: number;
}

interface MemoryVaultProps {
  memories: Memory[];
}

export default function MemoryVault({ memories }: MemoryVaultProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const filteredMemories = memories.filter(memory => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      memory.content.toLowerCase().includes(query) ||
      memory.date.includes(query) ||
      memory.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const getTypeBadge = (type: string) => {
    const styles = {
      daily: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      curated: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      note: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[type as keyof typeof styles]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск по памяти..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Список воспоминаний */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredMemories.map(memory => (
          <div
            key={memory._id}
            onClick={() => setSelectedMemory(memory)}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-400" />
                {getTypeBadge(memory.type)}
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3 mr-1" />
                {memory.date}
              </div>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {memory.content}
            </p>
            
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {memory.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {filteredMemories.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Ничего не найдено' : 'Память пуста'}
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно с полным контентом */}
      {selectedMemory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getTypeBadge(selectedMemory.type)}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedMemory.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedMemory(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                {selectedMemory.content}
              </pre>
            </div>
            
            {selectedMemory.tags && selectedMemory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {selectedMemory.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
