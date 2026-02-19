import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("memories").order("desc").collect();
  },
});

export const create = mutation({
  args: { content: v.string(), category: v.union(v.literal("decision"), v.literal("lesson"), v.literal("fact"), v.literal("project")) },
  handler: async (ctx, args) => {
    await ctx.db.insert("memories", {
      content: args.content,
      category: args.category,
      createdAt: Date.now(),
    });
  },
});
