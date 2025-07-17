// src/components/ProjectCard.jsx
export default function ProjectCard({ project, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between gap-4 border dark:border-gray-700">
      <div>
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {project.description || "No description"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={`/static/tasks.html?id=${project.id}`}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          📋 Tasks
        </a>
        <a
          href={`/static/members.html?project_id=${project.id}`}
          className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          👥 Members
        </a>
        <button
          onClick={() => {
            const newTitle = prompt("New title:", project.title);
            const newDesc = prompt("New description:", project.description);
            if (newTitle && newDesc) {
              fetch(`/projects/${project.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                body: JSON.stringify({ title: newTitle, description: newDesc }),
              }).then(() => window.location.reload());
            }
          }}
          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
