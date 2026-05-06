"use client";
import { apiClient } from "@/lib/api-client";
import { useApi } from "@/hooks/api/use-api";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { pusherClient } from "@/server/lib/pusher-client";
type Task = {
  id: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  project: {
    id: string;
    name: string;
  };
};

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { execute } = useApi();
  const { showToast } = useToast();
  // 🔹 Segmentation
  const pending = tasks.filter((t) => t.status === "PENDING");
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completed = tasks.filter((t) => t.status === "DONE");

  const fetchTasks = useCallback(async () => {
    try {
      const data = await execute(() => apiClient<Task[]>("/api/tasks/me"));

      if (!data) {
        showToast("Failed to load tasks", "error");

        return;
      }

      setTasks(data);
    } catch (error) {
      console.error(error);

      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }, [execute, showToast]);

  useEffect(() => {
    const channel = pusherClient.subscribe("dashboard-global");

    channel.bind("dashboard-updated", async () => {
      await fetchTasks();
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("dashboard-global");
    };
  }, [fetchTasks]);

  useEffect(() => {
    const init = async () => {
      await fetchTasks();
    };
    init();
  }, [fetchTasks]);

  // 🔹 Actions
  const startTask = async (taskId: string) => {
    const result = await execute(() =>
      apiClient(`/api/tasks/${taskId}/start`, {
        method: "PATCH",
      }),
    );

    if (!result) {
      showToast("Failed to start task", "error");

      return;
    }

    showToast("Task started");
    await fetchTasks();
  };

  const completeTask = async (taskId: string) => {
    const confirmed = confirm("Are you sure you want to complete this task?");
    if (!confirmed) return;

    const result = await execute(() =>
      apiClient(`/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        credentials: "include",
      }),
    );

    if (!result) {
      showToast("Failed to complete task", "error");
      return;
    }

    showToast("Task completed");
    await fetchTasks();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-200" />

        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="
              h-32 
              animate-pulse
              rounded-3xl
              border
 border-gray-200
  bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  // 🔹 Reusable card
  const renderTaskCard = (task: Task) => (
    <div
      key={task.id}
      className="
  group
  rounded-3xl
  border
  border-gray-200
  bg-white
  p-5
  shadow-sm
  transition-all
  duration-300
  hover:-translate-y-1
  hover:border-gray-300
  hover:shadow-xl
space-y-4
"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{task.title}</h2>

          <p className="mt-1 text-sm font-medium text-gray-500">
            {task.project.name}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium border ${
            task.status === "PENDING"
              ? "border-gray-200 bg-gray-100 text-gray-700"
              : task.status === "IN_PROGRESS"
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>

      {/* Actions */}
      <div className="pt-2">
        {task.status === "PENDING" && (
          <button
            onClick={() => startTask(task.id)}
            className="
  rounded-xl
  bg-black
  px-4
  py-2
  text-sm
  font-medium
  text-white
  shadow-sm
  transition-all
  duration-200
  hover:-translate-y-0.5
  hover:shadow-md
  active:translate-y-0
"
          >
            Start Task
          </button>
        )}

        {task.status === "IN_PROGRESS" && (
          <button
            onClick={() => completeTask(task.id)}
            className="
  rounded-xl
  bg-green-600
  px-4
  py-2
  text-sm
  font-medium
  text-white
  shadow-sm
  transition-all
  duration-200
  hover:bg-green-700
  hover:-translate-y-0.5
  hover:shadow-md
  active:translate-y-0
"
          >
            Mark as Done
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">My Tasks</h1>

        <p className="mt-2 text-sm font-medium text-gray-500">
          Track assigned work, manage progress, and complete deliverables.
        </p>
      </div>

      {/* 🔹 Pending */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Pending</h2>

          <p className="mt-1 text-sm font-medium text-gray-500">
            Tasks waiting to be started.
          </p>
        </div>

        {pending.length === 0 ? (
          <div
            className="
    rounded-3xl
    border
    border-dashed
    border-gray-200
    bg-white/60
    py-14
    text-center
    backdrop-blur
  "
          >
            <p className="text-sm font-medium text-gray-500">
              No pending tasks
            </p>
          </div>
        ) : (
          <div className="grid gap-4">{pending.map(renderTaskCard)}</div>
        )}
      </section>

      {/* 🔹 In Progress */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">In Progress</h2>

          <p className="mt-1 text-sm font-medium text-gray-500">
            Work currently being completed.
          </p>
        </div>
        {inProgress.length === 0 ? (
          <div
            className="
    rounded-3xl
    border
    border-dashed
    border-gray-200
    bg-white/60
    py-14
    text-center
    backdrop-blur
  "
          >
            <p className="text-sm font-medium text-gray-500">
              No In-Progress tasks
            </p>
          </div>
        ) : (
          <div className="grid gap-4">{inProgress.map(renderTaskCard)}</div>
        )}
      </section>

      {/* 🔹 Completed */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Completed</h2>

          <p className="mt-1 text-sm font-medium text-gray-500">
            Successfully delivered work.
          </p>
        </div>
        {completed.length === 0 ? (
          <div
            className="
    rounded-3xl
    border
    border-dashed
    border-gray-200
    bg-white/60
    py-14
    text-center
    backdrop-blur
  "
          >
            <p className="text-sm font-medium text-gray-500">
              No completed tasks
            </p>
          </div>
        ) : (
          <div className="grid gap-4">{completed.map(renderTaskCard)}</div>
        )}
      </section>
    </div>
  );
}
