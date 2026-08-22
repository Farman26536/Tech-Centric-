import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { fetchProjects } from '../../api/projects.api';
import { fetchTasks } from '../../api/tasks.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressBar from '../../components/common/ProgressBar';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../contexts/AuthContext';

export default function Projects() {
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user } = useAuth();
  const canCreateProject = user?.role === 'ADMIN';

  const { data: projectsRes, isLoading: loadingProjects } = useQuery({ queryKey: ['projects'], queryFn: () => fetchProjects(1, 100) });
  const { data: tasksRes, isLoading: loadingTasks } = useQuery({ queryKey: ['tasks'], queryFn: () => fetchTasks({}) });

  const projects = projectsRes?.data ?? [];
  const tasks = tasksRes?.data ?? [];
    // defensive: ensure arrays
    // (previous console warnings removed)
    if (!Array.isArray(projects)) {
      // Handle unexpected projects response shape
    }
    if (!Array.isArray(tasks)) {
      // Handle unexpected tasks response shape
    }

  const projectsWithStats = useMemo(() => {
    return projects.map((p: any) => {
      const pts = tasks.filter((t: any) => String(t.projectId) === String(p.id));
      const total = pts.length;
      const done = pts.filter((t: any) => t.status === 'COMPLETED').length;
      const percent = total ? Math.round((done / total) * 100) : 0;
      return { ...p, totalTasks: total, completedTasks: done, percent };
    });
  }, [projects, tasks]);

  const filtered = useMemo(() => {
    return projectsWithStats.filter((p: any) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (q && !(`${p.name} ${p.description ?? ''}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [projectsWithStats, q, statusFilter]);

  const isLoading = loadingProjects || loadingTasks;
  if (isLoading) return <LoadingSpinner />;

  if (!filtered.length) return <EmptyState title="No projects" description="No projects match your filters." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="text-sm text-gray-500">Manage your projects and monitor progress.</div>
        </div>
        <div className="flex items-center gap-3">
          <input aria-label="Search projects" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects..." className="border rounded px-3 py-2" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-2">
            <option value="all">All</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          {canCreateProject && (
            <Link to="/projects/new" className="bg-indigo-600 text-white px-3 py-2 rounded flex items-center gap-2"><Plus className="w-4 h-4" /> New Project</Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p: any) => (
          <Card key={p.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Link to={`/projects/${p.id}`} className="text-lg font-semibold text-gray-900 hover:underline">{p.name}</Link>
                <div className="text-sm text-gray-500 mt-1">{p.description}</div>
                <div className="mt-3">
                  <ProgressBar percent={p.percent} />
                </div>
              </div>

              <div className="w-36 text-right flex flex-col items-end gap-2">
                <StatusBadge status={p.status} />
                <div className="text-sm text-gray-500">{p.totalTasks} tasks</div>
                <div className="text-xs text-gray-400">{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : ''}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
