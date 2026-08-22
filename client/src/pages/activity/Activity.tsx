import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '../../api/features.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import ActivityTimeline from '../../components/features/ActivityTimeline';
export default function Activity() {
  const { isLoading } = useQuery({ queryKey: ['activities-page'], queryFn: () => fetchActivities() });
  if (isLoading) return <LoadingSpinner />;
  return <div className="space-y-4"><div><h1 className="text-2xl font-semibold">Activity Timeline</h1><p className="text-sm text-slate-500">Audit history across team actions.</p></div><ActivityTimeline /></div>;
}
