export type UserSummary = {
  id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
};

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  author?: UserSummary | null;
  createdAt: string;
};

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string | null;
  project?: { id?: string; title?: string } | null;
  assigneeId?: string | null;
  assignee?: { id?: string; name?: string } | null;
  assignedTo?: string | null;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string | null;
};

export type TaskInput = Partial<Task> & { title: string };

export type ProjectSummary = { id: string; title: string };

export type TaskFiltersParams = {
  page?: number;
  limit?: number;
  projectId?: string;
  status?: TaskStatus | '';
  assignedTo?: string;
  assigneeId?: string;
  priority?: TaskPriority | '';
  search?: string;
};
