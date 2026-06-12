-- shares 테이블 생성
create table if not exists public.shares (
  id         uuid        primary key default gen_random_uuid(),
  payload    jsonb       not null,
  created_at timestamptz not null default now()
);

-- anon 사용자도 insert/select 가능하도록 RLS 설정
alter table public.shares enable row level security;

create policy "anyone can insert shares"
  on public.shares for insert
  to anon, authenticated
  with check (true);

create policy "anyone can read shares"
  on public.shares for select
  to anon, authenticated
  using (true);

-- created_at 인덱스 (cron 삭제 쿼리 성능)
create index if not exists shares_created_at_idx on public.shares (created_at);

-- pg_cron: 5분마다 15분 이상 지난 row 자동 삭제
-- (Supabase 대시보드 > Extensions 에서 pg_cron 활성화 필요)
select cron.schedule(
  'delete-expired-shares',        -- job 이름
  '*/5 * * * *',                  -- 매 5분마다
  $$
    delete from public.shares
    where created_at < now() - interval '15 minutes';
  $$
);
