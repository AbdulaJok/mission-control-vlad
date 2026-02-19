import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Получить всех агентов
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

// Обновить статус агента
export const updateStatus = mutation({
  args: {
    id: v.id("agents"),
    status: v.union(v.literal("idle"), v.literal("working"), v.literal("offline")),
    currentTask: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const agent = await ctx.db.get(args.id);
    if (!agent) {
      throw new Error(`Agent ${args.id} not found`);
    }
    await ctx.db.patch(args.id, {
      status: args.status,
      currentTask: args.currentTask,
      lastSeen: now,
    });
  },
});

// Синхронизация агентов из sessions_list
export const syncFromSessions = mutation({
  args: {
    agents: v.array(v.object({
      name: v.string(),
      role: v.string(),
      status: v.union(v.literal("idle"), v.literal("working"), v.literal("offline")),
      currentTask: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existingAgents = await ctx.db.query("agents").collect();
    const incomingNames = new Set(args.agents.map(a => a.name));

    // Помечаем отсутствующих как offline
    for (const agent of existingAgents) {
      if (!incomingNames.has(agent.name)) {
        await ctx.db.patch(agent._id, {
          status: "offline",
          lastSeen: now,
        });
      }
    }

    // Обновляем или создаем
    for (const agentData of args.agents) {
      const existing = existingAgents.find(a => a.name === agentData.name);
      if (existing) {
        await ctx.db.patch(existing._id, {
          role: agentData.role,
          status: agentData.status,
          currentTask: agentData.currentTask,
          lastSeen: now,
        });
      } else {
        await ctx.db.insert("agents", {
          name: agentData.name,
          role: agentData.role,
          status: agentData.status,
          currentTask: agentData.currentTask,
          lastSeen: now,
        });
      }
    }
  },
});
