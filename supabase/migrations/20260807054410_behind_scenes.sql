CREATE TABLE public.bts_frames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caption text NOT NULL DEFAULT '',
  alt text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.bts_frames TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bts_frames TO authenticated;
GRANT ALL ON public.bts_frames TO service_role;

ALTER TABLE public.bts_frames ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published bts frames" ON public.bts_frames
FOR SELECT USING (published = true);

CREATE POLICY "Admins view all bts frames" ON public.bts_frames
FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage bts frames" ON public.bts_frames
FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_bts_frames_updated BEFORE UPDATE ON public.bts_frames
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.bts_frames (caption, alt, image_url, sort_order, published) VALUES
('On set — Kathmandu', 'Camera operators silhouetted against copper sunset on a Kathmandu set', NULL, 1, true),
('Monitor check', 'Cinematographers reviewing footage on a field monitor in a neon-lit alley', NULL, 2, true),
('Mustang recce', 'Crew scouting a high-altitude location in Mustang', NULL, 3, true),
('Documentary shoot', 'Director and sound recordist during a documentary interview setup', NULL, 4, true);