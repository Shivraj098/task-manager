"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import PageHeader from "@/components/shared/page-header";
import { useEffect, useState, useCallback, use } from "react";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useRealtimeChannel } from "@/hooks/realtime/use-realtime-channel";
import { REALTIME_EVENTS } from "@/lib/realtime-events";
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

  const [creatingTask, setCreatingTask] = useState(false);

  const [addingMember, setAddingMember] = useState(false);

  const [deletingProject, setDeletingProject] = useState(false);

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const { toasts, showToast } = useToast();

  const [taskTitle, setTaskTitle] = useState("");

  const [memberEmail, setMemberEmail] = useState("");

  const [taskDescription, setTaskDescription] = useState("");

  const [taskPriority, setTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
    "MEDIUM",
  );

  const [assignedToId, setAssignedToId] = useState("");

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

  useRealtimeChannel({
    channelName: `project-${projectId}`,
    eventName: REALTIME_EVENTS.PROJECT_UPDATED,
    callback: fetchProject,
  });

  useEffect(() => {
    const init = async () => {
      await fetchProject();
    };

    init();
  }, [fetchProject]);

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      setCreatingTask(true);

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
      setCreatingTask(false);
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) return;

    try {
      setAddingMember(true);

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
      setAddingMember(false);
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

    setConfirmLoading(true);

    try {
      if (confirm.type === "delete-task" && confirm.taskId) {
        setDeletingTaskId(confirm.taskId);

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
        setDeletingProject(true);

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
      setConfirmLoading(false);

      setDeletingTaskId(null);

      setDeletingProject(false);

      setConfirm({ open: false, type: null });
    }
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

  if (!data) {
    return <div className="p-6 text-red-500">Failed to load project</div>;
  }

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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className={`font-medium ${
                isCompleted ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </h3>

            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={task.status} />

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  ${
                    task.priority === "HIGH"
                      ? "bg-red-50 text-red-700"
                      : task.priority === "MEDIUM"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {task.priority}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Assigned: {task.assignedTo?.name || "Unassigned"}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            disabled={deletingTaskId === task.id}
            onClick={() => handleDeleteTask(task.id)}
            className="
              opacity-100
              md:opacity-0
              md:group-hover:opacity-100
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
      <PageHeader
        title={data.name}
        description="Manage tasks, members, and collaboration for this workspace."
        action={
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
            {data.tasks.length} Tasks
          </div>
        }
      />

      {/* MEMBERS SECTION */}
      <Card className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
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
            id="member-email"
            label="Member Email"
            placeholder="john@example.com"
            value={memberEmail}
            onChange={(event) => setMemberEmail(event.target.value)}
          />

          <Button
            loading={addingMember}
            onClick={handleAddMember}
            disabled={!memberEmail.trim()}
            className="h-12 rounded-2xl px-6"
          >
            Add Member
          </Button>
        </FormSection>

        <div className="flex flex-wrap gap-3">
          {data.members.length === 0 ? (
            <div className="text-sm text-gray-400">
              No team members added yet.
            </div>
          ) : (
            data.members.map((m) => (
              <div
                key={m.user.id}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-full
                  bg-gray-100
                  px-4
                  py-2
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  {m.user.name.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm font-medium">{m.user.name}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* CREATE TASK SECTION */}
      <FormSection
        title="Create Task"
        description="Assign actionable work to your team."
      >
        <FormInput
          id="task-title"
          label="Task Title"
          placeholder="Design landing page"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
        />

        <FormTextarea
          id="task-description"
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

        <Button
          loading={creatingTask}
          onClick={handleCreateTask}
          disabled={!taskTitle.trim()}
          className="h-12 rounded-2xl px-6"
        >
          Create Task
        </Button>
      </FormSection>

      {/* ACTIVE TASKS */}
      <div>
        <div className="mb-4 flex items-center justify-between">
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
          <EmptyState
            title="No tasks yet"
            description="Create and assign tasks to start tracking team progress."
          />
        ) : (
          <div className="grid gap-4">
            {activeTasks.map((t) => renderTask(t))}
          </div>
        )}
      </div>

      {/* COMPLETED TASKS */}
      <div>
        <div className="mb-4 flex items-center justify-between">
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
          <EmptyState
            title="No completed tasks yet"
            description="Completed work delivered by team members will appear here."
          />
        ) : (
          <div className="grid gap-4">
            {completedTasks.map((t) => renderTask(t, true))}
          </div>
        )}
      </div>

      {/* DANGER ZONE */}
      <div className="border-t pt-8">
        <Card className="rounded-3xl border border-red-100 bg-red-50 p-6">
          <h3 className="font-semibold text-red-700">Danger Zone</h3>

          <p className="mt-1 text-sm text-red-600">
            This action cannot be undone. All tasks and data will be permanently
            deleted.
          </p>

          <Button
            loading={deletingProject}
            disabled={deletingProject}
            onClick={handleDeleteProject}
            className="mt-4 h-11 rounded-2xl bg-red-600 px-6 text-white hover:bg-red-700"
          >
            Delete Project
          </Button>
        </Card>
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
        onCancel={() =>
          setConfirm({
            open: false,
            type: null,
          })
        }
        loading={confirmLoading}
      />
    </div>
  );
}
