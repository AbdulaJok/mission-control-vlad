#!/usr/bin/env tsx
/**
 * Синхронизация файлов OpenClaw с Convex
 * Запускается периодически для обновления данных в Mission Control
 */

import * as fs from 'fs';
import * as path from 'path';
import { ConvexClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const WORKSPACE_ROOT = '/home/clawd/.openclaw/workspace';
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error('❌ NEXT_PUBLIC_CONVEX_URL не установлен');
  process.exit(1);
}

const client = new ConvexClient(CONVEX_URL);

// Парсинг tasks.md
function parseTasksFile(content: string) {
  const tasks = [];
  const lines = content.split('\n');
  let currentCategory = 'Общее';
  
  for (const line of lines) {
    // Заголовок категории
    const categoryMatch = line.match(/^##\s+(.+)$/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }
    
    // Задача
    const taskMatch = line.match(/^-\s+\[([ x])\]\s+(.+)$/);
    if (taskMatch) {
      const isDone = taskMatch[1] === 'x';
      const title = taskMatch[2].trim();
      
      tasks.push({
        id: `task_${Date.now()}_${title.substring(0, 20).replace(/\s/g, '_')}`,
        title,
        status: isDone ? 'done' : 'todo',
        category: currentCategory,
        priority: 'medium' as const,
      });
    }
  }
  
  return tasks;
}

// Парсинг daily logs
function parseDailyLogs() {
  const memories: any[] = [];
  const memoryDir = path.join(WORKSPACE_ROOT, 'memory');
  
  if (!fs.existsSync(memoryDir)) {
    console.warn('⚠️ Папка memory не найдена');
    return memories;
  }
  
  const files = fs.readdirSync(memoryDir)
    .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort()
    .reverse()
    .slice(0, 20); // Последние 20 записей
  
  for (const file of files) {
    const filePath = path.join(memoryDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const date = file.replace('.md', '');
    
    memories.push({
      id: `daily_${date}`,
      content: content.substring(0, 1000), // Первые 1000 символов
      date,
      type: 'daily' as const,
      tags: ['daily', 'log'],
    });
  }
  
  return memories;
}

// Парсинг MEMORY.md
function parseMemoryMd() {
  const memoryPath = path.join(WORKSPACE_ROOT, 'MEMORY.md');
  
  if (!fs.existsSync(memoryPath)) {
    console.warn('⚠️ MEMORY.md не найден');
    return [];
  }
  
  const content = fs.readFileSync(memoryPath, 'utf-8');
  
  return [{
    id: 'memory_curated',
    content: content.substring(0, 2000), // Первые 2000 символов
    date: new Date().toISOString().split('T')[0],
    type: 'curated' as const,
    tags: ['memory', 'curated'],
  }];
}

async function main() {
  console.log('🔄 Начало синхронизации...');
  
  try {
    // Синхронизация задач
    const tasksPath = path.join(WORKSPACE_ROOT, 'memory', 'tasks.md');
    let tasks: any[] = [];
    
    if (fs.existsSync(tasksPath)) {
      const tasksContent = fs.readFileSync(tasksPath, 'utf-8');
      tasks = parseTasksFile(tasksContent);
      console.log(`✅ Задачи: ${tasks.length} найдено`);
    } else {
      console.warn('⚠️ tasks.md не найден');
    }
    
    await client.mutation(api.tasks.syncFromFiles, { tasks });
    
    // Синхронизация воспоминаний
    const memories = [
      ...parseDailyLogs(),
      ...parseMemoryMd(),
    ];
    console.log(`✅ Воспоминания: ${memories.length} найдено`);
    
    await client.mutation(api.memories.syncFromFiles, { memories });
    
    console.log('✅ Синхронизация завершена');
  } catch (error) {
    console.error('❌ Ошибка синхронизации:', error);
    process.exit(1);
  }
}

main();
