create table if not exists public.emoticon_sets (
  id            text        primary key,
  user_id       uuid        not null references auth.users(id) on delete cascade,
  platform_id   text        not null,
  name          text        not null,
  emoticons     jsonb       not null default '[]',
  thumbnail_id  text,
  display_order int         not null default 0,
  updated_at    timestamptz default now()
);

alter table public.emoticon_sets enable row level security;

create policy "users manage own sets"
  on public.emoticon_sets for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
