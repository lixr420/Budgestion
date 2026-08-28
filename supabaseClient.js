import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qsspclovkulrbrihonxw.supabase.co';
const supabaseKey = 'sb_publishable_guhFIN7yHfPGBY9Gitl1dw_cJR0hd4A';
const supabase = createClient(supabaseUrl, supabaseKey);
export { supabase };
