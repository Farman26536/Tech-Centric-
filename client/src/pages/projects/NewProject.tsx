import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import { FormInput } from '../../components/common/FormInput';
import { Button } from '../../components/common/Button';
import { createProject } from '../../api/projects.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export default function NewProject() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const navigate = useNavigate();

  if (user && user.role !== 'ADMIN') {
    return <Navigate to="/projects" replace />;
  }

  const mutation = useMutation({
    mutationFn: (payload: any) => createProject(payload),
    onSuccess: (data) => {
      navigate(`/projects/${data.id}`);
    }
  });
  const isLoading = (mutation as any).isLoading as boolean;

  const validateDates = () => {
    if (!startDate || !endDate) {
      setDateError('Start date and end date are required.');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setDateError('Both dates must be valid dates.');
      return false;
    }

    if (end < start) {
      setDateError('End date cannot be earlier than start date.');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (!validateDates()) {
      return;
    }

    mutation.mutate({
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      dueDate: endDate
    });
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                required
              />
            </div>
          </div>

          {dateError && <div className="text-sm text-red-600">{dateError}</div>}

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
