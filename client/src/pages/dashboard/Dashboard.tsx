import { useQuery } from '@tanstack/react-query';
import { Home, Calendar, CheckSquare, AlertCircle, FolderKanban, Plus, Circle } from 'lucide-react';
import { fetchProjects } from '../../api/projects.api';
import { fetchTasks } from '../../api/tasks.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import ProgressBar from '../../components/common/ProgressBar';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: projectsRes, isLoading: loadingProjects } = useQuery({ queryKey: ['projects'], queryFn: () => fetchProjects(1, 50) });
  const { data: tasksRes, isLoading: loadingTasks } = useQuery({ queryKey: ['tasks', 'overview'], queryFn: () => fetchTasks({}) });

  const projects = projectsRes?.data ?? [];
  const tasks = tasksRes?.data ?? [];

  const isLoading = loadingProjects || loadingTasks;
  if (isLoading) return <LoadingSpinner />;

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: any) => p.status === 'ACTIVE').length;
  const totalTasks = tasks.length;
  const now = new Date();
  const overdueTasks = tasks.filter((t: any) => t.status !== 'COMPLETED' && t.dueDate && new Date(t.dueDate) < now).length;

  const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter((t: any) => t.status === 'IN_PROGRESS').length;
  const pendingTasks = totalTasks - completedTasks - inProgressTasks;

  const projectProgress = projects.map((p: any) => {
    const pts = tasks.filter((t: any) => String(t.projectId) === String(p.id));
    const total = pts.length;
    const done = pts.filter((t: any) => t.status === 'COMPLETED').length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { project: p, total, done, percent };
  }).sort((a: any, b: any) => b.percent - a.percent).slice(0, 6);

  const recentTasks = tasks.slice().sort((a: any, b: any) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2"><Home className="w-6 h-6 text-indigo-600" /> Good morning, {user?.name ?? 'Admin'}</h2>
          <div className="text-sm text-gray-500">Here's what's happening with your team today.</div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/projects/new" className="text-sm text-indigo-600 flex items-center gap-2"><Plus className="w-4 h-4" /> New Project</Link>
          <Link to="/tasks/new" className="text-sm text-indigo-600 flex items-center gap-2"><Plus className="w-4 h-4" /> New Task</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={totalProjects} subtitle={`${activeProjects} active`} icon={<FolderKanban className="w-5 h-5" />} />
        <StatCard title="Active Projects" value={activeProjects} subtitle="Currently open" icon={<Calendar className="w-5 h-5" />} />
        <StatCard title="Total Tasks" value={totalTasks} subtitle={`${inProgressTasks} in progress`} icon={<CheckSquare className="w-5 h-5" />} />
        <StatCard title="Overdue Tasks" value={overdueTasks} subtitle="Needs attention" icon={<AlertCircle className="w-5 h-5 text-red-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Project Progress</h3>
            <Link to="/projects" className="text-sm text-indigo-600">View all projects</Link>
          </div>

          <div className="space-y-3">
            {projectProgress.length ? projectProgress.map((pp: any) => (
              <div key={pp.project.id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-900">{pp.project.name}</div>
                      <StatusBadge status={pp.project.status} />
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{pp.project.description}</div>
                  </div>
                  <div className="w-48 text-right">
                    <div className="text-sm text-gray-500">{pp.done}/{pp.total} tasks</div>
                    <div className="mt-2"><ProgressBar percent={pp.percent} /></div>
                    <div className="text-xs text-gray-500 mt-2">{pp.percent}% complete</div>
                  </div>
                </div>
              </div>
            )) : <div className="bg-white p-4 rounded-2xl">No projects found.</div>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h3 className="text-lg font-medium mb-2">Tasks Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Circle className="w-3 h-3 text-amber-500" /> <div className="text-sm">Pending</div></div>
                    <div className="text-sm font-medium">{pendingTasks}</div>
                  </div>
                  <div className="mt-2"><ProgressBar percent={totalTasks ? Math.round((pendingTasks / totalTasks) * 100) : 0} /></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Circle className="w-3 h-3 text-amber-400" /> <div className="text-sm">In Progress</div></div>
                    <div className="text-sm font-medium">{inProgressTasks}</div>
                  </div>
                  <div className="mt-2"><ProgressBar percent={totalTasks ? Math.round((inProgressTasks / totalTasks) * 100) : 0} /></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Circle className="w-3 h-3 text-green-500" /> <div className="text-sm">Completed</div></div>
                    <div className="text-sm font-medium">{completedTasks}</div>
                  </div>
                  <div className="mt-2"><ProgressBar percent={totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
            <div className="space-y-3">
              {recentTasks.length ? recentTasks.map((t: any) => (
                <div key={t.id} className="flex items-start gap-3">
                  <Avatar name={t.assignedToName ?? t.authorName ?? 'User'} size={40} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{t.title}</div>
                    <div className="text-xs text-gray-500">Created {t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}</div>
                  </div>
                </div>
              )) : <div className="text-sm text-gray-500">No recent activity.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
