-- Add missing thumbnail_id column if not exists
ALTER TABLE public.emoticon_sets
  ADD COLUMN IF NOT EXISTS thumbnail_id text;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
