-- ================================================================
-- SUPABASE SETUP SCRIPT
-- Run this in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New Query → paste + run)
-- ================================================================

-- ── 1. Create Tables ──────────────────────────────────────────

-- Profile table (one row only)
CREATE TABLE IF NOT EXISTS profile (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text,
  bio        text,
  image_url  text,
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       text        NOT NULL,
  description text,
  image_url   text,
  created_at  timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text,
  email      text,
  message    text,
  created_at timestamptz DEFAULT now()
);


-- ── 2. Row-Level Security (RLS) ───────────────────────────────

ALTER TABLE Profile  ENABLE ROW LEVEL SECURITY;
ALTER TABLE Projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ── Profile policies ──────────────────────────────────────────
-- Public can read profile
CREATE POLICY "Public can read profile"
  ON profile FOR SELECT
  USING (true);

-- Only authenticated users (admin) can insert/update
CREATE POLICY "Auth users can upsert profile"
  ON profile FOR ALL
  USING (auth.role() = 'authenticated');

-- ── Projects policies ─────────────────────────────────────────
-- Public can read projects
CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  USING (true);

-- Only authenticated users can write
CREATE POLICY "Auth users can manage projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

-- ── Messages policies ─────────────────────────────────────────
-- Anyone can insert a message (contact form)
CREATE POLICY "Anyone can send messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read messages
CREATE POLICY "Auth users can read messages"
  ON messages FOR SELECT
  USING (auth.role() = 'authenticated');


-- ── 3. Storage Bucket ─────────────────────────────────────────
-- Run this in the SQL editor OR create via Dashboard → Storage

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read portfolio-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Allow authenticated uploads
CREATE POLICY "Auth upload to portfolio-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- Allow authenticated deletes
CREATE POLICY "Auth delete from portfolio-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

-- Allow authenticated updates (upsert)
CREATE POLICY "Auth update portfolio-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');


-- ── 4. Seed sample data (optional — delete if not needed) ──────

INSERT INTO profile (name, bio)
VALUES ('Alex Developer', 'Full-stack developer passionate about building beautiful, performant web apps.')
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description)
VALUES
  ('E-Commerce Platform', 'A modern shopping experience built with React, Node.js, and Stripe integration for seamless payments.'),
  ('Task Management App',  'Productivity tool with real-time collaboration, drag-and-drop boards, and team workspaces.'),
  ('Portfolio CMS',        'A headless CMS with a custom admin panel powered by Supabase for managing portfolio content.');
