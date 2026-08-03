CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  show_equipment_prices boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are publicly readable"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (show_equipment_prices)
SELECT false WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

CREATE OR REPLACE FUNCTION public.equipment_prices_public()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT show_equipment_prices FROM public.site_settings LIMIT 1), false)
$$;

DROP VIEW IF EXISTS public.equipment_items_public;
CREATE VIEW public.equipment_items_public
WITH (security_invoker = false) AS
SELECT
  i.id,
  i.category_id,
  i.name,
  i.note,
  i.sort_order,
  CASE WHEN public.equipment_prices_public() THEN i.price_day END AS price_day,
  CASE WHEN public.equipment_prices_public() THEN i.price_week END AS price_week
FROM public.equipment_items i;

GRANT SELECT ON public.equipment_items_public TO anon, authenticated;
GRANT ALL ON public.equipment_items_public TO service_role;

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.equipment_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.equipment_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.frames;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_details;
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_links;