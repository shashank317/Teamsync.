import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard.";
import AssistantChat from "../components/AssistantChat";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    } else {
      loadProjects(token);
    }

    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) setMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const loadProjects = async (token) => {
    try {
      const res = await fetch("http://localhost:8000/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    const token = localStorage.getItem("access_token");
    if (!newProjectName.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newProjectName, description: "" }),
      });

      if (res.ok) {
        setNewProjectName("");
        loadProjects(token);
      } else {
        const errData = await res.json();
        alert(errData.detail || "Failed to create project.");
      }
    } catch (err) {
      console.error("Create project error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  if (loading) return null;

  return (
    <div className="p-6 text-black dark:text-white min-h-screen bg-gray-100 dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📁 TeamSync</h1>

        <div className="flex items-center gap-4 relative">
          <DarkModeToggle />

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center focus:outline-none"
              title="Profile"
            >
              U
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded shadow-lg z-20 border dark:border-gray-700">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  👤 Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                >
                  🔒 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AssistantChat />

      {/* Add Project Form */}
      <div className="flex mb-6 gap-2">
        <input
          type="text"
          id="newProjectName"
          name="newProjectName"
          placeholder="New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="flex-1 px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          autoComplete="off"
          required
        />
        <button
          onClick={createProject}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          ➕ Add Project
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            refresh={() => loadProjects(localStorage.getItem("access_token"))}
          />
        ))}
      </div>
    </div>
  );
}
