# Knit Note

A fiber-arts project tracker: add, edit, and track knitting and crochet projects. Sign in with Google; your projects are private to your account.

- **Stack:** Next.js (App Router), React, NextAuth (Google), Neon (PostgreSQL), Bootstrap
- **Deploy:** Vercel (serverless API routes + server-side auth)

> **Note:** This Vercel-ready version was adapted from the original Knit Note (React + Express + SQLite) with the help of AI-assisted development—including migration to Next.js, Neon (PostgreSQL), and Google sign-in for user-scoped data. The structure and behavior mirror the original app where possible.

---

## Quick start (local)

1. **Clone and install**
   ```bash
   cd knit-note-vercel
   npm install
   ```

2. **Environment**
   - Copy `.env.local.example` to `.env.local`
   - Set `DATABASE_URL` (Neon connection string)
   - Set `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`)
   - Set `NEXTAUTH_URL=http://localhost:3000`
   - Create a [Google OAuth client](https://console.cloud.google.com/apis/credentials) (Web app, redirect URI `http://localhost:3000/api/auth/callback/google`) and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

3. **Database**
   - In [Neon](https://console.neon.tech), create a project and run:
   ```sql
   CREATE TABLE projects (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     category TEXT NOT NULL,
     craft TEXT NOT NULL,
     pattern TEXT,
     yarn TEXT,
     start_date DATE,
     end_date DATE,
     completed BOOLEAN NOT NULL DEFAULT FALSE,
     progress BOOLEAN NOT NULL DEFAULT FALSE,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     user_id TEXT
   );
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

---

## Deploy to Vercel

1. **Import** the repo in [Vercel](https://vercel.com) and set **Root Directory** to `knit-note-vercel`.
2. **Environment variables** (Project → Settings → Environment Variables):

   | Variable | Description |
   |----------|-------------|
   | `DATABASE_URL` | Neon connection string (use pooled) |
   | `NEXTAUTH_SECRET` | Strong random secret (e.g. 32+ bytes base64) |
   | `NEXTAUTH_URL` | Your Vercel URL, e.g. `https://your-app.vercel.app` |
   | `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
   | `GOOGLE_CLIENT_SECRET` | Google OAuth Client secret |

3. In **Google Cloud Console**, add this redirect URI to your OAuth client:  
   `https://<your-vercel-domain>/api/auth/callback/google`
4. Deploy. After the first deploy, set `NEXTAUTH_URL` to the real URL and redeploy if needed.

---

## Security

- All project API routes require a valid session and scope data by `user_id`; users cannot access each other’s projects.
- Auth and DB secrets are server-only (no `NEXT_PUBLIC_*`); Google client secret is never sent to the browser.
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are set in `next.config.mjs`.
- SQL is parameterized; `category` and `craft` are allowlisted. See `src/lib/validation.js`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |

---

For more detail (Neon free-tier monitoring, production checklist, troubleshooting), see [README.knit-note-vercel.md](./README.knit-note-vercel.md).
