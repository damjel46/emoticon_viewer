insert into storage.buckets (id, name, public)
values ('emoticon-images', 'emoticon-images', true)
on conflict (id) do nothing;

create policy "users can manage own emoticon images"
  on storage.objects for all to authenticated
  using  (bucket_id = 'emoticon-images' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'emoticon-images' and (storage.foldername(name))[1] = auth.uid()::text);
