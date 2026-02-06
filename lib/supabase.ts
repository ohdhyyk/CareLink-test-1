import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tflkkjuixvegggsfndby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbGtranVpeHZlZ2dnc2ZuZGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyODE3MDQsImV4cCI6MjA4NTg1NzcwNH0.j_leyT9i0Hc1Il0of7UpQq12GLfRT-R59hVoFES2yWQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);