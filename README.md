#  GLINT — Where Skills Shine

> A high-performance social ecosystem where talent is discovered by what they build, not what they bid.

<div align="center">

<a href="https://glint-freelancer-platform.netlify.app/">
  <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-GLINT_PLATFORM-FF6B00?style=for-the-badge&logo=vercel&logoColor=white" 
       alt="Live Demo"
       style="transform: scale(1.3); box-shadow: 0 0 20px rgba(255,107,0,0.8); border-radius: 10px;" />
</a>

</div>

<br/>

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


┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ │ │ │ │ │
│ NETLIFY │────▶│ VERCEL │ │ SUPABASE │
│ (Frontend) │ │ (API Proxy) │ │ (Database + │
│ │ │ │ │ Auth + Storage)│
│ React + TS │ │ Serverless │ │ │
│ Framer Motion │ │ Functions │ │ PostgreSQL │
│ React Router │ │ │ │ Row Level Sec │
│ │ │ gemini-assist │ │ Realtime │
│ │ │ gemini-match │ │ │
│ │ │ gemini-image │ │ │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
│ │ │
│ Supabase SDK │ Gemini API │
└───────────────────────┴───────────────────────┘


---

##  Project Structure


GLINT/
├── api/
├── components/
├── pages/
├── services/
├── App.tsx
├── index.tsx
├── index.css
├── types.ts
├── vite.config.ts
├── netlify.toml
├── supabase_schema.sql
├── .env.example
└── package.json


---

##  Database Schema

| Table | Description |
|-------|-------------|
| `users` | User profiles |
| `posts` | Portfolio posts |
| `jobs` | Job listings |
| `comments` | Comments |
| `notifications` | Alerts |
| `chats` | Chat threads |
| `messages` | Messages |
| `hires` | Hire tracking |

---

##  Acknowledgements

- React  
