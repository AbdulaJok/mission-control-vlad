import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Получить все задачи
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// Получить задачи по статусу
export const getByStatus = query({
  args: { status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")) },
  handler: async (ctx, args) => {
    return await ctx.db.query("tasks").withIndex("by_status", (q) => q.eq("status", args.status)).collect();
  },
});

// Создать задачу
export const create = mutation({
  args: {
    title: v.string(),
    category: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const taskId = `task_${now}`;
    await ctx.db.insert("tasks", {
      id: taskId,
      title: args.title,
      status: "todo",
      category: args.category,
      priority: args.priority || "medium",
      createdAt: now,
      updatedAt: now,
    });
    return taskId;
  },
});

// Обновить статус задачи
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error(`Task ${args.id} not found`);
    }
    const completedAt = args.status === "done" ? now : undefined;
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: now,
      completedAt,
    });
  },
});

// Удалить задачу
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Синхронизация из файлов (вызывается скриптом sync-files.ts)
export const syncFromFiles = mutation({
  args: {
    tasks: v.array(v.object({
      id: v.string(),
      title: v.string(),
      status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")),
      category: v.optional(v.string()),
      priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Получаем текущие задачи
    const existingTasks = await ctx.db.query("tasks").collect();
    const existingIds = new Set(existingTasks.map(t => t.id));
    const incomingIds = new Set(args.tasks.map(t => t.id));
    
    // Удаляем задачи, которых нет во входных данных
    for (const task of existingTasks) {
      if (!incomingIds.has(task.id)) {
        await ctx.db.delete(task._id);
      }
    }
    
    // Обновляем или создаем задачи
    for (const taskData of args.tasks) {
      const existing = existingTasks.find(t => t.id === taskData.id);
      if (existing) {
        // Обновляем
        await ctx.db.patch(existing._id, {
          title: taskData.title,
          status: taskData.status,
          category: taskData.category,
          priority: taskData.priority,
          updatedAt: now,
        });
      } else {
        // Создаем
        await ctx.db.insert("tasks", {
          id: taskData.id,
          title: taskData.title,
          status: taskData.status,
          category: taskData.category,
          priority: taskData.priority,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  },
});
