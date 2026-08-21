import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { fetchProject } from '../../api/projects.api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export default function ProjectDetails() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['project', id], queryFn: () => fetchProject(id!), enabled: Boolean(id) });
  if (isLoading) return <LoadingSpinner />;
  const project = data;
  if (!project) return <div>Not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <div className="text-sm text-gray-500">{project.description}</div>
        </div>
        <div className="text-right">
          <Badge variant={project.status === 'ACTIVE' ? 'info' : 'muted'}>{project.status}</Badge>
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-medium mb-2">Tasks</h3>
        {project.tasks?.length ? (
          <ul className="space-y-2">
            {project.tasks.map((t: any) => (
              <li key={t.id} className="flex items-center justify-between">
                <div>
                  <Link to={`/tasks/${t.id}`} className="font-medium hover:underline">{t.title}</Link>
                  <div className="text-sm text-gray-500">{t.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={t.status === 'COMPLETED' ? 'success' : t.status === 'IN_PROGRESS' ? 'warning' : 'muted'}>{t.status}</Badge>
                  <div className="text-sm text-gray-500">{t.priority}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">No tasks yet for this project.</div>
        )}
      </Card>
    </div>
  );
}
