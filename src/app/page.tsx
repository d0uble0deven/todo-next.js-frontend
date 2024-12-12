"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "./services/api";
import { FaRegTrashAlt, FaRegClipboard, FaPlus } from "react-icons/fa"; // Import icons
import { FaCheck } from "react-icons/fa"; // Import checkmark icon

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch the list of tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Toggle task completion status
  const toggleCompletion = async (id: number, completed: boolean) => {
    try {
      await api.put(`/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task with confirmation prompt
  const deleteTask = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      {/* Header Section */}
      <header className="bg-[#0D0D0D] h-56 relative flex justify-center items-center">
        <div className="container mx-auto relative">
          <span className="absolute bottom-1/2 transform translate-y-1/2 left-[46%]">
            <img src="/Logo.png" alt="Logo" />
          </span>
        </div>

        {/* Create Task Button */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-1.5rem] w-full max-w-[705px]">
          <Link href="/create-edit">
            <button className="flex items-center justify-center px-6 py-3 bg-[#1E6F9F] text-white rounded-md hover:bg-[#155e7b] w-full">
              <span>Create Task</span>
              <span className="ml-3 w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                <FaPlus className="text-[white]" />
              </span>
            </button>
          </Link>
        </div>
      </header>

      {/* Task Summary Section */}
      <div className="container mx-auto mt-20 p-4 rounded-md max-w-[736px]">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold" style={{ color: "#1E6F9F" }}>
            Tasks
            <span className="bg-[#2C2C2C] text-white rounded-full px-3 py-1 ml-1">
              {totalTasks}
            </span>
          </div>
          <div className="text-lg font-semibold" style={{ color: "#5E60CE" }}>
            Completed
            <span className="bg-[#2C2C2C] text-white rounded-full px-3 py-1 ml-1">
              {completedTasks} de {totalTasks}
            </span>
          </div>
        </div>

        {/* Task List */}
        {tasks.length > 0 ? (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 bg-[#2C2C2C] rounded-md flex justify-between items-start"
              >
                <div className="flex items-start space-x-6 w-full">
                  <button
                    onClick={() => toggleCompletion(task.id, task.completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                      task.completed
                        ? "bg-[#5E60CE] border-[#5E60CE]"
                        : "border-[#1E6F9F]"
                    }`}
                  >
                    {task.completed && <FaCheck className="text-white" />}
                  </button>
                  <Link
                    href={`/create-edit?id=${
                      task.id
                    }&title=${encodeURIComponent(
                      task.title
                    )}&color=${encodeURIComponent(task?.color)}`}
                    className="w-full"
                  >
                    <span
                      className={`text-sm break-words whitespace-normal w-full ${
                        task.completed
                          ? "line-through cursor-pointer"
                          : "cursor-pointer"
                      }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {task.title}
                    </span>
                  </Link>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-[#808080] hover:text-gray-600 mt-1"
                >
                  <FaRegTrashAlt size={24} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center mt-12 text-gray-400">
            <FaRegClipboard size={64} className="mb-4" />
            <p className="text-lg mb-2">You don't have tasks registered yet.</p>
            <p className="text-gray-400">
              Create tasks and organize your to-do items.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
