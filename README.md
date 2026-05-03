# Wizard Films CRM

This project is a Next.js site with a built-in lightweight CRM:

- Neon Postgres via Prisma
- Password-only admin access at `/admin`
- Vercel Blob uploads for images and video assets
- Public contact form submissions stored in the database

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to your Neon connection string.
3. Set `ADMIN_PASSWORD` for the `/admin` route.
4. Add `BLOB_READ_WRITE_TOKEN` if you want uploads inside the admin.
5. Run:

```bash
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

## Admin

Visit [http://localhost:3000/admin](http://localhost:3000/admin) and sign in with the password from `ADMIN_PASSWORD`.

The admin lets you manage:

- Site settings
- Homepage copy and hero media URLs
- Projects
- Services
- About page content
- Contact page content and social links
- Contact submissions
- Blob-hosted media assets
