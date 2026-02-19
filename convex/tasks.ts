import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

export const create = mutation({
  args: { title: v.string(), priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")) },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert("tasks", {
      title: args.title,
      status: "todo",
      priority: args.priority,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const toggleStatus = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    await ctx.db.patch(args.id, {
      status: task.status === "done" ? "todo" : "done",
      updatedAt: Date.now(),
    });
  },
});

export const delete = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
