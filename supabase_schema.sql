-- ============================================
-- GLINT - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'UNSET',
  avatar TEXT,
  banner TEXT,
  bio TEXT,
  title TEXT,
  location TEXT,
  experience_level TEXT,
  skill_tags TEXT[] DEFAULT '{}',
  projects JSONB DEFAULT '[]',
  rate_card JSONB,
  portfolio_url TEXT,
  balance NUMERIC DEFAULT 0,
  reviews JSONB DEFAULT '[]',
  availability BOOLEAN DEFAULT false,
  following TEXT[] DEFAULT '{}',
  followers TEXT[] DEFAULT '{}',
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES users(id),
  creator_name TEXT NOT NULL,
  creator_avatar TEXT,
  type TEXT NOT NULL DEFAULT 'image',
  title TEXT NOT NULL,
  description TEXT,
  skill_tags TEXT[] DEFAULT '{}',
  media_url TEXT,
  likes TEXT[] DEFAULT '{}',
  saves TEXT[] DEFAULT '{}',
  comment_count INTEGER DEFAULT 0,
  timestamp BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  hirer_id TEXT NOT NULL REFERENCES users(id),
  hirer_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT[] DEFAULT '{}',
  budget_range TEXT,
  timeline TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  timestamp BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  text TEXT NOT NULL,
  timestamp BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  from_user_id TEXT,
  from_user_name TEXT,
  timestamp BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  read BOOLEAN DEFAULT false
);

-- ============================================
-- CHATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  participants TEXT[] NOT NULL,
  last_message TEXT,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id),
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  text TEXT NOT NULL,
  timestamp BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ============================================
-- HIRES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hires (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES users(id),
  hirer_id TEXT NOT NULL REFERENCES users(id),
  job_title TEXT NOT NULL,
  budget TEXT,
  status TEXT NOT NULL DEFAULT 'requested',
  timestamp BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hires ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read all data (public social platform)
CREATE POLICY "Allow authenticated read" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON chats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON hires FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow own notifications read" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid()::TEXT);

-- Allow authenticated users to insert data
CREATE POLICY "Allow authenticated insert" ON users FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON jobs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON comments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON chats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON messages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON hires FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update data
CREATE POLICY "Allow authenticated update" ON users FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated update" ON posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated update" ON jobs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated update" ON notifications FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated update" ON chats FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated update" ON hires FOR UPDATE TO authenticated USING (true);

-- Also allow anon access for public reading (for landing page, etc.)
CREATE POLICY "Allow anon read" ON users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON posts FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON jobs FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update" ON users FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon insert" ON posts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert" ON jobs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert" ON comments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon read" ON comments FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON notifications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon read" ON notifications FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update" ON notifications FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon insert" ON chats FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon read" ON chats FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update" ON chats FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon insert" ON messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon read" ON messages FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert" ON hires FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon read" ON hires FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon update" ON hires FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anon update" ON posts FOR UPDATE TO anon USING (true);

-- ============================================
-- SEED DATA (from constants.ts)
-- ============================================
INSERT INTO users (id, email, name, username, role, avatar, bio, skill_tags, experience_level, rate_card, availability, following, followers, balance, reviews, created_at) VALUES
  ('user1', 'alex@creator.com', 'Alex Rivera', 'alex_edits', 'CREATOR', 'https://picsum.photos/seed/alex/200/200', 'Professional Video Editor | After Effects Wizard', ARRAY['Video Editing', 'Motion Graphics', 'Color Grading'], 'Senior', '{"hourly": 45, "project": 500}', true, '{}', '{}', 0, '[]', EXTRACT(EPOCH FROM NOW())::BIGINT * 1000),
  ('user2', 'sarah@startup.com', 'Sarah Chen', 'sarah_founder', 'HIRER', 'https://picsum.photos/seed/sarah/200/200', 'CEO at Lumina Tech', ARRAY['Tech', 'Design', 'AI'], NULL, NULL, false, '{}', '{}', 0, '[]', EXTRACT(EPOCH FROM NOW())::BIGINT * 1000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, creator_id, creator_name, creator_avatar, type, title, description, skill_tags, media_url, likes, saves, comment_count, timestamp) VALUES
  ('post1', 'user1', 'Alex Rivera', 'https://picsum.photos/seed/alex/200/200', 'video', 'Cyberpunk Aesthetic Edit', 'Exploration of neon vibes and glitch transitions for a music video project.', ARRAY['Motion Graphics', 'After Effects'], 'https://picsum.photos/seed/vfx/800/450', ARRAY['user2'], '{}', 12, (EXTRACT(EPOCH FROM NOW())::BIGINT * 1000) - 3600000),
  ('post2', 'user1', 'Alex Rivera', 'https://picsum.photos/seed/alex/200/200', 'image', 'Minimalist Branding Concept', 'Clean, bold identity for a modern architectural firm.', ARRAY['Graphic Design', 'Branding'], 'https://picsum.photos/seed/design/800/800', '{}', ARRAY['user2'], 5, (EXTRACT(EPOCH FROM NOW())::BIGINT * 1000) - 7200000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (id, hirer_id, hirer_name, title, description, required_skills, budget_range, timeline, status, timestamp) VALUES
  ('job1', 'user2', 'Sarah Chen', 'Short Form Video Editor Needed', 'Looking for someone to edit high-energy TikTok/Reels content for a tech brand.', ARRAY['Video Editing', 'Short Form Content'], '$500 - $1000', '2 weeks', 'open', EXTRACT(EPOCH FROM NOW())::BIGINT * 1000)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUPABASE STORAGE BUCKET
-- ============================================
-- Create a public bucket for file uploads (run this via Supabase dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('glint-uploads', 'glint-uploads', true)
-- ON CONFLICT DO NOTHING;
