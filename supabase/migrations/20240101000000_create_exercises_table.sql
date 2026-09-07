create table public.exercises (
  id text primary key,
  name text not null,
  category text,
  icon text,
  description text,
  bg_gradient text,
  is_active boolean default true,
  display_order bigint,
  created_at timestamptz default now(),
  updated_at timestamptz,
  duration_mins bigint,
  muscle_groups text,
  reps_target bigint,
  difficulty text,
  bg_theme text,
  image_url text,
  type text
);

create policy "exercises are publicly readable"
  on public.exercises for select
  using (true);

insert into public.exercises
  (id, name, category, icon, description, bg_gradient, is_active, display_order, duration_mins, muscle_groups, reps_target, difficulty, bg_theme, image_url, type)
values
  ('1', 'Squats', 'strength', '🏋️', 'AI Real-time MediaPipe Pose Tracker for Parallel Depth & Rep Counting', '#C8B6FF', true, 1, 25, 'Glutes / Quads / Hamstrings', 15, 'Intermediate', '#C8B6FF', 'https://locsjrjekkyjbeapgreu.supabase.co/storage/v1/object/public/Images/Excercise/a-guy-doing-squats.svg', 'Common exercises'),
  ('2', 'Sit-ups', 'strength', '💪', 'Full torso elevation & hip flexion complete core tracker', '#C8B6FF', true, 5, 20, 'Abdominals / Hip Flexors / Core', 15, 'Intermediate', '#C8B6FF', 'https://locsjrjekkyjbeapgreu.supabase.co/storage/v1/object/public/Images/Excercise/a-guy-doing-situps.png', 'Common exercises'),
  ('3', 'Triangle Pose', 'flexibility', '📐', 'AI Real-time Trikonasana Pose Tracker for Leg Extension, Lateral Hinge & Hold Time', '#A7F3D0', true, 2, 20, 'Hamstrings / Groin / Hips / Core', 10, 'Beginner', '#A7F3D0', 'https://locsjrjekkyjbeapgreu.supabase.co/storage/v1/object/public/Images/Excercise/a-female-doing-yoga.svg', 'Yoga'),
  ('4', 'Lunges', 'strength', '🦵', 'Unilateral lead-leg tracking, knee angle depth & balance analyzer', '#FFD6E0', true, 3, 22, 'Quads / Glutes / Calves', 16, 'Intermediate', '#FFD6E0', 'https://locsjrjekkyjbeapgreu.supabase.co/storage/v1/object/public/Images/Excercise/a-guy-doing-lunges.svg', 'Common exercises'),
  ('5', 'Crunches', 'flexibility', '🧘', 'Abdominal flexion & shoulder blade elevation core tracker', '#E2F163', true, 4, 18, 'Upper Abs / Core / Obliques', 20, 'Beginner', '#E2F163', 'https://locsjrjekkyjbeapgreu.supabase.co/storage/v1/object/public/Images/Excercise/a-guy-doing-crunches.svg', 'Common exercises'),
  ('6', 'Cobra Pose', 'flexibility', '🐍', 'AI Real-time Bhujangasana Pose Tracker for Pelvis Grounding, Chest Elevation & Spine Flexibility', '#A7F3D0', true, 6, 15, 'Spine Extensors / Chest / Shoulders / Abdominals', 10, 'Beginner', '#A7F3D0', 'https://locsjrjekkyjbeapgreu.supabase.co/storage/v1/object/public/Images/Excercise/a_guy_doing_cobra_pose.png', 'Yoga'),
  ('7', 'Push-ups', 'strength', '🤸', 'AI Real-time Push-up Depth, Elbow Flexion & Plank Alignment Rep Tracker', '#FFD6E0', true, 7, 20, 'Chest / Triceps / Shoulders / Core', 15, 'Intermediate', '#FFD6E0', 'https://locsjrjekkyjbeapgreu.supabase.co/storage/v1/object/public/Images/Excercise/a-guy-doing-pushups.png', 'Common exercises');
