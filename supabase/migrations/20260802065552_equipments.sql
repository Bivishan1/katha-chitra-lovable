DROP VIEW IF EXISTS public.equipment_items_public;
DROP FUNCTION IF EXISTS public.equipment_prices_public();

CREATE VIEW public.equipment_items_public AS
SELECT
  i.id,
  i.category_id,
  i.name,
  i.note,
  i.sort_order,
  CASE WHEN COALESCE((SELECT s.show_equipment_prices FROM public.site_settings s LIMIT 1), false)
       THEN i.price_day END AS price_day,
  CASE WHEN COALESCE((SELECT s.show_equipment_prices FROM public.site_settings s LIMIT 1), false)
       THEN i.price_week END AS price_week
FROM public.equipment_items i;

GRANT SELECT ON public.equipment_items_public TO anon, authenticated;
GRANT ALL ON public.equipment_items_public TO service_role;