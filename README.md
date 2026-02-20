# AMacademy Music Website

Official website for AMacademy.

Live site: [www.amacademymusic.com](https://www.amacademymusic.com)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Supabase (Postgres + API)

## Features

- Modern landing page (hero, social links, gallery, testimonials)
- Dedicated testimonials page with:
  - 4-column rolling review wall
  - alternating vertical animation
  - pause-on-hover per column
  - review submission form
- Review form integrated with Supabase
- Dynamic review cards created from submitted reviews

## Project Structure

- `app/` routes and API handlers
- `components/` UI and page sections
- `lib/supabase/` Supabase clients and database types
- `supabase/schema.sql` database schema and policies

## Local Setup

1. Install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Create local env file:

```bash
cp .env.example .env.local
```

3. Set required environment variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Run the database schema in Supabase SQL Editor:

- `supabase/schema.sql`

5. Start the app:

```bash
npm run dev
```

## API Endpoints

- `POST /api/inquiries` submit inquiry form data
- `GET /api/reviews` fetch latest reviews
- `POST /api/reviews` submit a review (name, role, rating, message)

## Deployment

Deploy on Vercel with the same three environment variables set in the project settings.

## Notes

- Keep secrets only in `.env.local` and Vercel environment variables.
- Do not commit real keys inside tracked files.

