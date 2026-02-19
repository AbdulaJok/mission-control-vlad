import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Получить события календаря
export const list = query({
  args: { 
    from: v.optional(v.number()),
    to: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("events").order("asc").collect();
    
    // Фильтрация по дате если указано
    if (args.from) {
      events = events.filter(e => e.startTime >= args.from!);
    }
    if (args.to) {
      events = events.filter(e => e.startTime <= args.to!);
    }
    
    return events;
  },
});

// Создать событие
export const create = mutation({
  args: {
    title: v.string(),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    source: v.optional(v.union(v.literal("google"), v.literal("cron"), v.literal("manual"))),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const eventId = `event_${now}`;
    
    await ctx.db.insert("events", {
      id: eventId,
      title: args.title,
      startTime: args.startTime,
      endTime: args.endTime,
      source: args.source || "manual",
      description: args.description,
    });
    
    return eventId;
  },
});

// Удалить событие
export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Синхронизация из Google Calendar + Cron
export const syncFromSources = mutation({
  args: {
    events: v.array(v.object({
      id: v.string(),
      title: v.string(),
      startTime: v.number(),
      endTime: v.optional(v.number()),
      source: v.union(v.literal("google"), v.literal("cron"), v.literal("manual")),
      description: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const existingEvents = await ctx.db.query("events").collect();
    const existingIds = new Set(existingEvents.map(e => e.id));
    const incomingIds = new Set(args.events.map(e => e.id));
    
    // Удаляем старые
    for (const event of existingEvents) {
      if (!incomingIds.has(event.id)) {
        await ctx.db.delete(event._id);
      }
    }
    
    // Обновляем или создаем
    for (const eventData of args.events) {
      const existing = existingEvents.find(e => e.id === eventData.id);
      
      if (existing) {
        await ctx.db.patch(existing._id, {
          title: eventData.title,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          source: eventData.source,
          description: eventData.description,
        });
      } else {
        await ctx.db.insert("events", {
          id: eventData.id,
          title: eventData.title,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          source: eventData.source,
          description: eventData.description,
        });
      }
    }
  },
});
