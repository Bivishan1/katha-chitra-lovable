DROP VIEW public.equipment_items_public;

CREATE VIEW public.equipment_items_public
WITH (security_invoker = on) AS
SELECT id, category_id, name, note, sort_order FROM public.equipment_items;

-- Column-level access: anon/authenticated may read everything EXCEPT prices
GRANT SELECT (id, category_id, name, note, sort_order) ON public.equipment_items TO anon;
GRANT SELECT ON public.equipment_items_public TO anon, authenticated;

CREATE POLICY "Public can view equipment items without prices"
ON public.equipment_items FOR SELECT TO anon USING (true);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;