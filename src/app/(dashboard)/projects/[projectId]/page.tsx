"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { pusherClient } from "@/server/lib/pusher-client";
import FormInput from "@/components/shared/forms/FormInput";
import FormTextarea from "@/components/shared/forms/FormTextArea";
import FormSection from "@/components/shared/forms/FormSection";

import { apiClient } from "@/lib/api-client";
import { useApi } from "@/hooks/api/use-api";
import { useRouter } from "next/navigation";
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
  description?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: TaskStatus;
  createdAt?: string;

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
  const router = useRouter();
  const { execute } = useApi();
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
  const [memberEmail, setMemberEmail] = useState("");

  

  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
    "MEDIUM",
  );

  const [assignedToId, setAssignedToId] = useState("");

  // ✅ Safe fetch wrapper

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);

      const project = await execute(() =>
        apiClient<ProjectData>(`/api/projects/${projectId}`),
      );

      if (!project) {
        showToast("Failed to load project", "error");

        return;
      }

      setData(project);
    } finally {
      setLoading(false);
    }
  }, [execute, projectId, showToast]);

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



  useEffect(() => {
    const init = async () => {
      await fetchProject();
    };
    init();
  }, [fetchProject]);

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      setActionLoading(true);

      const createdTask = await execute(() =>
        apiClient(`/api/projects/${projectId}/tasks`, {
          method: "POST",
          body: JSON.stringify({
            title: taskTitle.trim(),
            description: taskDescription.trim(),
            priority: taskPriority,
            assignedToId: assignedToId || undefined,
          }),
        }),
      );

      if (!createdTask) {
        showToast("Failed to create task", "error");
        return;
      }

      showToast("Task created successfully", "success");

      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("MEDIUM");
      setAssignedToId("");

      await fetchProject();
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) return;

    try {
      setActionLoading(true);

      const addedMember = await execute(() =>
        apiClient(`/api/projects/${projectId}/members`, {
          method: "POST",
          body: JSON.stringify({
            email: memberEmail.trim(),
          }),
        }),
      );

      if (!addedMember) {
        showToast("Failed to add member", "error");
        return;
      }

      showToast("Member added successfully", "success");

      setMemberEmail("");

      await fetchProject();
    } finally {
      setActionLoading(false);
    }
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
        const deletedTask = await execute(() =>
          apiClient(`/api/tasks/${confirm.taskId}`, {
            method: "DELETE",
          }),
        );

        if (!deletedTask) {
          showToast("Failed to delete task", "error");
          return;
        }

        showToast("Task deleted", "success");
        await fetchProject();
      }

      if (confirm.type === "delete-project") {
        const deletedProject = await execute(() =>
          apiClient(`/api/projects/${projectId}`, {
            method: "DELETE",
          }),
        );

        if (!deletedProject) {
          showToast("Failed to delete project", "error");
          return;
        }

        showToast("Project deleted", "success");
        router.push("/dashboard");
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 w-64 rounded-2xl bg-gray-200" />

        <div className="grid gap-6">
          <div className="h-48 rounded-3xl bg-gray-200" />
          <div className="h-64 rounded-3xl bg-gray-200" />
          <div className="h-64 rounded-3xl bg-gray-200" />
        </div>
      </div>
    );
  }
  if (!data)
    return <div className="p-6 text-red-500">Failed to load project</div>;

  const activeTasks = data.tasks.filter((t) => t.status !== "DONE");
  const completedTasks = data.tasks.filter((t) => t.status === "DONE");

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
          <h3
            className={`font-medium ${isCompleted ? "line-through text-gray-400" : ""}`}
          >
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
            className="
opacity-0
group-hover:opacity-100
transition-opacity
text-sm
px-4
py-1.5
rounded-2xl
bg-red-500
hover:bg-red-600
text-white
active:scale-95
disabled:cursor-not-allowed
disabled:opacity-50
"
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
          <h2 className="text-2xl font-semibold tracking-tight">
            Team Members
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage collaboration and workspace access.
          </p>
        </div>

        <FormSection
          title="Invite Team Member"
          description="Add collaborators to this project."
        >
          <FormInput
            label="Member Email"
            placeholder="john@example.com"
            value={memberEmail}
            onChange={(event) => setMemberEmail(event.target.value)}
          />

          <button
            onClick={handleAddMember}
            disabled={!memberEmail.trim()}
            className="
      h-12
      rounded-2xl
      bg-black
      px-6
      text-sm
      font-semibold
      text-white
      transition-all
      hover:opacity-90
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
          >
            Add Member
          </button>
        </FormSection>

        <div className="flex flex-wrap gap-2">
          {data.members.length === 0 ? (
            <div className="text-sm text-gray-400">
              No team members added yet.
            </div>
          ) : (
            data.members.map((m) => (
              <div
                key={m.user.id}
                className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium"
              >
                {m.user.name}
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE TASK SECTION */}
      <FormSection
        title="Create Task"
        description="Assign actionable work to your team."
      >
        <FormInput
          label="Task Title"
          placeholder="Design landing page"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
        />

        <FormTextarea
          label="Task Description"
          placeholder="Add detailed task instructions..."
          value={taskDescription}
          onChange={(event) => setTaskDescription(event.target.value)}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Priority</label>

          <select
            value={taskPriority}
            onChange={(event) =>
              setTaskPriority(event.target.value as "LOW" | "MEDIUM" | "HIGH")
            }
            className="
        h-12
        w-full
        rounded-2xl
        border
        border-gray-200
        bg-white
        px-4
        text-sm
        shadow-sm
      "
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Assign To</label>

          <select
            value={assignedToId}
            onChange={(event) => setAssignedToId(event.target.value)}
            className="
        h-12
        w-full
        rounded-2xl
        border
        border-gray-200
        bg-white
        px-4
        text-sm
        shadow-sm
      "
          >
            <option value="">Select member</option>

            {data.members.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreateTask}
          disabled={!taskTitle.trim()}
          className="
      h-12
      rounded-2xl
      bg-black
      px-6
      text-sm
      font-semibold
      text-white
      transition-all
      hover:opacity-90
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
        >
          Create Task
        </button>
      </FormSection>

      {/* ACTIVE TASKS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Active Tasks
            </h2>
            <p className="text-sm text-gray-500">
              Tasks currently being worked on.
            </p>
          </div>
        </div>

        {activeTasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              No tasks yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Create and assign tasks to start tracking team progress.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeTasks.map((t) => renderTask(t))}
          </div>
        )}
      </div>

      {/* COMPLETED TASKS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Completed Tasks
            </h2>
            <p className="text-sm text-gray-500">
              Finished work delivered by team members.
            </p>
          </div>
        </div>

        {completedTasks.length === 0 ? (
          <div className="text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-3xl">
            No completed tasks yet.
          </div>
        ) : (
          <div className="grid gap-4 ">
            {completedTasks.map((t) => renderTask(t, true))}
          </div>
        )}
      </div>

      {/* DANGER ZONE */}
      <div className="border-t pt-8">
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
          <h3 className="font-semibold text-red-700">Danger Zone</h3>
          <p className="text-sm text-red-600 mt-1">
            This action cannot be undone. All tasks and data will be permanently
            deleted.
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
