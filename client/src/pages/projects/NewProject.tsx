import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';
import { createProject } from '../../api/projects.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export default function NewProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (payload: any) => createProject(payload),
    onSuccess: (data) => {
      navigate(`/projects/${data.id}`);
    }
  });
  const isLoading = (mutation as any).isLoading as boolean;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({ name: name.trim(), description: description.trim() });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">New Project</h1>
          <div className="text-sm text-gray-500">Create a new project for your team.</div>
        </div>
      </div>

      <Card className="p-6">
        {isLoading && <LoadingSpinner />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Project name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" required />
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" rows={4} />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" disabled={isLoading || !name.trim()}>Create project</Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            {mutation.isError && <div className="text-sm text-red-600">Error creating project</div>}
          </div>
        </form>
      </Card>
    </div>
  );
}
