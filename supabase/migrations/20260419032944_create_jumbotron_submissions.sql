/*
  # Jumbotron Submissions Table

  1. New Tables
    - `jumbotron_submissions`
      - `id` (uuid, primary key)
      - `team_id` (integer) — references the team that submitted
      - `team_name` (text) — team name for quick access
      - `team_color` (text) — team's brand color
      - `section`, `row`, `seat` (text) — fan's seat location
      - `clip_url` (text) — data URL or blob URL of photo/video
      - `clip_type` ('photo' or 'video') — capture type
      - `email` (text) — fan's email (optional, for follow-up)
      - `featured` (boolean) — flagged for jumbotron display
      - `featured_at` (timestamp) — when it was featured
      - `submitted_at` (timestamp) — submission time
      
  2. Security
    - Enable RLS on `jumbotron_submissions`
    - Public INSERT: anyone can submit (no auth required)
    - Public SELECT: anyone can read submissions (for ops dashboard)
    - UPDATE: only admins can feature/unfeatured clips
    
  3. Indexes
    - Index on `featured` and `submitted_at` for ops dashboard queries
    - Index on `team_id` for venue filtering

  4. Important Notes
    - Clips are stored as data URLs (base64 in database) — simple, no S3 needed
    - No user authentication required for submission — pure MVP mobility
    - Ops dashboard can filter by team and see real-time submissions
*/

CREATE TABLE IF NOT EXISTS jumbotron_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id integer NOT NULL,
  team_name text NOT NULL,
  team_color text NOT NULL,
  section text NOT NULL,
  row text NOT NULL,
  seat text NOT NULL,
  clip_url text NOT NULL,
  clip_type text NOT NULL CHECK (clip_type IN ('photo', 'video')),
  email text,
  featured boolean DEFAULT false,
  featured_at timestamptz,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE jumbotron_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert submissions"
  ON jumbotron_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view submissions"
  ON jumbotron_submissions FOR SELECT
  USING (true);

CREATE POLICY "No direct updates or deletes"
  ON jumbotron_submissions FOR UPDATE
  USING (false);

CREATE POLICY "No direct deletes"
  ON jumbotron_submissions FOR DELETE
  USING (false);

CREATE INDEX idx_featured_submitted
  ON jumbotron_submissions(featured DESC, submitted_at DESC);

CREATE INDEX idx_team_id
  ON jumbotron_submissions(team_id);
