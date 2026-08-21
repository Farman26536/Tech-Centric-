export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  startDate?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}
