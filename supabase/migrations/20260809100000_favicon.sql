-- Add a CMS-managed favicon to the existing site_settings row.
-- No RLS/grant/trigger changes needed here: the policies, grants, and
-- updated_at trigger already on public.site_settings apply to every
-- column, including this new one.
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS favicon_url text;