-- Seed file for the public.frames table.
-- Run this once in your local Supabase database to populate the highlight frames
-- that appear on the homepage and the Work page.
--
-- Options:
-- 1. Supabase Studio SQL Editor: paste the whole file and click Run. (i will use this, LOL)
-- 2. Supabase CLI: npx supabase db query --file supabase/seed-frames.sql (most run docker in the background, so not going to use)

INSERT INTO public.frames (title, subtitle, image_url, video_url, sort_order, published) VALUES
  ('Yak Chew Supply', 'Documentary', NULL, 'https://www.youtube.com/watch?v=w9cvhcLk1i4&t=156s', 1, true),
  ('Bagi Raheko Aasha', 'Documentary', NULL, 'https://www.youtube.com/watch?v=inmFjJUXjqs', 2, true),
  ('The Speaking Titan', 'Branded', NULL, 'https://www.youtube.com/watch?v=p0zsbO71ExM', 3, true),
  ('Music Video w/ Prakash Saput', 'Music Video', NULL, 'https://www.youtube.com/watch?v=B0Nts5ARrOs', 4, true),
  ('Desh Chhodeko Larko', 'Music Video', NULL, 'https://www.youtube.com/watch?v=Uq3lHHmmRvI', 5, true),
  ('NPL Official Anthem', 'Commercial', NULL, 'https://www.youtube.com/watch?v=-LRG342jBv4', 6, true),
  ('Banke Rastriya Nikunja', 'Documentary', NULL, 'https://www.youtube.com/watch?v=cD5gEf-n7T0&t=291s', 7, true),
  ('Coca-Cola Commercial', 'Commercial', NULL, 'https://www.youtube.com/results?search_query=coca+cola+nepal+commercial', 8, true),
  ('5:55 Official Music Video', 'Music Video', NULL, 'https://www.youtube.com/results?search_query=5%3A55+official+music+video', 9, true),
  ('Film Shoot w/ Dipendra K. Khanal', 'Branded', NULL, 'https://www.youtube.com/@kathachitra', 10, true);