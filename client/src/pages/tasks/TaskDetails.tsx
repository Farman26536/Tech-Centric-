import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchTask, updateTaskStatus } from '../../api/tasks.api';
import { fetchComments, createComment } from '../../api/comments.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import AttachmentPanel from '../../components/features/AttachmentPanel';
import ActivityTimeline from '../../components/features/ActivityTimeline';

export default function TaskDetails() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['task', id], queryFn: () => fetchTask(id!), enabled: Boolean(id) });
  const { data: comments } = useQuery({ queryKey: ['comments', id], queryFn: () => fetchComments(id!), enabled: Boolean(id) });
  const [content, setContent] = useState('');
  const commentMutation = useMutation({ mutationFn: (c: string) => createComment(id!, c), onSuccess: () => { void qc.invalidateQueries({ queryKey: ['comments', id] }); void qc.invalidateQueries({ queryKey: ['activities', id, undefined] }); } });
  const statusMutation = useMutation({ mutationFn: (status: string) => updateTaskStatus(id!, status), onSuccess: () => { void qc.invalidateQueries({ queryKey: ['task', id] }); void qc.invalidateQueries({ queryKey: ['activities', id, undefined] }); } });
  if (isLoading) return <LoadingSpinner />;
  const task = data;
  if (!task) return <div>Not found</div>;
  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
  return <div className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold">{task.title}</h1><p className="text-sm text-slate-500">{task.description}</p><div className="mt-2 flex gap-2 text-xs">{task.dueDate && <span className={overdue ? 'font-semibold text-red-600' : 'text-slate-500'}>{overdue ? 'Overdue · ' : 'Due · '}{new Date(task.dueDate).toLocaleString()}</span>}</div></div><div className="flex gap-2"><Badge variant={task.priority === 'HIGH' ? 'danger' : task.priority === 'MEDIUM' ? 'warning' : 'muted'}>{task.priority}</Badge><Badge variant={task.status === 'COMPLETED' ? 'success' : 'info'}>{task.status}</Badge></div></div>
    <Card><div className="flex flex-wrap gap-2"><Button onClick={() => statusMutation.mutate('TODO')} variant="secondary">To Do</Button><Button onClick={() => statusMutation.mutate('IN_PROGRESS')} variant="secondary">In Progress</Button><Button onClick={() => statusMutation.mutate('COMPLETED')} variant="primary">Mark Completed</Button></div></Card>
    <AttachmentPanel taskId={id!}/>
    <Card><h3 className="text-lg font-medium mb-2">Comments & collaboration</h3><div className="space-y-3">{comments?.length ? comments.map((c:any)=><div key={c.id} className="rounded-xl border p-3 dark:border-slate-700"><div className="text-sm">{c.content}</div><div className="mt-1 text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</div></div>) : <div className="text-sm text-slate-500">No comments yet.</div>}<form onSubmit={e=>{e.preventDefault();if(!content.trim())return;commentMutation.mutate(content);setContent('')}} className="flex gap-2"><input value={content} onChange={e=>setContent(e.target.value)} className="flex-1 rounded-lg border px-3 py-2 dark:border-slate-700 dark:bg-slate-800" placeholder="Write a comment..."/><Button type="submit" variant="primary">Add</Button></form></div></Card>
    <ActivityTimeline taskId={id}/>
  </div>;
}
