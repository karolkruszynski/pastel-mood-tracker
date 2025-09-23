-- Add context_tags column to mood_entries table
ALTER TABLE public.mood_entries 
ADD COLUMN context_tags TEXT[] DEFAULT '{}';

-- Add index for better performance when querying by context tags
CREATE INDEX idx_mood_entries_context_tags ON public.mood_entries USING GIN(context_tags);