export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string | null;
  completedAt?: string | null;
  projectId: string;
  assignedToId?: string | null;
  createdAt: string;
  updatedAt: string;
}
