#  GLINT — Where Skills Shine

> A high-performance social ecosystem where talent is discovered by what they build, not what they bid.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-glint--freelancer--platform.netlify.app-FF6B00?style=for-the-badge)](https://glint-freelancer-platform.netlify.app/)
[![Built With](https://img.shields.io/badge/Built_With-React_+_JavaScript-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)

---

##  About

**GLINT** is a professional social platform designed to bridge the gap between freelance creators and hirers. Unlike traditional freelancing platforms where talent competes through bidding wars, GLINT lets creators showcase their actual work — portfolio pieces, code demos, video edits, and case studies — allowing hirers to discover talent organically through quality, not price.

###  Problem Statement

Traditional freelancing platforms (Fiverr, Upwork) suffer from:
- **Race to the bottom** pricing due to competitive bidding
- **No social proof** beyond star ratings
- **Limited portfolio showcasing** capabilities
- **No direct creator-hirer networking**

###  Solution

GLINT provides:
- A **social media-style feed** where creators post their work
- **Direct hiring** without bidding — hirers find talent through content
- **AI-powered talent matching** using Google Gemini
- **Built-in messaging** for real-time collaboration
- **Transparent monetization** with 10% platform commission

---

##  Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React  + JvaScript | UI components & routing |
| **Styling** | Vanilla CSS + Framer Motion | Dark theme design & animations |
| **Database** | Supabase (PostgreSQL) | Users, posts, jobs, chats, hires |
| **Authentication** | Supabase Auth | Email + password with email verification |
| **File Storage** | Supabase Storage | Avatar, banner & portfolio uploads |
| **AI Backend** | Vercel Serverless Functions | Gemini API proxy (secure) |
| **AI Model** | Google Gemini 2.0 Flash | Content generation, talent matching |
| **Frontend Hosting** | Netlify | Production deployment with SPA routing |
| **Backend Hosting** | Vercel | Serverless API functions |

---

##  Features

### For Creators
-  **Portfolio Posts** — Share images, videos, code snippets, and case studies
-  **AI-Assisted Descriptions** — Gemini generates professional post descriptions
-  **Job Matching** — Get notified about jobs matching your skillset
-  **Direct Messaging** — Chat with hirers in real-time
-  **Profile Analytics** — Track followers, projects, and engagement
-  **Rate Cards** — Set hourly and project-based pricing

### For Hirers
-  **Discovery Feed** — Browse creator portfolios by category
-  **AI Talent Matching** — Describe your needs, Gemini finds the best creators
-  **Job Posting** — Post opportunities with required skills & budgets
-  **Direct Hiring** — Hire creators without bidding
-  **Project Management** — Track hire status (requested → active → completed)
-  **Reviews** — Leave reviews for completed collaborations

### Platform Features
-  **Secure Auth** — Email + password signup with email verification
-  **Dark Mode** — Premium dark theme with glassmorphism effects
-  **Responsive Design** — Mobile-friendly across all screen sizes
-  **Real-time Notifications** — Activity alerts, messages, and job matches
-  **Social Graph** — Follow/unfollow creators with feed personalization
-  **AI Image Generation** — Generate portfolio visuals using Gemini

---

##  Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    NETLIFY      │────▶│    VERCEL       │     │   SUPABASE      │
│   (Frontend)    │     │   (API Proxy)   │     │  (Database +    │
│                 │     │                 │     │   Auth + Storage)│
│  React + TS     │     │  Serverless     │     │                 │
│  Framer Motion  │     │  Functions      │     │  PostgreSQL     │
│  React Router   │     │                 │     │  Row Level Sec  │
│                 │     │  gemini-assist  │     │  Realtime       │
│                 │     │  gemini-match   │     │                 │
│                 │     │  gemini-image   │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │    Supabase SDK       │   Gemini API          │
         └───────────────────────┴───────────────────────┘
```

---

##  Project Structure

```
GLINT/
├── api/                        # Vercel serverless functions
│   ├── gemini-assist.js        # AI post description generator
│   ├── gemini-match.js         # AI talent matching engine
│   ├── gemini-image.js         # AI image generation
│   ├── package.json
│   └── vercel.json             # CORS & routing config
│
├── components/                 # Reusable React components
│   ├── AuthContext.tsx          # Supabase authentication provider
│   ├── NotificationContext.tsx  # Real-time notification system
│   ├── ThemeContext.tsx         # Dark/light theme provider
│   ├── Layout.tsx               # App shell with navigation
│   ├── PostCard.tsx             # Social feed post component
│   └── SplashScreen.tsx         # Loading splash screen
│
├── pages/                      # Route-based page components
│   ├── LandingPage.tsx          # Public homepage
│   ├── LoginPage.tsx            # Sign up / Sign in
│   ├── RoleSelectPage.tsx       # Creator or Hirer selection
│   ├── Dashboard.tsx            # Personalized feed
│   ├── ProfilePage.tsx          # User profiles + portfolio
│   ├── CreatePostPage.tsx       # Post creation with AI assist
│   ├── ExploreJobsPage.tsx      # Job discovery for creators
│   ├── PostJobPage.tsx          # Job posting for hirers
│   ├── HirerDiscovery.tsx       # AI-powered talent search
│   ├── HirerJobsPage.tsx        # Hirer's posted jobs
│   ├── HireManagementPage.tsx   # Active project tracking
│   ├── MessagesPage.tsx         # Real-time messaging
│   ├── NotificationsPage.tsx    # Activity feed
│   └── MonetizationPage.tsx     # Pricing plans
│
├── services/                   # Data & API services
│   ├── supabaseClient.ts       # Supabase SDK initialization
│   ├── dataService.ts          # All DB CRUD operations
│   └── storageService.ts       # File upload handling
│
├── App.tsx                     # Root component + routing
├── index.tsx                   # React entry point
├── index.css                   # Global styles + design tokens
├── types.ts                    # TypeScript type definitions
├── vite.config.ts              # Build configuration
├── netlify.toml                # Netlify deployment config
├── supabase_schema.sql         # Database schema + seed data
├── .env.example                # Environment variables template
└── package.json                # Dependencies
```

---


##  Database Schema

| Table | Description |
|-------|-------------|
| `users` | User profiles (creators & hirers) |
| `posts` | Portfolio posts with media |
| `jobs` | Job listings posted by hirers |
| `comments` | Comments on posts |
| `notifications` | Activity & message alerts |
| `chats` | Chat threads between users |
| `messages` | Individual chat messages |
| `hires` | Hire contracts & status tracking |

All tables have **Row Level Security (RLS)** enabled with appropriate read/write policies.

---

##  AI Features (Gemini Integration)

| Feature | Endpoint | Description |
|---------|----------|-------------|
| **AI Assist** | `/api/gemini-assist` | Generates professional descriptions for portfolio posts |
| **AI Match** | `/api/gemini-match` | Matches hirers with best-fit creators from the talent pool |
| **AI Image** | `/api/gemini-image` | Generates creative visuals for portfolio content |

All AI calls are routed through **Vercel serverless functions** to keep the API key secure (never exposed to the client).

---

##  User Roles

### Creator
- Post portfolio work (images, videos, code, case studies)
- Set rate cards (hourly & project rates)
- Explore and apply to jobs
- Accept/decline hire requests
- Track active projects

### Hirer
- Browse creator portfolios
- Post jobs with skill requirements
- Use AI to find matching talent
- Send hire requests with budget
- Manage ongoing projects

---


---

##  Acknowledgements

- [React](https://react.dev) — UI framework
- [Supabase](https://supabase.com) — Backend-as-a-Service
- [Google Gemini](https://ai.google.dev) — AI capabilities
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Lucide Icons](https://lucide.dev) — Icon library
- [Vercel](https://vercel.com) — Serverless deployment
- [Netlify](https://netlify.com) — Frontend hosting

---

<div align="center">
  <b>Built for the freelance community</b>
  <br />
  <i>GLINT — Where Skills Shine ✨</i>
</div>
