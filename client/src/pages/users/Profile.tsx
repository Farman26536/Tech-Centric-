import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="max-w-lg">
      <Card>
        <h1 className="text-xl font-semibold">{user.name}</h1>
        <div className="text-sm text-gray-500">{user.email}</div>
        <div className="mt-4">
          <div className="text-sm text-gray-500">Role</div>
          <div className="text-sm font-medium">{user.role}</div>
        </div>
      </Card>
    </div>
  );
}
