# GLINT — Where Skills Shine

> An AI Powered Social platform freelancers and Indepedent workers.

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
- **No intelligent recommendation system**
- **Fake portfolios and spam accounts**
- **Limited portfolio showcasing** capabilities
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

## AI & ML Integrations

### 1. AI Talent Recommendation Engine

GLINT uses Machine Learning and Deep Neural Networks (DNN) to intelligently recommend:

- Best creators for hirers
- Matching jobs for creators
- Personalized creator feeds
- Similar talent based on skills and engagement

#### Features
- Smart creator-job matching
- Personalized recommendations
- Feed ranking based on user interactions
- Skill-based creator discovery

#### Technologies Used
- Python
- TensorFlow
- Scikit-learn
- Recommendation Algorithms
- NLP Embeddings

#### AI Flow

```text
User Activity → ML Model → Recommendation Engine → Personalized Results
```

---

### 2. Portfolio Quality Detection using Deep Learning

GLINT automatically analyzes uploaded portfolios using Deep Learning models.

The AI evaluates:
- Creativity
- Professionalism
- Design quality
- Content relevance
- Portfolio category

#### Features
- Automatic portfolio scoring
- AI-based image understanding
- Professional quality analysis
- Smart portfolio categorization

#### Technologies Used
- CNN (Convolutional Neural Networks)
- TensorFlow
- OpenCV
- ResNet Models

#### AI Flow

```text
Portfolio Upload → Deep Learning Model → Quality Score & Insights
```

---

### 3. AI Fraud / Spam Detection

GLINT uses AI models to maintain a secure and trusted platform.

The system detects:
- Fake creator profiles
- Spam job postings
- Duplicate portfolios
- Suspicious activity
- Scam behavior

#### Features
- Spam account detection
- Fraud activity monitoring
- AI moderation system
- Intelligent content filtering

#### Technologies Used
- Random Forest
- Scikit-learn
- NLP Text Classification
- Python ML Pipelines

#### AI Flow

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
│   └── vercel.json
│
├── ml-service/                 # AI & ML services
│   ├── recommendation/
│   ├── portfolio-detection/
│   ├── fraud-detection/
│   ├── models/
│   └── app.py
│
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
```

---



## AI Features Summary

| Feature | AI Technology |
|---------|---------------|
| Talent Recommendation | DNN + Recommendation ML |
| Portfolio Detection | CNN + Deep Learning |
| Fraud Detection | Random Forest + NLP |
| Smart Matching | Gemini AI |
| Feed Personalization | ML Ranking System |

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

## User Roles

### Creator
- Post portfolio work
- Receive AI recommendations
- Analyze portfolio quality
- Explore jobs
- Accept/decline hire requests

### Hirer
- Browse creator portfolios
- Use AI to discover talent
- Post jobs
- Hire creators directly
- Manage projects

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgements

- [React](https://react.dev)
- [Supabase](https://supabase.com)
- [TensorFlow](https://tensorflow.org)
- [Scikit-learn](https://scikit-learn.org)
- [Google Gemini](https://ai.google.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)

---

<div align="center">
  <b>Built for the next generation of intelligent freelance hiring</b>
  <br />
  <i>GLINT — Where Skills Shine</i>
</div>
