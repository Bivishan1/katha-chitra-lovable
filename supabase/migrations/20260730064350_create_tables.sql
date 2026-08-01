-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles" ON public.user_roles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- EQUIPMENT CATEGORIES
CREATE TABLE public.equipment_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.equipment_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipment_categories TO authenticated;
GRANT ALL ON public.equipment_categories TO service_role;
ALTER TABLE public.equipment_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view categories" ON public.equipment_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.equipment_categories FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_equipment_categories_updated BEFORE UPDATE ON public.equipment_categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- EQUIPMENT ITEMS (prices admin-only)
CREATE TABLE public.equipment_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.equipment_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  note text,
  price_day numeric NOT NULL DEFAULT 0,
  price_week numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipment_items TO authenticated;
GRANT ALL ON public.equipment_items TO service_role;
ALTER TABLE public.equipment_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage items" ON public.equipment_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_equipment_items_updated BEFORE UPDATE ON public.equipment_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE VIEW public.equipment_items_public
WITH (security_invoker = off) AS
SELECT id, category_id, name, note, sort_order FROM public.equipment_items;
GRANT SELECT ON public.equipment_items_public TO anon, authenticated;

-- FRAMES
CREATE TABLE public.frames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  image_url text,
  video_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.frames TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.frames TO authenticated;
GRANT ALL ON public.frames TO service_role;
ALTER TABLE public.frames ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published frames" ON public.frames FOR SELECT USING (published = true);
CREATE POLICY "Admins view all frames" ON public.frames FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage frames" ON public.frames FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_frames_updated BEFORE UPDATE ON public.frames
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PROJECTS
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Commercial',
  year integer NOT NULL DEFAULT date_part('year', now())::int,
  image_url text,
  video_url text,
  aspect text NOT NULL DEFAULT 'wide',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (published = true);
CREATE POLICY "Admins view all projects" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PROPOSALS
CREATE TABLE public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.proposals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposals TO authenticated;
GRANT ALL ON public.proposals TO service_role;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active proposals" ON public.proposals FOR SELECT USING (is_active = true);
CREATE POLICY "Admins view all proposals" ON public.proposals FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage proposals" ON public.proposals FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_proposals_updated BEFORE UPDATE ON public.proposals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CONTACT DETAILS
CREATE TABLE public.contact_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_singleton boolean NOT NULL DEFAULT true UNIQUE,
  company_name text NOT NULL DEFAULT 'Katha Chitra',
  address text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  secondary_email text,
  phone text NOT NULL DEFAULT '',
  whatsapp text,
  booking_url text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_details TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_details TO authenticated;
GRANT ALL ON public.contact_details TO service_role;
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view contact details" ON public.contact_details FOR SELECT USING (true);
CREATE POLICY "Admins manage contact details" ON public.contact_details FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_contact_details_updated BEFORE UPDATE ON public.contact_details
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SOCIAL LINKS
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  handle text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins manage social links" ON public.social_links FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_social_links_updated BEFORE UPDATE ON public.social_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- STORAGE POLICIES
CREATE POLICY "Public can read cms media" ON storage.objects
FOR SELECT USING (bucket_id = 'cms-media');
CREATE POLICY "Admins upload cms media" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update cms media" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete cms media" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

-- SEED
INSERT INTO public.contact_details (address, email, phone, whatsapp, booking_url)
VALUES ('Lalitpur, Kathmandu Valley, Nepal', 'kathachitra5@gmail.com', '+977 98XXXXXXXX', '+977 98XXXXXXXX', 'https://calendar.app.google/');

INSERT INTO public.social_links (platform, url, handle, sort_order) VALUES
('Instagram', 'https://www.instagram.com/kathachitra', '@kathachitra', 1),
('YouTube', 'https://www.youtube.com/@kathachitra', '@kathachitra', 2),
('Facebook', 'https://www.facebook.com/kathachitra', 'Katha Chitra', 3);

INSERT INTO public.projects (slug, title, client, category, year, video_url, aspect, sort_order) VALUES
('yak-chew-supply','Yak Chew Supply','Yak Chew Supply Co.','Documentary',2024,'https://www.youtube.com/watch?v=w9cvhcLk1i4&t=156s','wide',1),
('bagi-raheko-aasha','Bagi Raheko Aasha','CREASION (NGO)','Documentary',2024,'https://www.youtube.com/watch?v=inmFjJUXjqs','wide',2),
('the-speaking-titan','The Speaking Titan','Ambition Guru / Daami Media','Branded',2024,'https://www.youtube.com/watch?v=p0zsbO71ExM','wide',3),
('prakash-saput-music-video','Music Video w/ Prakash Saput','Prakash Saput','Music Video',2024,'https://www.youtube.com/watch?v=B0Nts5ARrOs','portrait',4),
('desh-chhodeko-larko','Desh Chhodeko Larko','Surakshya Panta','Music Video',2024,'https://www.youtube.com/watch?v=Uq3lHHmmRvI','wide',5),
('npl-official-anthem','NPL Official Anthem','Nepal Premier League','Commercial',2024,'https://www.youtube.com/watch?v=-LRG342jBv4','wide',6),
('banke-rastriya-nikunja','Banke Rastriya Nikunja','Documentary Series','Documentary',2023,'https://www.youtube.com/watch?v=cD5gEf-n7T0&t=291s','portrait',7),
('cocacola-commercial','Coca-Cola Commercial','Coca-Cola','Commercial',2023,'https://www.youtube.com/results?search_query=coca+cola+nepal+commercial','portrait',8),
('five-fifty-five','5:55 Official Music Video','5:55','Music Video',2023,'https://www.youtube.com/results?search_query=5%3A55+official+music+video','portrait',9),
('dipendra-khanal-film','Film Shoot w/ Dipendra K. Khanal','Dipendra K. Khanal','Branded',2024,'https://www.youtube.com/@kathachitra','wide',10);

INSERT INTO public.equipment_categories (name, description, sort_order) VALUES
('Cinema Cameras','Sony FX-series, RED Komodo, Blackmagic URSA and mirrorless A-cams — ready with media, batteries and accessories.',1),
('Lenses','Cine primes and zooms, vintage glass and fast stills lenses — PL, E and EF mounts with full mount-swap support.',2),
('Lighting','Aputure, Nanlux and Arri-grade fixtures with full modifier packages, stands and distro.',3),
('Grip & Support','Tripods, sliders, gimbals, jibs and dollies — including stabilized vehicle and aerial-ready mounts.',4),
('Sound','Production sound packages with wireless lavs, boom kits and on-set mixers — recordists available on request.',5),
('Drones & Aerial','CAAN-licensed drone operators with insured rigs, FPV cinema drones and high-altitude packages.',6);

INSERT INTO public.equipment_items (category_id, name, price_day, price_week, sort_order)
SELECT c.id, v.name, v.d, v.w, v.o FROM public.equipment_categories c
JOIN (VALUES
 ('Cinema Cameras','Sony FX6',18000,95000,1),
 ('Cinema Cameras','Sony FX3',12000,65000,2),
 ('Cinema Cameras','RED Komodo 6K',25000,135000,3),
 ('Cinema Cameras','Blackmagic URSA / Pocket 6K',9000,48000,4),
 ('Cinema Cameras','Sony A7S III / A7 IV',6500,34000,5),
 ('Lenses','Sigma Cine FF prime set (5)',15000,80000,1),
 ('Lenses','DZOFilm Vespid set (7)',12000,65000,2),
 ('Lenses','Canon CN-E prime (each)',3500,18000,3),
 ('Lenses','Sony G Master zoom (each)',3000,16000,4),
 ('Lighting','Aputure 600x',4500,24000,1),
 ('Lighting','Aputure 300x',2800,15000,2),
 ('Lighting','Nanlux Evoke 1200',6500,34000,3),
 ('Lighting','Astera Titan tube (each)',1800,9500,4),
 ('Lighting','HMI 1.2K kit',8000,42000,5),
 ('Lighting','HMI 2.5K kit',12000,65000,6),
 ('Grip & Support','DJI Ronin 4D',12000,65000,1),
 ('Grip & Support','DJI RS3 Pro',3500,18000,2),
 ('Grip & Support','O''Connor / Sachtler head + sticks',4500,24000,3),
 ('Grip & Support','Slider package (1m)',2500,13000,4),
 ('Grip & Support','Jib package (up to 3m)',6000,32000,5),
 ('Grip & Support','Easy-rig / shoulder rig',2000,10500,6),
 ('Sound','Sennheiser MKH 416 + boom kit',3500,18000,1),
 ('Sound','Wisycom wireless (2ch)',5500,29000,2),
 ('Sound','Sennheiser G4 wireless (each)',1500,8000,3),
 ('Sound','Sound Devices MixPre-6 II',4500,24000,4),
 ('Sound','Comtek IFB (4 rx)',2500,13000,5),
 ('Drones & Aerial','DJI Inspire 3 + pilot',45000,240000,1),
 ('Drones & Aerial','DJI Mavic 3 Cine + pilot',15000,80000,2),
 ('Drones & Aerial','FPV cinema drone + pilot',25000,135000,3)
) AS v(cat,name,d,w,o) ON v.cat = c.name;