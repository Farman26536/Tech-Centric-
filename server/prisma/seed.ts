import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hash = async (pwd: string) => bcrypt.hash(pwd, 10);

async function main() {
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hash('Admin123');
  const johnPassword = await hash('John12345');
  const sarahPassword = await hash('Sarah12345');
  const mikePassword = await hash('Mike12345');

  const admin = await prisma.user.create({ data: { name: 'Admin User', email: 'admin@example.com', passwordHash: adminPassword, role: 'ADMIN' } });
  const john = await prisma.user.create({ data: { name: 'John Doe', email: 'john@example.com', passwordHash: johnPassword, role: 'MEMBER' } });
  const sarah = await prisma.user.create({ data: { name: 'Sarah Connor', email: 'sarah@example.com', passwordHash: sarahPassword, role: 'MEMBER' } });
  const mike = await prisma.user.create({ data: { name: 'Mike Ross', email: 'mike@example.com', passwordHash: mikePassword, role: 'MEMBER' } });

  const projects = [];
  projects.push(
    await prisma.project.create({ data: { name: 'Website Redesign', description: 'Revamp the company website', startDate: new Date(), dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) } })
  );
  projects.push(
    await prisma.project.create({ data: { name: 'Mobile App', description: 'Build mobile app', startDate: new Date(), dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45) } })
  );
  projects.push(
    await prisma.project.create({ data: { name: 'Marketing Campaign', description: 'Launch campaign', startDate: new Date(), dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15) } })
  );

  const tasksData = [
    { title: 'Design homepage', projectId: projects[0].id, assignedToId: john.id, priority: 'HIGH', status: 'IN_PROGRESS', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) },
    { title: 'Implement responsive layout', projectId: projects[0].id, assignedToId: sarah.id, priority: 'MEDIUM', status: 'TODO', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10) },
    { title: 'Create signup flow', projectId: projects[1].id, assignedToId: mike.id, priority: 'HIGH', status: 'TODO', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20) },
    { title: 'Push marketing creatives', projectId: projects[2].id, assignedToId: john.id, priority: 'LOW', status: 'TODO', dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
    { title: 'QA mobile app', projectId: projects[1].id, assignedToId: sarah.id, priority: 'MEDIUM', status: 'IN_PROGRESS', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) }
  ];

  const tasks = [];
  for (const t of tasksData) {
    tasks.push(await prisma.task.create({ data: t as any }));
  }

  await prisma.comment.create({ data: { content: 'Looks good!', authorId: john.id, taskId: tasks[0].id } });
  await prisma.comment.create({ data: { content: 'Please update the assets', authorId: sarah.id, taskId: tasks[1].id } });
  await prisma.comment.create({ data: { content: 'Blocked by API', authorId: mike.id, taskId: tasks[2].id } });

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
