-- profiles 테이블 생성
create table if not exists public.profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  email        text,
  is_premium   boolean     not null default false,
  purchased_at timestamptz
);

-- 로그인한 유저만 자신의 프로필 조회 가능
alter table public.profiles enable row level security;

create policy "users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- 회원가입 시 profiles row 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
