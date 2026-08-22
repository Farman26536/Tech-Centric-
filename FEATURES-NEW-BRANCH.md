# TeamFlow – New Feature Suite

This branch adds the feature suite requested for the TeamFlow repository.

## Included
1. Global search across projects/tasks
2. Advanced task filtering, sorting and pagination/lazy loading
3. Priority indicators and due/overdue reminders
4. Activity timeline and audit history
5. Dashboard analytics and charts
6. Notification center
7. Dark mode
8. Task file attachments (5 MB per file, DB-backed)
9. Email notifications through optional Resend integration
10. PDF/Excel-compatible report export (browser print + CSV)
11. Team performance metrics
12. Calendar view
13. Enhanced comments/collaboration integration
14. Pagination and lazy loading
15. Validation/error handling improvements

## Setup

From the repository root:

```bash
npm install
npm install --prefix server
npm install --prefix client

npx prisma generate --schema server/prisma/schema.prisma
npx prisma migrate deploy --schema server/prisma/schema.prisma

npm run build
```

If your development database is being used with `prisma migrate dev`, run:

```bash
npx prisma migrate dev --schema server/prisma/schema.prisma
```

### Optional email configuration

Add to `server/.env`:

```env
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=TeamFlow <notifications@your-domain.com>
```

Email reminders are sent when the notification center checks due tasks. Without these variables, in-app notifications still work.

### File attachments

Attachments are stored in PostgreSQL as base64 for portability and are limited to 5 MB. For production-scale file storage, replace the attachment service with S3/Cloudinary/Supabase Storage.

## Git branch

```bash
git checkout main
git pull origin main
git checkout -b feature/teamflow-new-features
git add .
git commit -m "Add TeamFlow feature suite"
git push -u origin feature/teamflow-new-features
```
