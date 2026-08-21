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

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskInput = Partial<Task> & { title: string };

export type ProjectSummary = { id: string; name: string };

export type TaskFiltersParams = {
  projectId?: string;
  status?: TaskStatus;
  assigneeId?: string;
  priority?: TaskPriority;
  search?: string;
};
