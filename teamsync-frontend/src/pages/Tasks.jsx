// src/pages/Tasks.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "pending",
    file: null,
  });

  const token = localStorage.getItem("access_token");
  const location = useLocation();
  const navigate = useNavigate();

  const projectId = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    if (!token || !projectId) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    const res = await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", taskForm.title);
    formData.append("description", taskForm.description);
    formData.append("status", taskForm.status);
    if (taskForm.due_date) formData.append("due_date", taskForm.due_date);
    if (taskForm.file) formData.append("file", taskForm.file);

    const res = await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      setTaskForm({ title: "", description: "", due_date: "", status: "pending", file: null });
      fetchTasks();
    } else {
      const err = await res.json();
      alert(err.detail || "Failed to create task.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">📝 Tasks</h1>

        {/* Add Task Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Add New Task</h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={taskForm.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              value={taskForm.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium mb-1">Due Date</label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              value={taskForm.due_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
            <select
              id="status"
              name="status"
              required
              value={taskForm.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium mb-1">File Attachment</label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            ➕ Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded p-4 shadow"
            >
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
              {task.due_date && (
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  🕒 Due: {task.due_date.split("T")[0]}
                </p>
              )}
              <span className={`inline-block mt-2 px-2 py-1 text-xs text-white rounded-full
                ${
                  task.status === "done"
                    ? "bg-green-500"
                    : task.status === "in-progress"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                }`}>
                {task.status}
              </span>
              {task.attachments?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {task.attachments.map((file, i) => (
                    <a
                      key={i}
                      href={`http://localhost:8000/uploads/${file.filename}`}
                      className="text-sm text-blue-600 hover:underline block"
                      download
                    >
                      📎 {file.filename}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
