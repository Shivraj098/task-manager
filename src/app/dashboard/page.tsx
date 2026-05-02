"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  totalTasks: number;
  tasksByStatus: {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
  overdueTasks: number;
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");

  const fetchDashboard = async () => {
    const res = await fetch("/api/dashboard");
    const data: DashboardData = await res.json();
    setDashboard(data);
  };

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data: Project[] = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchDashboard(), fetchProjects()]);
    };
    init();
  }, []);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: projectName }),
    });

    setProjectName("");
    fetchProjects();
  };

  if (!dashboard) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Overview of your tasks and projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={dashboard.totalTasks} />
        <StatCard title="To Do" value={dashboard.tasksByStatus.TODO} />
        <StatCard
          title="In Progress"
          value={dashboard.tasksByStatus.IN_PROGRESS}
        />
        <StatCard title="Done" value={dashboard.tasksByStatus.DONE} />
      </div>

      {/* Overdue */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
        <p className="text-red-600 font-medium">
          Overdue Tasks: {dashboard.overdueTasks}
        </p>
      </div>

      {/* Projects */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="text-lg font-semibold">Projects</h2>

        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-black/10"
            placeholder="New project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <button
            onClick={handleCreateProject}
            className="bg-black text-white px-4 rounded hover:bg-gray-800"
          >
            Create
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border rounded-xl hover:shadow-sm transition"
            >
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-5 rounded-xl border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
