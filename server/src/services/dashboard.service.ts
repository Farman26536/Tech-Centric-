import { prisma } from '../config/database.js';

export const overview = async () => {
  const totalProjects = await prisma.project.count();
  const activeProjects = await prisma.project.count({ where: { status: 'ACTIVE' } });
  const completedProjects = await prisma.project.count({ where: { status: 'COMPLETED' } });

  const totalTasks = await prisma.task.count();
  const pendingTasks = await prisma.task.count({ where: { status: 'TODO' } });
  const inProgressTasks = await prisma.task.count({ where: { status: 'IN_PROGRESS' } });
  const completedTasks = await prisma.task.count({ where: { status: 'COMPLETED' } });

  const overdueTasks = await prisma.task.count({ where: { dueDate: { lt: new Date() }, NOT: { status: 'COMPLETED' } } });

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks
  };
};

export const projectsOverview = async () => {
  const projects = await prisma.project.findMany({ include: { tasks: true } });
  const data = projects.map((p) => {
    const total = p.tasks.length;
    const completed = p.tasks.filter((t) => t.status === 'COMPLETED').length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { id: p.id, name: p.name, totalTasks: total, completedTasks: completed, progress };
  });
  return data;
};

export const tasksOverview = async () => {
  const tasks = await prisma.task.findMany({ include: { project: true, assignedTo: true } });
  return tasks;
};

export const teamPerformance = async () => {
  const users = await prisma.user.findMany();
  const data = await Promise.all(
    users.map(async (u) => {
      const total = await prisma.task.count({ where: { assignedToId: u.id } });
      const completed = await prisma.task.count({ where: { assignedToId: u.id, status: 'COMPLETED' } });
      return { userId: u.id, name: u.name, total, completed };
    })
  );
  return data;
};
