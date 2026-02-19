import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Получить последние воспоминания
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    return await ctx.db.query("memories").order("desc").take(limit);
  },
});

// Поиск по воспоминаниям
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const allMemories = await ctx.db.query("memories").collect();
    const searchTerm = args.query.toLowerCase();
    
    return allMemories.filter(m => 
      m.content.toLowerCase().includes(searchTerm) ||
      m.date.includes(searchTerm) ||
      (m.tags && m.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  },
});

// Синхронизация из файлов
export const syncFromFiles = mutation({
  args: {
    memories: v.array(v.object({
      id: v.string(),
      content: v.string(),
      date: v.string(),
      type: v.union(v.literal("daily"), v.literal("curated"), v.literal("note")),
      tags: v.optional(v.array(v.string())),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const existingMemories = await ctx.db.query("memories").collect();
    const existingIds = new Set(existingMemories.map(m => m.id));
    const incomingIds = new Set(args.memories.map(m => m.id));
    
    // Удаляем старые
    for (const memory of existingMemories) {
      if (!incomingIds.has(memory.id)) {
        await ctx.db.delete(memory._id);
      }
    }
    
    // Обновляем или создаем
    for (const memoryData of args.memories) {
      const existing = existingMemories.find(m => m.id === memoryData.id);
      
      if (existing) {
        await ctx.db.patch(existing._id, {
          content: memoryData.content,
          date: memoryData.date,
          type: memoryData.type,
          tags: memoryData.tags,
        });
      } else {
        await ctx.db.insert("memories", {
          id: memoryData.id,
          content: memoryData.content,
          date: memoryData.date,
          type: memoryData.type,
          tags: memoryData.tags,
          createdAt: now,
        });
      }
    }
  },
});
