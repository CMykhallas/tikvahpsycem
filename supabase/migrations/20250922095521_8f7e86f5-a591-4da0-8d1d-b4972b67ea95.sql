-- Clean up test data from notes table for security
DELETE FROM public.notes WHERE title IN ('Test Note', 'Sample Note', 'Demo Note');