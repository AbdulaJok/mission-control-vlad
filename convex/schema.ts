import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  memories: defineTable({
    content: v.string(),
    category: v.union(v.literal("decision"), v.literal("lesson"), v.literal("fact"), v.literal("project")),
    createdAt: v.number(),
  }),

  calendarEvents: defineTable({
    title: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
  }),

  agents: defineTable({
    name: v.string(),
    role: v.string(),
    status: v.union(v.literal("idle"), v.literal("working"), v.literal("offline")),
    currentTask: v.optional(v.string()),
    lastSeen: v.number(),
  }),

  events: defineTable({
    title: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    source: v.union(v.literal("google"), v.literal("notion"), v.literal("manual")),
  }),
});
