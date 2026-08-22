import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';
import { createTask } from '../../api/tasks.api';
import { fetchProjects } from '../../api/projects.api';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export default function NewTask() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<'LOW'|'MEDIUM'|'HIGH'>('MEDIUM');
  const navigate = useNavigate();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/403" replace />;
  }

  const { data: projectsRes, isLoading: loadingProjects } = useQuery({ queryKey: ['projects'], queryFn: () => fetchProjects(1, 100) });
  const projects = projectsRes?.data ?? [];

  const mutation = useMutation({
    mutationFn: (payload: any) => createTask(payload),
    onSuccess: (data) => {
      navigate(`/tasks/${data.id}`);
    }
  });
  const isLoading = (mutation as any).isLoading as boolean;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate({ title: title.trim(), description: description.trim(), projectId: projectId || undefined, priority });
  };

  if (loadingProjects) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">New Task</h1>
          <div className="text-sm text-gray-500">Create a task and assign it to a project or team member.</div>
        </div>
      </div>

      <Card className="p-6">
        {isLoading && <LoadingSpinner />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required />
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project</label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2">
                <option value="">No project</option>
                {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="mt-1 block w-full border rounded px-3 py-2">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" disabled={isLoading || !title.trim()}>Create task</Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            {mutation.isError && <div className="text-sm text-red-600">Error creating task</div>}
          </div>
        </form>
      </Card>
    </div>
  );
}
