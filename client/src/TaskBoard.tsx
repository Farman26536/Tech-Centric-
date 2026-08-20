import { CircleCheck, CircleDashed, Clock3 } from 'lucide-react';
import type { Task, TaskStatus } from '../../types/teamflow';
import TaskCard from './TaskCard';

interface Props { tasks: Task[]; onStatusChange: (id: string, status: TaskStatus) => void; onOpen: (id: string) => void; }

const columns: Array<{ status: TaskStatus; label: string; icon: typeof CircleDashed }> = [
  { status: 'TODO', label: 'To Do', icon: CircleDashed },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: Clock3 },
  { status: 'COMPLETED', label: 'Completed', icon: CircleCheck },
];

export default function TaskBoard({ tasks, onStatusChange, onOpen }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {columns.map(({ status, label, icon: Icon }) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <section key={status} className="min-h-[420px] rounded-2xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><Icon size={18} /><h2 className="font-semibold text-slate-900">{label}</h2></div><span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">{columnTasks.length}</span></div>
            <div className="space-y-3">{columnTasks.map((task) => <TaskCard key={task.id} task={task} onStatusChange={(next) => onStatusChange(task.id, next)} onOpen={() => onOpen(task.id)} />)}</div>
          </section>
        );
      })}
    </div>
  );
}
