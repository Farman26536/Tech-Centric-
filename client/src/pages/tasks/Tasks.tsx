import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { fetchTasks } from '../../api/tasks.api';
import { fetchProjects } from '../../api/projects.api';
import { fetchUsers } from '../../api/users.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';

export default function Tasks() {
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const { data: tasksRes, isLoading: loadingTasks } = useQuery({ queryKey: ['tasks'], queryFn: () => fetchTasks({}) });
  const { data: projectsRes } = useQuery({ queryKey: ['projects'], queryFn: () => fetchProjects(1, 100) });
  const { data: usersRes } = useQuery({ queryKey: ['users'], queryFn: () => fetchUsers(1, 100) });

  const tasks = tasksRes?.data ?? [];
  const projects = projectsRes?.data ?? [];
  const users = usersRes?.data ?? [];

  // defensive checks for API shapes (console warnings removed)
  if (!Array.isArray(tasks)) {
    // unexpected shape
  }
  if (!Array.isArray(projects)) {
    // unexpected shape
  }
  if (!Array.isArray(users)) {
    // unexpected shape
  }
  const usersMap = useMemo(() => Object.fromEntries((users || []).map((u: any) => [u.id, u])), [users]);
  const projectsMap = useMemo(() => Object.fromEntries((projects || []).map((p: any) => [p.id, p])), [projects]);

  const filtered = useMemo(() => {
    return (tasks || []).filter((t: any) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (projectFilter !== 'all' && String(t.projectId) !== projectFilter) return false;
      if (q && !(`${t.title} ${t.description ?? ''}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, projectFilter, q]);

  const isLoading = loadingTasks;
  if (isLoading) return <LoadingSpinner />;

  if (!filtered.length) return <EmptyState title="No tasks" description="No tasks match your filters." />;

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <div className="text-sm text-gray-500">All tasks across projects and team members.</div>
        </div>
        <div className="flex items-center gap-3">
          <input aria-label="Search tasks" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks..." className="border rounded px-3 py-2" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-2">
            <option value="all">All</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="border rounded px-2 py-2">
            <option value="all">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="border rounded px-2 py-2">
            <option value="all">All projects</option>
            {projects.map((p: any) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
          </select>
          <Link to="/tasks/new" className="bg-indigo-600 text-white px-3 py-2 rounded flex items-center gap-2"><Plus className="w-4 h-4" /> New Task</Link>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((t: any) => {
          const assignee = t.assignedToId ? usersMap[t.assignedToId] : null;
          const project = projectsMap[t.projectId];
          const isOverdue = t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED';
          return (
            <Card key={t.id} className={`p-4 hover:shadow-md transition-shadow ${isOverdue ? 'border border-red-100' : ''}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Link to={`/tasks/${t.id}`} className={`text-lg font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'} hover:underline`}>{t.title}</Link>
                  <div className="text-sm text-gray-500">{project?.name ?? ''}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ''}</div>
                  <div><StatusBadge status={t.status} /></div>
                  <div><Avatar name={assignee ? assignee.name : 'Unassigned'} size={36} /></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
