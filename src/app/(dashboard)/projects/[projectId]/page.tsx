"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { pusherClient } from "@/server/lib/pusher-client";
type Member = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignedTo?: {
    id: string;
    name: string;
  };
};

type ProjectData = {
  id: string;
  name: string;
  members: Member[];
  tasks: Task[];
};

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    type: "delete-task" | "delete-project" | null;
    taskId?: string;
  }>({ open: false, type: null });

  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { toasts, showToast } = useToast();
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [allUsers, setAllUsers] = useState<Member["user"][]>([]);
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState("");

  // ✅ Safe fetch wrapper
  const safeFetch = useCallback(
    async (fn: () => Promise<Response>) => {
      try {
        const res = await fn();
        const json = await res.json();

        if (!res.ok || !json.success) {
          showToast(json.error || "Something went wrong", "error");
          return null;
        }

        return json.data;
      } catch {
        showToast("Network error", "error");
        return null;
      }
    },
    [showToast],
  );

  const fetchProject = useCallback(async () => {
    setLoading(true);

    const data = await safeFetch(() =>
      fetch(`/api/projects/${projectId}`, {
        credentials: "include",
      }),
    );

    setData(data);
    setLoading(false);
  }, [projectId, safeFetch]);

  useEffect(() => {
  const channel = pusherClient.subscribe(`project-${projectId}`);

  channel.bind("project-updated", async () => {
    await fetchProject();
  });

  return () => {
    channel.unbind_all();
    pusherClient.unsubscribe(`project-${projectId}`);
  };
}, [projectId, fetchProject]);

  const fetchUsers = useCallback(async () => {
    const data = await safeFetch(() =>
      fetch("/api/users", { credentials: "include" }),
    );

    if (data) setAllUsers(data);
  }, [safeFetch]);

  useEffect(() => {
    const init = async () => {
      await fetchProject();
      await fetchUsers();
    };
    init();
  }, [fetchProject, fetchUsers]);

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;

    setActionLoading(true);

    await safeFetch(() =>
      fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle.trim(),
          priority: "MEDIUM",
          assignedToId: selectedUser || undefined,
        }),
      }),
    );

    setTaskTitle("");
    setSelectedUser("");
    await fetchProject();

    setActionLoading(false);
  };

  const handleAddMember = async () => {
    if (!selectedMemberToAdd) return;

    const user = allUsers.find((u) => u.id === selectedMemberToAdd);
    if (!user) return;

    setActionLoading(true);

    if (user) {
      showToast("Member added", "success");
    }
    await safeFetch(() =>
      fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      }),
    );

    setSelectedMemberToAdd("");
    await fetchProject();

    setActionLoading(false);
  };

  const handleDeleteProject = async () => {
    setConfirm({
      open: true,
      type: "delete-project",
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    setConfirm({
      open: true,
      type: "delete-task",
      taskId,
    });
  };

  const executeConfirm = async () => {
    if (!confirm.type) return;

    setActionLoading(true);

    try {
      if (confirm.type === "delete-task" && confirm.taskId) {
        await safeFetch(() =>
          fetch(`/api/tasks/${confirm.taskId}`, {
            method: "DELETE",
            credentials: "include",
          }),
        );

        showToast("Task deleted", "success");
        await fetchProject();
      }

      if (confirm.type === "delete-project") {
        await safeFetch(() =>
          fetch(`/api/projects/${projectId}`, {
            method: "DELETE",
            credentials: "include",
          }),
        );

        showToast("Project deleted", "success");
        window.location.href = "/dashboard";
      }

    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setActionLoading(false);
      setConfirm({ open: false, type: null });
    }
  };

  const statusStyles: Record<TaskStatus, string> = {
    PENDING: "bg-gray-100 text-gray-700 border border-gray-200",

    IN_PROGRESS: "bg-blue-50 text-blue-700 border border-blue-200",

    DONE: "bg-green-50 text-green-700 border border-green-200",
  };

  if (loading) return <div className="p-6">Loading project...</div>;
  if (!data)
    return <div className="p-6 text-red-500">Failed to load project</div>;

  const activeTasks = data.tasks.filter((t) => t.status !== "DONE");
  const completedTasks = data.tasks.filter((t) => t.status === "DONE");

  const existingIds = new Set(data.members.map((m) => m.user.id));
  const availableUsers = allUsers.filter((u) => !existingIds.has(u.id));

  const renderTask = (task: Task, isCompleted = false) => {
    return (
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
          duration-200
          hover:-translate-y-1
          hover:shadow-lg
        "
      >
        <div className="flex justify-between items-start">
          <h3 className={`font-medium ${isCompleted ? "line-through text-gray-400" : ""}`}>
            {task.title}
          </h3>

          <span
            className={`text-xs px-3 py-1 rounded-full ${statusStyles[task.status]}`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Assigned: {task.assignedTo?.name || "Unassigned"}
        </p>

        <div className="flex gap-2 mt-4">
          <button
            disabled={actionLoading}
            onClick={() => handleDeleteTask(task.id)}
            className="text-sm px-4 py-1.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage tasks, members, and collaboration for this workspace.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
          {data.tasks.length} Tasks
        </div>
      </div>

      {/* MEMBERS SECTION */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Team Members</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage collaboration and workspace access.
          </p>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedMemberToAdd}
            onChange={(e) => setSelectedMemberToAdd(e.target.value)}
            className="h-11 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm transition focus:border-black focus:bg-white"
          >
            <option value="">Select user to add</option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} • {u.email}
              </option>
            ))}
          </select>

          <button
            disabled={actionLoading}
            onClick={handleAddMember}
            className="h-11 px-6 rounded-2xl bg-black text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Member
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.members.map((m) => (
            <div
              key={m.user.id}
              className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium"
            >
              {m.user.name}
            </div>
          ))}
        </div>
      </div>

      {/* CREATE TASK SECTION */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Create New Task</h2>
          <p className="mt-1 text-sm text-gray-500">
            Assign work and track execution across your team.
          </p>
        </div>

        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task title..."
          className="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm transition focus:border-black focus:bg-white"
        />

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm transition focus:border-black focus:bg-white"
        >
          <option value="">Assign to (optional)</option>
          {data.members.map((m) => (
            <option key={m.user.id} value={m.user.id}>
              {m.user.name}
            </option>
          ))}
        </select>

        <button
          disabled={actionLoading}
          onClick={handleCreateTask}
          className="h-11 w-full rounded-2xl bg-black px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create Task
        </button>
      </div>

      {/* ACTIVE TASKS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Active Tasks</h2>
            <p className="text-sm text-gray-500">Tasks currently being worked on.</p>
          </div>
        </div>

        {activeTasks.length === 0 ? (
          <div className="text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-3xl">
            No active tasks yet. Create one above.
          </div>
        ) : (
          <div className="grid gap-4">{activeTasks.map((t) => renderTask(t))}</div>
        )}
      </div>

      {/* COMPLETED TASKS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Completed Tasks</h2>
            <p className="text-sm text-gray-500">Finished work delivered by team members.</p>
          </div>
        </div>

        {completedTasks.length === 0 ? (
          <div className="text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-3xl">
            No completed tasks yet.
          </div>
        ) : (
          <div className="grid gap-4 opacity-75">
            {completedTasks.map((t) => renderTask(t, true))}
          </div>
        )}
      </div>

      {/* DANGER ZONE */}
      <div className="border-t pt-8">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
          <h3 className="font-semibold text-red-700">Danger Zone</h3>
          <p className="text-sm text-red-600 mt-1">
            This action cannot be undone. All tasks and data will be permanently deleted.
          </p>
          <button
            disabled={actionLoading}
            onClick={handleDeleteProject}
            className="mt-4 h-11 rounded-2xl bg-red-600 px-6 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete Project
          </button>
        </div>
      </div>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} />

      <ConfirmModal
        open={confirm.open}
        title={
          confirm.type === "delete-project" ? "Delete Project" : "Delete Task"
        }
        description="This action cannot be undone."
        onConfirm={executeConfirm}
        onCancel={() => setConfirm({ open: false, type: null })}
        loading={actionLoading}
      />
    </div>
  );
}
