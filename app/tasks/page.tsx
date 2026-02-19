"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";

export default function TasksPage() {
  const tasks = useQuery(api.tasks.list);
  const addTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggleStatus);
  const deleteTask = useMutation(api.tasks.delete);
  
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask({ title: newTask, priority: "medium" });
    setNewTask("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📋 Tasks Board</h1>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} /> Add
        </button>
      </form>

      <div className="space-y-3">
        {tasks?.map((task) => (
          <div key={task._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow border hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <button onClick={() => toggleTask({ id: task._id })} className="text-gray-400 hover:text-blue-500">
                {task.status === "done" ? <CheckCircle className="text-green-500" /> : <Circle />}
              </button>
              <span className={task.status === "done" ? "line-through text-gray-400" : "font-medium"}>
                {task.title}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                task.priority === "high" ? "bg-red-100 text-red-700" :
                task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {task.priority}
              </span>
            </div>
            <button onClick={() => deleteTask({ id: task._id })} className="text-gray-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {tasks?.length === 0 && (
          <p className="text-center text-gray-500 py-8">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}
