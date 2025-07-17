import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import AssistantChat from "../components/AssistantChat";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    } else {
      loadProjects(token);
    }
  }, []);

  const loadProjects = async (token) => {
    try {
      const res = await fetch("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  if (loading) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📁 TeamSync</h1>
      <AssistantChat />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} refresh={() => loadProjects(localStorage.getItem("access_token"))} />
        ))}
      </div>
    </div>
  );
}
