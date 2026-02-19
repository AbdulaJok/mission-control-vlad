import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    id: v.string(),
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
      lastActive: now,
    });
  },
});

// Синхронизация агентов из sessions_list
export const syncFromSessions = mutation({
  args: {
    agents: v.array(v.object({
      id: v.string(),
      name: v.string(),
      role: v.string(),
      status: v.union(v.literal("idle"), v.literal("working"), v.literal("offline")),
      currentTask: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const existingAgents = await ctx.db.query("agents").collect();
    const existingIds = new Set(existingAgents.map(a => a.id));
    const incomingIds = new Set(args.agents.map(a => a.id));
    
    // Помечаем отсутствующих как offline
    for (const agent of existingAgents) {
      if (!incomingIds.has(agent.id)) {
        await ctx.db.patch(agent._id, {
          status: "offline",
          lastActive: now,
        });
      }
    }
    
    // Обновляем или создаем
    for (const agentData of args.agents) {
      const existing = existingAgents.find(a => a.id === agentData.id);
      
      if (existing) {
        await ctx.db.patch(existing._id, {
          name: agentData.name,
          role: agentData.role,
          status: agentData.status,
          currentTask: agentData.currentTask,
          lastActive: now,
        });
      } else {
        await ctx.db.insert("agents", {
          id: agentData.id,
          name: agentData.name,
          role: agentData.role,
          status: agentData.status,
          currentTask: agentData.currentTask,
          lastActive: now,
        });
      }
    }
  },
});
