"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, Brain, Tag } from "lucide-react";
import { useState } from "react";

export default function MemoryPage() {
  const memories = useQuery(api.memories.list);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = memories?.filter(m => 
    m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case "decision": return "bg-purple-100 text-purple-700 border-purple-200";
      case "lesson": return "bg-orange-100 text-orange-700 border-orange-200";
      case "project": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="text-purple-600" size={32} />
        <h1 className="text-3xl font-bold">🧠 Memory Vault</h1>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search memories, decisions, lessons..."
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered?.map((mem) => (
          <div key={mem._id} className="p-5 bg-white rounded-lg border shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getCategoryColor(mem.category)}`}>
                {mem.category.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(mem.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-800 leading-relaxed">{mem.content}</p>
          </div>
        ))}
        {filtered?.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-12">
            No memories found. Start capturing insights!
          </p>
        )}
      </div>
    </div>
  );
}
