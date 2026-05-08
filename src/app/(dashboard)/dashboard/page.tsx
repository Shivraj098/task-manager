"use client";

import { useRealtimeChannel } from "@/hooks/realtime/use-realtime-channel";
import { REALTIME_EVENTS } from "@/lib/realtime-events";
import { apiClient } from "@/lib/api-client";
import { useApi } from "@/hooks/api/use-api";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import FormInput from "@/components/shared/forms/FormInput";
import FormSection from "@/components/shared/forms/FormSection";

type DashboardData = {
  totalTasks: number;

  tasksByStatus: {
    PENDING: number;
    IN_PROGRESS: number;
    DONE: number;
  };

  overdueTasks: number;
};

type Project = {
  id: string;
  name: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const { execute } = useApi();

  const { showToast } = useToast();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);

  const [projectName, setProjectName] = useState("");

  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  // =========================
  // GET SESSION
  // =========================

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch("/api/auth/session");

        const session = await response.json();

        if (session?.user?.id) {
          setUserId(session.user.id);
        }
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  // =========================
  // FETCH DASHBOARD
  // =========================

  const fetchDashboard = useCallback(async () => {
    const data = await execute(() =>
      apiClient<DashboardData>("/api/dashboard"),
    );

    if (!data) {
      showToast("Failed to load dashboard", "error");

      return;
    }

    setDashboard(data);
  }, [execute, showToast]);

  // =========================
  // FETCH PROJECTS
  // =========================

  
  const fetchProjects = useCallback(async () => {
    const data = await execute(() => apiClient<Project[]>("/api/projects"));

    if (!data) {
      showToast("Failed to load projects", "error");

      return;
    }

    setProjects(data);
  }, [execute, showToast]);

  const handleRealtimeUpdate =
  useCallback(async () => {
    await Promise.all([
      fetchDashboard(),
      fetchProjects(),
    ]);
  }, [
    fetchDashboard,
    fetchProjects,
  ]);

  // =========================
  // REALTIME
  // =========================

  useRealtimeChannel({
    channelName: `dashboard-${userId}`,
    eventName: REALTIME_EVENTS.DASHBOARD_UPDATED,
    callback: handleRealtimeUpdate,
  });

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const init = async () => {
      setLoading(true);

      await Promise.all([fetchDashboard(), fetchProjects()]);

      if (isMounted) {
        setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [userId, fetchDashboard, fetchProjects]);

  // =========================
  // CREATE PROJECT
  // =========================

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    try {
      setCreating(true);

      const data = await execute(() =>
        apiClient<Project[]>("/api/projects", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: projectName.trim(),
          }),
        }),
      );

      if (!data) {
        showToast("Failed to create project", "error");

        return;
      }

      setProjects(data);

      setProjectName("");

      showToast("Project created successfully", "success");
    } catch (error) {
      console.error(error);

      showToast("Failed to create project", "error");
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="space-y-6 p-6 animate-pulse">
        <div className="h-8 w-40 rounded bg-gray-200" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-200" />
          ))}
        </div>

        <div className="h-40 rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage projects, monitor task progress, and collaborate with your
            team.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Tasks" value={dashboard?.totalTasks ?? 0} />

        <StatCard
          title="Pending"
          value={dashboard?.tasksByStatus?.PENDING ?? 0}
        />

        <StatCard
          title="In Progress"
          value={dashboard?.tasksByStatus?.IN_PROGRESS ?? 0}
        />

        <StatCard
          title="Completed"
          value={dashboard?.tasksByStatus?.DONE ?? 0}
        />
      </div>

      {/* PROJECT SECTION */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Your Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create and manage collaborative workspaces.
            </p>
          </div>

          {/* CREATE PROJECT */}
          <FormSection
            title="Create Project"
            description="Start managing a new team workflow."
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <FormInput
                  id="project-name"
                  label="Project Name"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  disabled={creating}
                />
              </div>

              <Button
                loading={creating}
                onClick={handleCreateProject}
                disabled={creating || !projectName.trim()}
                className="
                  h-12
                  rounded-2xl
                  px-6
                "
              >
                Create Project
              </Button>
            </div>
          </FormSection>
        </div>

        {/* EMPTY STATE */}
        {projects.length === 0 ? (
          <div
            className="
              rounded-3xl
              border
              border-dashed
              border-gray-300
              bg-white/70
              px-8
              py-14
              text-center
            "
          >
            <h3 className="text-lg font-semibold">No projects yet</h3>

            <p className="mt-2 text-sm text-gray-500">
              Create your first project to start assigning tasks and managing
              team workflows.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/projects/${p.id}`)}
                className="
                  group
                  cursor-pointer
                  rounded-3xl
                  border
                  border-gray-200
                  bg-white
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-1.5
                  hover:border-gray-300
                  hover:shadow-2xl
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{p.name}</h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Collaborative project workspace
                    </p>
                  </div>

                  <div
                    className="
                      rounded-full
                      bg-gray-100
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-gray-700
                      transition
                      group-hover:bg-black
                      group-hover:text-white
                    "
                  >
                    Active
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-lg
      "
    >
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <div className="mt-4 flex items-end justify-between">
        <h3 className="text-4xl font-bold tracking-tight">{value}</h3>

        <div className="h-12 w-12 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}
