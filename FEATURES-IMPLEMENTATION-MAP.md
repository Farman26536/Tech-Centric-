# TeamFlow Feature Implementation Map

| Requested feature | Implementation |
|---|---|
| Global Search | `client/src/components/features/GlobalSearch.tsx` + `/api/features/search` |
| Advanced Filtering & Sorting | Enhanced `client/src/pages/tasks/Tasks.tsx` + task service query params |
| Priority & Due Reminders | Priority badges, overdue filter, notification generation |
| Activity Timeline & Audit | `ActivityTimeline.tsx`, `activity.service.ts`, `ActivityLog` Prisma model |
| Dashboard Analytics & Charts | `Analytics.tsx` + `/api/features/analytics` |
| Notification Center | `NotificationCenter.tsx` + notification API/model |
| Dark Mode | `ThemeContext.tsx`, `ThemeToggle.tsx`, dark UI overrides |
| File Attachments | `AttachmentPanel.tsx` + DB-backed attachment API, 5 MB limit |
| Email Notifications | Optional Resend HTTP integration in `email.service.ts` |
| PDF / Excel Reports | Browser print-to-PDF + Excel-compatible CSV export in `Reports.tsx` |
| Team Performance Metrics | Analytics performance table |
| Calendar View | `Calendar.tsx` |
| Comments & Collaboration | Task comments plus activity/audit integration |
| Pagination & Lazy Loading | `useInfiniteQuery` task list + server pagination |
| Validation & Error Handling | File size validation, API error middleware compatibility, defensive UI states |

## Important

The repository remains compatible with the existing architecture. New database entities are added in one Prisma migration. Run `prisma generate` and apply the migration before starting the server.
