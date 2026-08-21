import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchTask, updateTaskStatus } from '../../api/tasks.api';
import { fetchComments, createComment } from '../../api/comments.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export default function TaskDetails() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['task', id], queryFn: () => fetchTask(id!), enabled: Boolean(id) });
  const { data: comments } = useQuery({ queryKey: ['comments', id], queryFn: () => fetchComments(id!), enabled: Boolean(id) });
  const [content, setContent] = useState('');

  const commentMutation = useMutation({ mutationFn: (c: string) => createComment(id!, c), onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', id] }) });

  const statusMutation = useMutation({ mutationFn: (status: string) => updateTaskStatus(id!, status), onSuccess: () => qc.invalidateQueries({ queryKey: ['task', id] }) });

  if (isLoading) return <LoadingSpinner />;

  const task = data;
  if (!task) return <div>Not found</div>;
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{task.title}</h1>
          <div className="text-sm text-gray-500">{task.description}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={task.priority === 'HIGH' ? 'danger' : task.priority === 'MEDIUM' ? 'warning' : 'muted'}>{task.priority}</Badge>
          <Badge variant={task.status === 'COMPLETED' ? 'success' : 'info'}>{task.status}</Badge>
        </div>
      </div>

      <Card>
        <div className="flex gap-2">
          <Button onClick={() => statusMutation.mutate('IN_PROGRESS')} variant="secondary">Mark In Progress</Button>
          <Button onClick={() => statusMutation.mutate('COMPLETED')} variant="primary">Mark Completed</Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-medium mb-2">Comments</h3>
        <div className="space-y-3">
          {comments?.length ? comments.map((c: any) => (
            <div key={c.id} className="border rounded p-3">
              <div className="text-sm text-gray-800">{c.content}</div>
              <div className="text-xs text-gray-500 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
          )) : <div className="text-sm text-gray-500">No comments yet.</div>}

          <form onSubmit={(e) => { e.preventDefault(); commentMutation.mutate(content); setContent(''); }} className="flex gap-2">
            <input value={content} onChange={(e) => setContent(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Write a comment..." />
            <Button type="submit" variant="primary">Add Comment</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
