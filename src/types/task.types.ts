export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string; // ISO string from frontend
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignedToId?: string;
}

export interface UpdateTaskStatusInput {
  status: "TODO" | "IN_PROGRESS" | "DONE";
}