# GLINT — Where Skills Shine

>An AI-Powered Social media platform for freelancers and indepedent Workers.

[![Live Demo](https://img.shields.io/badge/Live_Demo-glint--freelancer--platform.netlify.app-FF6B00?style=for-the-badge)](https://glint-freelancer-platform.netlify.app/)

[![Built With](https://img.shields.io/badge/Built_With-React_+_JavaScript-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![ML](https://img.shields.io/badge/ML-TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow)](https://tensorflow.org)

---

## About

**GLINT** is a professional social platform designed to bridge the gap between freelance creators and hirers. Unlike traditional freelancing platforms where talent competes through bidding wars, GLINT lets creators showcase their actual work — portfolio pieces, code demos, video edits, and case studies — allowing hirers to discover talent organically through quality, not price.

GLINT now integrates Artificial Intelligence, Machine Learning, and Deep Learning technologies to create a smarter and safer hiring ecosystem.

### Problem Statement

Traditional freelancing platforms (Fiverr, Upwork) suffer from:

- **Race to the bottom** pricing due to competitive bidding
- **No social proof** beyond star ratings
- **Limited portfolio showcasing** capabilities
- **No intelligent recommendation system**
- **Fake portfolios and spam accounts**
- **No direct creator-hirer networking**

### Solution

GLINT provides:

- A **social media-style feed** where creators post their work
- **Direct hiring** without bidding — hirers find talent through content
- **AI-powered talent matching** using Machine Learning and Gemini
- **Deep Learning portfolio quality analysis**
- **AI spam and fraud detection**
- **Built-in messaging** for real-time collaboration
- **Transparent monetization** with 10% platform commission

---

# AI & ML Integrations

## 1. AI Talent Recommendation Engine

GLINT uses Machine Learning and Deep Neural Networks (DNN) to intelligently recommend:

- Best creators for hirers
- Matching jobs for creators
- Personalized creator feeds
- Similar talent based on skills and engagement

### Features
- Smart creator-job matching
- Personalized recommendations
- Feed ranking based on user interactions
- Skill-based creator discovery

### Technologies Used
- Python
- TensorFlow
- Scikit-learn
- Recommendation Algorithms
- NLP Embeddings

### AI Flow

```text
User Activity → ML Model → Recommendation Engine → Personalized Results
```

---

## 2. Portfolio Quality Detection using Deep Learning

GLINT automatically analyzes uploaded portfolios using Deep Learning models.

The AI evaluates:
- Creativity
- Professionalism
- Design quality
- Content relevance
- Portfolio category

### Features
- Automatic portfolio scoring
- AI-based image understanding
- Professional quality analysis
- Smart portfolio categorization

### Technologies Used
- CNN (Convolutional Neural Networks)
- TensorFlow
- OpenCV
- ResNet Models

### AI Flow

```text
Portfolio Upload → Deep Learning Model → Quality Score & Insights
```

---

## 3. AI Fraud / Spam Detection

GLINT uses AI models to maintain a secure and trusted platform.

The system detects:
- Fake creator profiles
- Spam job postings
- Duplicate portfolios
- Suspicious activity
- Scam behavior

### Features
- Spam account detection
- Fraud activity monitoring
- AI moderation system
- Intelligent content filtering

### Technologies Used
- Random Forest
- Scikit-learn
- NLP Text Classification
- Python ML Pipelines

### AI Flow

```text
User Content → AI Detection Model → Safe/Spam Classification
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + JavaScript | UI components & routing |
| **Styling** | Vanilla CSS + Framer Motion | Dark theme design & animations |
| **Database** | Supabase (PostgreSQL) | Users, posts, jobs, chats, hires |
| **Authentication** | Supabase Auth | Email + password with email verification |
| **File Storage** | Supabase Storage | Avatar, banner & portfolio uploads |
| **Backend APIs** | Vercel Serverless Functions | API handling |
| **AI Backend** | Python + FastAPI | ML & Deep Learning APIs |
| **AI/ML** | TensorFlow + Scikit-learn | Recommendation & detection systems |
| **Computer Vision** | OpenCV + CNN | Portfolio analysis |
| **NLP** | Sentence Transformers | Skill & text understanding |
| **AI Model** | Google Gemini 2.0 Flash | Content generation & smart matching |
| **Frontend Hosting** | Netlify | Production deployment with SPA routing |
| **Backend Hosting** | Vercel | Serverless API functions |

---

## Features
### Authentication & Security
- Strong authentication system using Supabase Auth
- Secure email/password login with encrypted credentials
- Email verification during account registration
- Protected routes and authenticated user sessions
- Secure API communication with backend validation
- Row Level Security (RLS) enabled in Supabase
- Spam and fraud protection using AI moderation
- Session management and access control

### For Creators
- Portfolio Posts — Share images, videos, code snippets, and case studies
- AI-Assisted Descriptions — Gemini generates professional post descriptions
- AI Portfolio Analysis — Deep Learning analyzes portfolio quality
- AI Job Recommendations — Personalized opportunities based on skills
- Direct Messaging — Chat with hirers in real-time
- Profile Analytics — Track followers, projects, and engagement
- Rate Cards — Set hourly and project-based pricing

### For Hirers
- Discovery Feed — Browse creator portfolios by category
- AI Talent Matching — AI recommends best-fit creators
- Job Posting — Post opportunities with required skills & budgets
- Direct Hiring — Hire creators without bidding
- Project Management — Track hire status (requested → active → completed)
- Reviews — Leave reviews for completed collaborations

### Platform Features
- Secure Auth — Email + password signup with email verification
- Dark Mode — Premium dark theme with glassmorphism effects
- Responsive Design — Mobile-friendly across all screen sizes
- Real-time Notifications — Activity alerts, messages, and job matches
- Social Graph — Follow/unfollow creators with feed personalization
- AI Fraud Detection — Intelligent spam and fake profile filtering
- AI Feed Personalization — ML-powered content recommendations
- AI Portfolio Ranking — Smart quality-based creator visibility

---

## Architecture

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    NETLIFY      │────▶│    VERCEL       │────▶│   AI/ML Layer   │
│   (Frontend)    │     │   (APIs)        │     │                 │
│                 │     │                 │     │ Recommendation  │
│  React + TS     │     │  Serverless     │     │ Portfolio AI    │
│  Framer Motion  │     │  Functions      │     │ Spam Detection  │
│  React Router   │     │                 │     │ Gemini AI       │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       ▼                       │
         │               ┌─────────────────┐             │
         └──────────────▶│   SUPABASE      │◀────────────┘
                         │ Database/Auth   │
                         └─────────────────┘
```

---

## Project Structure

```text
GLINT/
├── api/                        # Vercel serverless functions
│   ├── gemini-assist.js        # AI post description generator
│   ├── gemini-match.js         # AI talent matching engine
│   ├── recommendation-api.js   # ML recommendation system
│   ├── spam-detection.js       # Fraud & spam detection
│   ├── portfolio-analysis.js   # Deep learning portfolio analysis
│   ├── package.json
│   └── vercel.json             # CORS & routing config
│
├── ml-service/                 # AI & ML services
│   ├── recommendation/
│   ├── portfolio-detection/
│   ├── fraud-detection/
│   ├── models/
│   └── app.py
│
├── components/                 # Reusable React components
│   ├── AuthContext.tsx
│   ├── NotificationContext.tsx
│   ├── ThemeContext.tsx
│   ├── Layout.tsx
│   ├── PostCard.tsx
│   └── SplashScreen.tsx
│
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
```

---

-

## Screenshots

### Landing Page
Dark, premium landing page with animated gradient text and call-to-action buttons.

### Dashboard
Personalized social feed with trending posts, matching jobs sidebar, and featured creators.

### AI Talent Discovery
AI-powered search where hirers describe their project needs and the recommendation engine finds the best creators from the talent pool.

### Profile Page
Full creator profile with portfolio projects, skill tags, AI analysis, rate cards, reviews, and hire functionality.

---

## Database Schema

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

## AI Features

| Feature | Endpoint | Description |
|---------|----------|-------------|
| **AI Assist** | `/api/gemini-assist` | Generates professional descriptions for portfolio posts |
| **AI Match** | `/api/gemini-match` | Matches hirers with best-fit creators |
| **Recommendation Engine** | `/api/recommendation-api` | ML-powered creator & job recommendations |
| **Portfolio Analysis** | `/api/portfolio-analysis` | Deep Learning portfolio quality detection |
| **Spam Detection** | `/api/spam-detection` | AI fraud & spam filtering |
| **AI Image** | `/api/gemini-image` | Generates creative visuals for portfolio content |

All AI calls are routed through secure backend APIs to protect sensitive keys and model endpoints.

---

## User Roles

### Creator
- Post portfolio work (images, videos, code, case studies)
- Set rate cards (hourly & project rates)
- Explore and apply to jobs
- Receive AI recommendations
- Analyze portfolio quality
- Track active projects

### Hirer
- Browse creator portfolios
- Post jobs with skill requirements
- Use AI to discover talent
- Send hire requests with budget
- Manage ongoing projects

---

---

## Acknowledgements

- [React](https://react.dev) — UI framework
- [Supabase](https://supabase.com) — Backend-as-a-Service
- [TensorFlow](https://tensorflow.org) — Deep Learning framework
- [Scikit-learn](https://scikit-learn.org) — Machine Learning tools
- [Google Gemini](https://ai.google.dev) — AI capabilities
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Vercel](https://vercel.com) — Serverless deployment
- [Netlify](https://netlify.com) — Frontend hosting

---

<div align="center">
  <b>Built for the next generation of intelligent freelance hiring</b>
  <br />
  <i>GLINT — Where Skills Shine</i>
</div>
