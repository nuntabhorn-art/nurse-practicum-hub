-- ==============================================================================
-- Nurse Practicum Hub: Extended Supabase Schema (V2 Major Upgrade)
-- Includes:
-- 1. Knowledge Base (คลังความรู้: เอกสาร, ลิงก์, อินโฟกราฟิก)
-- 2. Enhanced Exam Questions (คลังข้อสอบเสมือน 8 วิชา พร้อมเฉลย, เหตุผล, อ้างอิง)
-- 3. System Feature Controls (แผงควบคุมสวิตช์ เปิด/ปิด ฟังก์ชันของอาจารย์)
-- 4. Attendance Status: add 'late_submission' (ส่งงานช้า)
-- ==============================================================================

-- 1. เพิ่มสถานะ 'late_submission' ใน enum attendance_status (ถ้ายังไม่มี)
do $$
begin
  if not exists (
    select 1 from pg_enum 
    where enumlabel = 'late_submission' 
      and enumtypid = 'public.attendance_status'::regtype
  ) then
    alter type public.attendance_status add value 'late_submission';
  end if;
end $$;

-- 2. ตาราง Knowledge Base (คลังความรู้พยาบาล)
create table if not exists public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'ทั่วไป', -- 'เอกสาร/คู่มือ', 'อินโฟกราฟิก', 'ลิงก์ภายนอก', 'หัตถการ'
  item_type text not null check (item_type in ('document', 'image', 'link')),
  url text not null,
  description text,
  thumbnail_url text,
  is_pinned boolean not null default false,
  is_active boolean not null default true,
  view_count integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.knowledge_items enable row level security;

drop policy if exists "knowledge: public read active" on public.knowledge_items;
create policy "knowledge: public read active" on public.knowledge_items
  for select using (is_active or public.is_staff());

drop policy if exists "knowledge: staff manage" on public.knowledge_items;
create policy "knowledge: staff manage" on public.knowledge_items
  for all using (public.is_staff()) with check (public.is_staff());

-- 3. ตาราง System Feature Controls (สวิตช์เปิด-ปิดฟังก์ชันโดยอาจารย์)
create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.system_settings enable row level security;

drop policy if exists "system_settings: read authenticated" on public.system_settings;
create policy "system_settings: read authenticated" on public.system_settings
  for select using (true);

drop policy if exists "system_settings: staff manage" on public.system_settings;
create policy "system_settings: staff manage" on public.system_settings
  for all using (public.is_staff()) with check (public.is_staff());

-- ตั้งค่าค่าเริ่มต้นสำหรับฟังก์ชันตรวจงานและส่งงาน
insert into public.system_settings (key, value, description)
values 
  ('feature_work_submission', '{"enabled": true, "message": "เปิดรับส่งงานตามปกติ"}'::jsonb, 'สวิตช์เปิด/ปิดการส่ง Daily Care Plan'),
  ('feature_grading', '{"enabled": true, "message": "ระบบตรวจงานพร้อมใช้งาน"}'::jsonb, 'สวิตช์เปิด/ปิดการตรวจและให้คะแนน'),
  ('feature_attendance_checkin', '{"enabled": true, "message": "เปิดเช็คชื่อขึ้นเวร"}'::jsonb, 'สวิตช์เปิด/ปิดการเช็คชื่อเข้าเวร'),
  ('feature_exam', '{"enabled": true, "message": "เปิดคลังข้อสอบเสมือน"}'::jsonb, 'สวิตช์เปิด/ปิดคลังข้อสอบเสมือน')
on conflict (key) do nothing;

-- 4. ปรับปรุงตาราง Exam Questions ให้รองรับเหตุผลและอ้างอิงชัดเจน
alter table public.exam_questions 
  add column if not exists reference text,
  add column if not exists year_level text default 'ทุกชั้นปี',
  add column if not exists difficulty text default 'ปานกลาง';

-- 5. สิทธิ์ของ Staff ในการจัดการ Profiles (เพิ่ม/แก้ไข/ลบ นักศึกษา)
drop policy if exists "profiles: staff insert" on public.profiles;
create policy "profiles: staff insert" on public.profiles
  for insert with check (public.is_staff());

drop policy if exists "profiles: staff update" on public.profiles;
create policy "profiles: staff update" on public.profiles
  for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists "profiles: staff delete" on public.profiles;
create policy "profiles: staff delete" on public.profiles
  for delete using (public.is_staff());
