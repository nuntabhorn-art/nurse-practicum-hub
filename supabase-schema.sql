-- Nurse Practicum Hub - Supabase foundation schema
-- Run this file in Supabase SQL Editor after creating a project.

create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'teacher', 'admin');
create type public.work_status as enum ('submitted', 'reviewing', 'passed', 'needs_revision');
create type public.attendance_status as enum ('on_time', 'late', 'sick', 'personal_leave', 'absent');
create type public.skill_result as enum ('passed', 'needs_practice', 'not_assessed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.app_role not null default 'student',
  student_code text unique,
  cohort text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cohort text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  name text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  primary key (team_id, student_id)
);

create table public.attendance_settings (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  location_name text not null,
  latitude numeric(10, 7) not null,
  longitude numeric(10, 7) not null,
  radius_m integer not null default 100 check (radius_m between 10 and 5000),
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  status public.attendance_status not null,
  checkin_at timestamptz not null default now(),
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  distance_m numeric(10, 2),
  evidence_path text,
  created_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.skill_evaluations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  evaluator_id uuid not null references public.profiles(id) on delete restrict,
  result public.skill_result not null default 'not_assessed',
  experience_note text,
  feedback text,
  evaluated_at timestamptz not null default now()
);

create table public.daily_works (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  description text,
  file_url text,
  status public.work_status not null default 'submitted',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_grades (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.daily_works(id) on delete cascade,
  grader_id uuid not null references public.profiles(id) on delete restrict,
  score numeric(5, 2) check (score between 0 and 100),
  feedback text,
  created_at timestamptz not null default now()
);

create table public.exam_questions (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  question text not null,
  choices jsonb not null,
  answer text not null,
  explanation text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.exam_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  score numeric(5, 2) not null check (score between 0 and 100),
  earned_exp integer not null default 0,
  earned_coins integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.hero_scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  awarded_by uuid not null references public.profiles(id) on delete restrict,
  points integer not null check (points between -1000 and 1000),
  reason text,
  created_at timestamptz not null default now()
);

create table public.pet_progress (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  exp integer not null default 0 check (exp >= 0),
  coins integer not null default 0 check (coins >= 0),
  level integer not null default 1 check (level >= 1),
  updated_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.profiles
  where id = auth.uid() and role in ('teacher', 'admin') and is_active
) $$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.profiles
  where id = auth.uid() and role = 'admin' and is_active
) $$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.attendance_settings enable row level security;
alter table public.attendance enable row level security;
alter table public.skills enable row level security;
alter table public.skill_evaluations enable row level security;
alter table public.daily_works enable row level security;
alter table public.work_grades enable row level security;
alter table public.exam_questions enable row level security;
alter table public.exam_results enable row level security;
alter table public.hero_scores enable row level security;
alter table public.pet_progress enable row level security;
alter table public.activity_logs enable row level security;

create policy "profiles: self or staff read" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "profiles: admin manage" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "courses: authenticated read" on public.courses for select to authenticated using (is_active or public.is_staff());
create policy "courses: staff manage" on public.courses for all using (public.is_staff()) with check (public.is_staff());

create policy "teams: authenticated read" on public.teams for select to authenticated using (true);
create policy "teams: staff manage" on public.teams for all using (public.is_staff()) with check (public.is_staff());
create policy "team_members: authenticated read" on public.team_members for select to authenticated using (true);
create policy "team_members: staff manage" on public.team_members for all using (public.is_staff()) with check (public.is_staff());

create policy "attendance: self or staff read" on public.attendance for select using (student_id = auth.uid() or public.is_staff());
create policy "attendance: self create" on public.attendance for insert with check (student_id = auth.uid() or public.is_staff());
create policy "attendance settings: authenticated read" on public.attendance_settings for select to authenticated using (is_active or public.is_staff());
create policy "attendance settings: staff manage" on public.attendance_settings for all using (public.is_staff()) with check (public.is_staff());

create policy "skills: authenticated read" on public.skills for select to authenticated using (is_active or public.is_staff());
create policy "skills: staff manage" on public.skills for all using (public.is_staff()) with check (public.is_staff());
create policy "evaluations: self or staff read" on public.skill_evaluations for select using (student_id = auth.uid() or public.is_staff());
create policy "evaluations: staff manage" on public.skill_evaluations for all using (public.is_staff()) with check (public.is_staff());

create policy "works: self or staff read" on public.daily_works for select using (student_id = auth.uid() or public.is_staff());
create policy "works: self create/update" on public.daily_works for insert with check (student_id = auth.uid());
create policy "works: self update" on public.daily_works for update using (student_id = auth.uid() and status in ('submitted', 'needs_revision')) with check (student_id = auth.uid());
create policy "works: staff manage" on public.daily_works for all using (public.is_staff()) with check (public.is_staff());
create policy "grades: student or staff read" on public.work_grades for select using (public.is_staff() or exists (select 1 from public.daily_works w where w.id = work_id and w.student_id = auth.uid()));
create policy "grades: staff manage" on public.work_grades for all using (public.is_staff()) with check (public.is_staff());

create policy "questions: authenticated read" on public.exam_questions for select to authenticated using (is_active or public.is_staff());
create policy "questions: staff manage" on public.exam_questions for all using (public.is_staff()) with check (public.is_staff());
create policy "results: self or staff read" on public.exam_results for select using (student_id = auth.uid() or public.is_staff());
create policy "results: self create" on public.exam_results for insert with check (student_id = auth.uid());
create policy "hero: self or staff read" on public.hero_scores for select using (student_id = auth.uid() or public.is_staff());
create policy "hero: staff create" on public.hero_scores for insert with check (public.is_staff() and awarded_by = auth.uid());
create policy "pet: self or staff read" on public.pet_progress for select using (student_id = auth.uid() or public.is_staff());
-- Pet EXP/coins/level must only be changed by trusted server-side functions.
create policy "logs: staff read" on public.activity_logs for select using (public.is_staff());
create policy "logs: authenticated create" on public.activity_logs for insert with check (actor_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.student_code := old.student_code;
    new.is_active := old.is_active;
    new.email := old.email;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields
  before update on public.profiles
  for each row execute procedure public.protect_profile_fields();

create policy "profiles: self update safe fields" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

create index if not exists attendance_student_time_idx on public.attendance(student_id, checkin_at desc);
create index if not exists works_student_status_idx on public.daily_works(student_id, status);
create index if not exists evaluations_student_idx on public.skill_evaluations(student_id, evaluated_at desc);
create index if not exists logs_created_idx on public.activity_logs(created_at desc);
