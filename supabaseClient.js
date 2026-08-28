import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qsspclovkulrbrihonxw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzc3BjbG92a3VscmJyaWhvbnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MjI2MTUsImV4cCI6MjEwMzQ5ODYxNX0.7PjkJxEOKpMhYVIgG77sSiwFWgOayMfD4h7cRya3HfY';
const supabase = createClient(supabaseUrl, supabaseKey);
export { supabase };
