import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../../api/users.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';

export default function Team() {
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: () => fetchUsers(1, 100) });
  if (isLoading) return <LoadingSpinner />;
  const users = data?.data ?? [];
  if (!users.length) return <EmptyState title="No team members" description="Invite your team to collaborate." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Team</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u: any) => (
          <Card key={u.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>
            <div className="text-sm text-gray-500">{u.role}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
