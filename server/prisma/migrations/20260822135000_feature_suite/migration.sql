-- TeamFlow feature suite migration
CREATE TYPE "NotificationType" AS ENUM ('TASK_DUE', 'TASK_OVERDUE', 'COMMENT', 'ASSIGNMENT', 'SYSTEM');

CREATE TABLE "Notification" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
  "read" BOOLEAN NOT NULL DEFAULT false,
  "emailSent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "readAt" TIMESTAMP(3),
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActivityLog" (
  "id" UUID NOT NULL,
  "actorId" UUID,
  "action" VARCHAR(80) NOT NULL,
  "entity" VARCHAR(40) NOT NULL,
  "entityId" UUID,
  "message" TEXT NOT NULL,
  "metadata" JSONB,
  "projectId" UUID,
  "taskId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Attachment" (
  "id" UUID NOT NULL,
  "fileName" VARCHAR(255) NOT NULL,
  "mimeType" VARCHAR(120) NOT NULL,
  "size" INTEGER NOT NULL,
  "data" TEXT NOT NULL,
  "taskId" UUID NOT NULL,
  "uploadedById" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
CREATE INDEX "ActivityLog_entity_entityId_idx" ON "ActivityLog"("entity", "entityId");
CREATE INDEX "ActivityLog_projectId_idx" ON "ActivityLog"("projectId");
CREATE INDEX "ActivityLog_taskId_idx" ON "ActivityLog"("taskId");
CREATE INDEX "Attachment_taskId_idx" ON "Attachment"("taskId");
