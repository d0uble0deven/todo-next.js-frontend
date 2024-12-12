"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "../services/api";
import { FaArrowLeft, FaPlus, FaCheck } from "react-icons/fa"; // Import icons

export default function CreateEditTask() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [taskId, setTaskId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Red, orange, yellow, green, blue, purple, violet, infrared, brown
  const colors = [
    "#FF3B30",
    "#FF9500",
    "#FFCC00",
    "#34C759",
    "#007AFF",
    "#5856D6",
    "#AF52DE",
    "#FF2D55",
    "#A2845E",
  ];

  // Initialize state with query parameters
  useEffect(() => {
    const id = searchParams.get("id");
    const titleParam = searchParams.get("title");
    const colorParam = searchParams.get("color");

    setTaskId(id);
    if (titleParam) setTitle(decodeURIComponent(titleParam));
    if (colorParam) setSelectedColor(decodeURIComponent(colorParam));
  }, [searchParams]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedColor) {
      setErrorMessage("Please complete the form before proceeding.");
      return;
    }

    try {
      if (taskId) {
        await api.put(`/tasks/${taskId}`, { title, color: selectedColor });
      } else {
        await api.post("/tasks", { title, color: selectedColor });
      }
      router.push("/");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      {/* Header Section */}
      <header className="bg-[#0D0D0D] h-56 relative flex justify-center items-center">
        <div className="container mx-auto relative">
          <span className="absolute bottom-1/2 transform translate-y-1/2 left-[46%]">
            <img src="/Logo.png" alt="Logo" />
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto mt-12 p-4 rounded-md max-w-2xl">
        {/* Back Button */}
        <Link href="/" className="flex items-center text-white mb-6">
          <FaArrowLeft size={20} />
        </Link>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-semibold mb-2"
              style={{ color: "#1E6F9F" }}
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="ex. Brush your teeth"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMessage("");
              }}
              className="w-full p-3 rounded-md bg-[#3A3A3A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E6F9F]"
              required
            />
          </div>

          {/* Color Selector */}
          <div>
            <label
              className="block text-lg font-semibold mb-4"
              style={{ color: "#1E6F9F" }}
            >
              Color
            </label>
            <div className="flex space-x-4">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color
                      ? "border-white"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#1E6F9F] text-white rounded-md hover:bg-[#155e7b] font-semibold flex items-center justify-center"
          >
            <span>{taskId ? "Save" : "Add Task"}</span>
            <span className="ml-3">
              {taskId ? (
                <FaCheck className="text-white" />
              ) : (
                <FaPlus className="text-white" />
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
