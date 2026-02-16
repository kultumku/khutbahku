# 🕌 KhutbahKu

**Khutbah Berkualitas, Praktis & Cepat** — AI-powered Islamic sermon generator.

## ✨ Features

- **AI Khutbah Generation** — Generate complete sermons with authentic Quran verses and Hadith
- **12 Event Types** — Friday sermon, Eid, nikah, aqiqah, and more
- **20 Themes** — Tauhid, akhlak, ibadah, muamalah, and more
- **4 Language Styles** — Formal, heartfelt, poetic, contemporary
- **5 Languages** — Indonesian, Javanese, Sundanese, English, Arabic
- **Word Export** — Download as .docx ready for printing
- **Supabase Auth** — Secure authentication with email/password

## 🚀 Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (Custom Islamic green theme)
- **Supabase** (Auth + PostgreSQL)
- **Anthropic Claude API** (AI generation)
- **docx** (Word document export)

## 📦 Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
4. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run `supabase/migration.sql` in the SQL Editor
   - Copy URL and anon key to `.env.local`
5. Get Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
6. Run dev server:
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `NEXT_PUBLIC_APP_URL` | App URL (default: http://localhost:3000) |

## 📁 Project Structure

```
├── app/
│   ├── (marketing)/      # Landing page
│   ├── (auth)/            # Login & Register
│   ├── (dashboard)/       # Dashboard, Generator, History, Viewer
│   ├── api/               # Generate & Export endpoints
│   └── auth/callback/     # Supabase auth callback
├── lib/
│   ├── constants/         # Events, themes, styles, languages
│   ├── supabase/          # Client, server, middleware
│   └── utils/             # Prompt builder
├── types/                 # TypeScript interfaces
└── supabase/              # Database migration SQL
```

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📄 License

MIT
