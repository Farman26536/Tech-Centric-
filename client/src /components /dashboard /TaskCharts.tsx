import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { DashboardCharts } from '../../types/teamflow';

interface Props { charts: DashboardCharts; }

const statusLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' } as const;
const priorityLabels = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' } as const;

export default function import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { DashboardCharts } from '../../types/teamflow';

interface Props { charts: DashboardCharts; }

const statusLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' } as const;
const priorityLabels = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' } as const;

export default function TaskCharts({ charts }: Props) {
  const statusData = charts.taskStatus.map((item) => ({ ...item, name: statusLabels[item.status] }));
  const priorityData = charts.taskPriority.map((item) => ({ ...item, name: priorityLabels[item.priority] }));

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Task Status Distribution</h2>
          <p className="text-sm text-slate-500">Current task workload by status.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="count" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={3}>
                {statusData.map((entry) => <Cell key={entry.status} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Task Priority Distribution</h2>
          <p className="text-sm text-slate-500">How work is distributed by urgency.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
({ charts }: Props) {
  const statusData = charts.taskStatus.map((item) => ({ ...item, name: statusLabels[item.status] }));
  const priorityData = charts.taskPriority.map((item) => ({ ...item, name: priorityLabels[item.priority] }));

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Task Status Distribution</h2>
          <p className="text-sm text-slate-500">Current task workload by status.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="count" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={3}>
                {statusData.map((entry) => <Cell key={entry.status} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Task Priority Distribution</h2>
          <p className="text-sm text-slate-500">How work is distributed by urgency.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
