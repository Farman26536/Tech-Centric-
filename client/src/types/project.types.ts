export interface Project {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}

export interface ProjectSummary {
  id: string;
  title: string;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
}

export interface ProjectInput {
  title: string;
  description?: string;
  deadline?: string;
  status?: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
}

export interface ProjectListResponse {
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
