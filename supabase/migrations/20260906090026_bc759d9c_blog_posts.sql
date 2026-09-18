CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image_url text,
  author_name text NOT NULL DEFAULT 'Story Painters',
  author_role text NOT NULL DEFAULT 'Editorial Team',
  author_image_url text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  read_time text NOT NULL DEFAULT '5 min read',
  published boolean NOT NULL DEFAULT true,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Admins view all blog posts"
  ON public.blog_posts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage blog posts"
  ON public.blog_posts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_blog_posts_updated
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- chanding data
 INSERT INTO public.blog_posts (slug, title, category, excerpt, content, author_name, author_role, read_time, published, sort_order, published_at)
VALUES
('best-filming-locations-in-nepal','Best Filming Locations in Nepal for International Brands','Locations','From Kathmandu''s living heritage to Mustang''s high desert and the Annapurna ridges — a working location guide for commercial and brand productions.','Nepal packs an extraordinary range of landscapes into a small, accessible country. Within a single production week a crew can shoot medieval city squares, terraced farmland, alpine desert and jungle.
Kathmandu Valley gives you living heritage: Patan Durbar Square, Boudhanath, and narrow brick lanes that read instantly as South Asia.
Upper Mustang is a high-altitude desert of ochre cliffs and wind-carved caves — dramatic, otherworldly and ideal for endurance and adventure brands.
- Permits: most heritage sites and restricted areas require advance permits; plan 2-4 weeks ahead.
- Altitude: schedule acclimatisation days above 3,000m for crew and talent safety.
- Light: October to December offers the clearest skies and longest usable golden hour.
We handle scouting, permits, fixers and local crew so your team lands ready to shoot.','Digbijaya Bharati','Founder & Managing Director','8 min read',true,1,'2026-01-15'),
('how-to-shoot-a-commercial-video-in-nepal','How to Shoot a Commercial Video in Nepal','Production','Permits, crew, equipment, logistics and budget — a practical playbook for agencies producing TVCs and digital spots in Nepal.','Producing a commercial in Nepal is straightforward when the groundwork is done early. Here is the sequence we follow with international agencies.
Start with a locked creative and a location wish list. We convert it into a shootable schedule with travel times, permit lead times and weather windows.
Crew locally wherever possible. A Kathmandu-based camera, grip and lighting team knows the terrain, the power realities and the fastest route between setups.
- Permits: municipal, heritage and drone permissions are separate processes.
- Equipment: full cinema packages are available locally, which avoids carnet costs.
- Post: offline and colour can happen in Kathmandu or be shipped to your own house.
Budget honestly for contingency days — mountain weather is the single biggest schedule risk.','Digbijaya Bharati','Founder & Managing Director','10 min read',true,2,'2026-02-04'),
('why-nepal-is-powerful-for-documentary','Why Nepal is a Powerful Location for Documentary Filmmaking','Documentary','Geography, story density, access and a generation of local filmmakers — why Nepal is one of the most underrated documentary stages in Asia.','Few places offer this much story per square kilometre. Climate change, migration, faith, conservation and rapid urbanisation all play out visibly here.
Access is the real advantage. Communities are open, distances are short and local producers can build trust quickly on your behalf.
- Subject areas: mountaineering, conservation, women in trade, heritage craft, climate.
- Language: our team works in Nepali, Newari and English, with translation built into the workflow.
- Ethics: we insist on informed consent and fair compensation for contributors.
The result is documentary work that feels lived-in rather than parachuted-in.','Digbijaya Bharati','Founder & Managing Director','6 min read',true,3,'2026-03-11'),
('cost-of-video-production-in-nepal','Cost of Video Production in Nepal','Budget','An honest breakdown of day-rates, kit, fixers, drone, travel and post for both local and international productions.','Nepal is cost-efficient without being cheap. Here is a transparent view of where money goes on a typical shoot.
Crew day rates cover camera, lighting, grip, sound and production support. Local hires cost a fraction of flying a full team in.
Equipment is the next line. A cinema camera package, lenses, lighting and grip can all be rented locally on day or week rates.
- Logistics: domestic flights, jeeps and porters for remote locations.
- Permits and fixers: essential and usually underestimated.
- Post: edit, colour, sound design and delivery masters.
We quote fixed-scope budgets so there are no surprises after wrap.','Digbijaya Bharati','Founder & Managing Director','7 min read',true,4,'2026-04-22'),
('working-with-a-nepal-production-company','How International Brands Can Work with a Nepal-based Production Company','Working with us','From first email to deliverables — the working model, communication cadence and contract structure that keeps cross-border shoots on track.','Cross-border production works when responsibilities are explicit from day one.
We typically act as the production service company: you bring creative and direction, we bring crew, kit, permits, locations and on-ground problem solving.
Communication runs on a fixed cadence — a weekly call in prep, daily notes during the shoot, and same-day rushes uploaded for review.
- Contracts: scope, deliverables, overtime and contingency defined up front.
- Payments: staged against prep, shoot and delivery milestones.
- Insurance: production and equipment cover arranged locally.
Send us a brief and we will return a schedule and budget within a few working days.','Digbijaya Bharati','Founder & Managing Director','9 min read',true,5,'2026-05-30')
ON CONFLICT (slug) DO NOTHING;