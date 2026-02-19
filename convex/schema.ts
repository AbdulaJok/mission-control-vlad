import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Задачи (синхронизация с memory/tasks.md)
  tasks: defineTable({
    id: v.string(), // Уникальный ID задачи
    title: v.string(),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    category: v.optional(v.string()), // Например: "Физика", "Математика"
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_status", ["status"])
    .index("by_category", ["category"]),

  // Воспоминания (синхронизация с MEMORY.md и memory/*.md)
  memories: defineTable({
    id: v.string(),
    content: v.string(),
    date: v.string(), // YYYY-MM-DD
    type: v.union(v.literal("daily"), v.literal("curated"), v.literal("note")),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_date", ["date"])
    .index("by_type", ["type"]),

  // Агенты (суб-агенты Jake)
  agents: defineTable({
    id: v.string(),
    name: v.string(),
    role: v.string(), // "researcher", "coder", "writer"
    status: v.union(v.literal("idle"), v.literal("working"), v.literal("offline")),
    currentTask: v.optional(v.string()),
    lastActive: v.number(),
  }).index("by_status", ["status"]),

  // События календаря (Google Calendar + Cron)
  events: defineTable({
    id: v.string(),
    title: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    source: v.union(v.literal("google"), v.literal("cron"), v.literal("manual")),
    description: v.optional(v.string()),
  }).index("by_time", ["startTime"]),
});
