import { createClient } from '@supabase/supabase-js';

export type ExerciseRow = {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  bg_gradient: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string | null;
  duration_mins: number;
  muscle_groups: string;
  reps_target: number;
  difficulty: string;
  bg_theme: string;
  image_url: string;
  link: string;
  type: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type ApkRow = {
  link: string;
};

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
