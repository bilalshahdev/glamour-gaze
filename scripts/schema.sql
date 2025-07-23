-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table for additional profile information
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  age integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on our custom tables
alter table public.users enable row level security;

-- Makeup presets table
create table if not exists public.makeup_presets (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null, -- 'lips', 'eyes', 'cheeks', 'eyebrows', 'hair'
  color text not null, -- hex color code
  opacity real default 0.7,
  blend_mode text default 'multiply',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.makeup_presets enable row level security;

-- User makeup trials table
create table if not exists public.makeup_trials (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  image_url text,
  makeup_config jsonb not null, -- stores the makeup configuration
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.makeup_trials enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

create policy "Anyone can view makeup presets" on public.makeup_presets
  for select to authenticated;

create policy "Users can view own trials" on public.makeup_trials
  for select using (auth.uid() = user_id);

create policy "Users can insert own trials" on public.makeup_trials
  for insert with check (auth.uid() = user_id);

create policy "Users can update own trials" on public.makeup_trials
  for update using (auth.uid() = user_id);

create policy "Users can delete own trials" on public.makeup_trials
  for delete using (auth.uid() = user_id);

-- Insert default makeup presets (only if they don't exist)
insert into public.makeup_presets (name, category, color, opacity, blend_mode) 
select * from (values
  -- Lipstick colors
  ('Classic Red', 'lips', '#DC143C', 0.8, 'multiply'),
  ('Pink Blush', 'lips', '#FF69B4', 0.7, 'multiply'),
  ('Berry Bold', 'lips', '#8B0000', 0.9, 'multiply'),
  ('Coral Kiss', 'lips', '#FF7F50', 0.7, 'multiply'),
  ('Nude Rose', 'lips', '#D2691E', 0.6, 'multiply'),
  
  -- Eyeshadow colors
  ('Smoky Gray', 'eyes', '#696969', 0.6, 'multiply'),
  ('Golden Glow', 'eyes', '#FFD700', 0.5, 'overlay'),
  ('Purple Haze', 'eyes', '#9370DB', 0.7, 'multiply'),
  ('Bronze Beauty', 'eyes', '#CD7F32', 0.6, 'multiply'),
  ('Rose Gold', 'eyes', '#E8B4B8', 0.5, 'overlay'),
  
  -- Blush colors
  ('Peach Glow', 'cheeks', '#FFCBA4', 0.5, 'overlay'),
  ('Rose Petal', 'cheeks', '#FF91A4', 0.6, 'multiply'),
  ('Coral Flush', 'cheeks', '#FF6B6B', 0.5, 'multiply'),
  ('Berry Blush', 'cheeks', '#C44569', 0.6, 'multiply'),
  
  -- Hair colors
  ('Chocolate Brown', 'hair', '#3C2415', 0.8, 'multiply'),
  ('Honey Blonde', 'hair', '#DAA520', 0.7, 'overlay'),
  ('Auburn Red', 'hair', '#A0522D', 0.8, 'multiply'),
  ('Platinum Blonde', 'hair', '#E6E6FA', 0.6, 'overlay'),
  ('Raven Black', 'hair', '#000000', 0.9, 'multiply')
) as v(name, category, color, opacity, blend_mode)
where not exists (
  select 1 from public.makeup_presets where makeup_presets.name = v.name
);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, age)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    (new.raw_user_meta_data->>'age')::integer
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create user profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
