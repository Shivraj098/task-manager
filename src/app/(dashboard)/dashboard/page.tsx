"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { subscribe } from "@/server/lib/event-bus"; // ✅ FIXED PATH

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

  const [authLoading, setAuthLoading] = useState(true);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const session = await res.json();

        if (!session || !session.user) {
          router.push("/signup");
          return;
        }

        setAuthLoading(false);
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // =========================
  // SAFE FETCH
  // =========================
  const safeFetch = useCallback(
    async (fn: () => Promise<Response>) => {
      try {
        const res = await fn();

        if (res.status === 401) {
          router.push("/login");
          return null;
        }

        const json = await res.json();

        if (!res.ok || !json.success) {
          setError(json.error || "Something went wrong"); // ✅ FIXED (removed duplicate)
          return null;
        }

        return json.data;
      } catch (err) {
        console.error("Network error:", err);
        setError("Network error. Please try again.");
        return null;
      }
    },
    [router],
  );

  // =========================
  // FETCH DASHBOARD (USING SAFE FETCH)
  // =========================
  const fetchDashboard = useCallback(async () => {
    const data = await safeFetch(() =>
      fetch("/api/dashboard", {
        credentials: "include",
      }),
    );

    if (data) {
      setDashboard(data);
      console.log("Dashboard updated:", data);
    }
  }, [safeFetch]);

  // 🔥 EVENT BUS SYNC
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      fetchDashboard();
    });

    return unsubscribe;
  }, [fetchDashboard]);

  // =========================
  // FETCH PROJECTS
  // =========================
  const fetchProjects = useCallback(async () => {
    const data = await safeFetch(() =>
      fetch("/api/projects", {
        credentials: "include",
      }),
    );

    if (data) setProjects(data);
  }, [safeFetch]);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;

    const init = async () => {
      setLoading(true);

      await Promise.all([fetchDashboard(), fetchProjects()]);

      if (isMounted) setLoading(false);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [authLoading, fetchDashboard, fetchProjects]);

  // =========================
  // CREATE PROJECT
  // =========================
  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    setCreating(true);

    const result = await safeFetch(() =>
      fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName }),
      }),
    );

    if (result) {
      fetchProjects(); // ✅ FIXED: refresh on success
    }

    setProjectName("");
    setCreating(false);
  };

  // =========================
  // AUTH LOADING
  // =========================
  if (authLoading) {
    return <div className="p-6">Checking authentication...</div>;
  }

  // =========================
  // DATA LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-40" />
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-40 bg-gray-200 rounded-xl" />
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

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Your Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create and manage collaborative workspaces.
            </p>
          </div>

          {/* CREATE PROJECT */}
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="
              h-11
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
              px-4
              text-sm
              transition
              focus:border-black
              focus:bg-white
            "
            />

            <button
              onClick={handleCreateProject}
              disabled={!projectName.trim() || creating}
              className="
              h-11
              rounded-2xl
              bg-black
              px-5
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {projects.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-gray-200 py-16 text-center">
            <h3 className="text-lg font-medium">No projects yet</h3>

            <p className="mt-2 text-sm text-gray-500">
              Create your first workspace to start collaborating.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                <div className="flex items-start justify-between">
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

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
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
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <div className="mt-4 flex items-end justify-between">
        <h3 className="text-4xl font-bold tracking-tight">
          {value}
        </h3>

        <div className="h-12 w-12 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}
