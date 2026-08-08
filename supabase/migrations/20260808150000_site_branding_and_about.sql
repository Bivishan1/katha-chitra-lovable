-- Logo on site_settings
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS logo_url text;

-- Per-page SEO titles and descriptions
CREATE TABLE IF NOT EXISTS public.page_meta (
  slug text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  og_title text,
  og_description text,
  canonical_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.page_meta TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_meta TO authenticated;
GRANT ALL ON public.page_meta TO service_role;

ALTER TABLE public.page_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Page meta is publicly readable"
  ON public.page_meta FOR SELECT USING (true);

CREATE POLICY "Admins manage page meta"
  ON public.page_meta FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_page_meta_updated_at
  BEFORE UPDATE ON public.page_meta
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Founder profile (singleton)
CREATE TABLE IF NOT EXISTS public.founder_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_singleton boolean NOT NULL DEFAULT true UNIQUE,
  name text NOT NULL DEFAULT '',
  name_accent text,
  role text NOT NULL DEFAULT '',
  bio_primary text NOT NULL DEFAULT '',
  bio_secondary text NOT NULL DEFAULT '',
  image_url text,
  image_alt text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.founder_profile TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.founder_profile TO authenticated;
GRANT ALL ON public.founder_profile TO service_role;

ALTER TABLE public.founder_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founder profile is publicly readable"
  ON public.founder_profile FOR SELECT USING (true);

CREATE POLICY "Admins manage founder profile"
  ON public.founder_profile FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_founder_profile_updated_at
  BEFORE UPDATE ON public.founder_profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Team members
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published team members are publicly readable"
  ON public.team_members FOR SELECT USING (published = true);

CREATE POLICY "Admins view all team members"
  ON public.team_members FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage team members"
  ON public.team_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.page_meta;
ALTER PUBLICATION supabase_realtime ADD TABLE public.founder_profile;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;

-- Seed page titles (current hardcoded values)
INSERT INTO public.page_meta (slug, title, description, og_title, og_description, canonical_path) VALUES
  ('home', 'Katha Chitra Production — Nepali Video Production House', 'Nepal Kathmandu-based film and media production company crafting commercials, branded content, music videos, documentaries, and digital campaigns.', 'Katha Chitra — Nepali Video Production House', 'Cinematic storytelling from the heart of the Himalayas Nepal.', '/'),
  ('about', 'About — Katha Chitra', 'Katha Chitra is a Kathmandu-based production house blending cinematic craft with cultural depth.', 'About — Katha Chitra', 'Inside the studio. Cinematic storytelling from the Himalayas.', '/about'),
  ('work', 'Work — Katha Chitra', 'Selected films, commercials and branded content from Katha Chitra.', 'Work — Katha Chitra', 'Portfolio of cinematic work from Kathmandu.', '/work'),
  ('services', 'Services — Katha Chitra', 'Commercial production, branded content, music videos, documentaries and post-production in Nepal.', 'Services — Katha Chitra', 'Full-service film and media production in Kathmandu.', '/services'),
  ('contact', 'Contact — Katha Chitra', 'Get in touch with Katha Chitra for production enquiries, rentals and collaborations.', 'Contact — Katha Chitra', 'Reach the Katha Chitra team in Kathmandu.', '/contact'),
  ('rental-equipment', 'Equipment Rentals — Katha Chitra', 'Rent cinema cameras, lenses, lighting, grip, sound and drones from Katha Chitra in Kathmandu.', 'Equipment Rentals — Katha Chitra', 'Professional production gear available for daily and weekly rental in Nepal.', '/rental-equipment'),
  ('international_support', 'International Production Support — Katha Chitra', 'Fixer, location scouting and production support for international crews filming in Nepal.', 'International Production Support — Katha Chitra', 'On-the-ground production support for international teams in Nepal.', '/international_support')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.founder_profile (name, name_accent, role, bio_primary, bio_secondary, image_alt)
SELECT
  'Saugat',
  'Dhital',
  'Founder & Creative Director',
  'A decade behind the lens — from independent documentary work across Mustang and Humla to broadcast commercials for South Asian brands.',
  'Leads a senior bench of cinematographers, producers, sound designers and colorists. Every project is touched by people who have shipped hundreds of hours of work, not interns chasing a portfolio.',
  'Saugat Dhital, founder and creative director of Katha Chitra'
WHERE NOT EXISTS (SELECT 1 FROM public.founder_profile);

INSERT INTO public.team_members (name, role, sort_order)
SELECT v.name, v.role, v.sort_order
FROM (VALUES
  ('Pranisha Karki', 'Head of Production', 1),
  ('Bibek Lama', 'Director of Photography', 2),
  ('Mira Tamang', 'Editor & Colorist', 3),
  ('Sujan Rai', 'Sound Designer', 4)
) AS v(name, role, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.team_members);
