-- inquiries 테이블 생성 (문의하기 / 건의하기)
create table if not exists public.inquiries (
  id            uuid        primary key default gen_random_uuid(),
  type          text        not null check (type in ('inquiry', 'suggestion')),
  contact_email text,
  content       text        not null,
  user_id       uuid        references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- anon 사용자도 등록 가능하도록 RLS 설정 (조회는 관리자만 대시보드에서)
alter table public.inquiries enable row level security;

create policy "anyone can insert inquiries"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at);
