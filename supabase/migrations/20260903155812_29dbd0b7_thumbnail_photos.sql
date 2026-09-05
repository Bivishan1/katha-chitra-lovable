ALTER TABLE public.equipment_items
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sub_items jsonb NOT NULL DEFAULT '[]'::jsonb;

DROP VIEW IF EXISTS public.equipment_items_public;
CREATE VIEW public.equipment_items_public
WITH (security_invoker = true) AS
SELECT id,
  category_id,
  name,
  note,
  image_url,
  description,
  images,
  sub_items,
  sort_order,
  CASE WHEN COALESCE((SELECT s.show_equipment_prices FROM site_settings s LIMIT 1), false)
    THEN price_day ELSE NULL::numeric END AS price_day,
  CASE WHEN COALESCE((SELECT s.show_equipment_prices FROM site_settings s LIMIT 1), false)
    THEN price_week ELSE NULL::numeric END AS price_week
FROM equipment_items i;

GRANT SELECT ON public.equipment_items_public TO anon, authenticated;
GRANT ALL ON public.equipment_items_public TO service_role;