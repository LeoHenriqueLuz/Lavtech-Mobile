-- Bucket público para o logo da empresa (usado no app e no rodapé/cabeçalho do PDF da OS).

insert into storage.buckets (id, name, public)
values ('empresa', 'empresa', true)
on conflict (id) do nothing;

create policy "leitura_publica_empresa" on storage.objects
  for select using (bucket_id = 'empresa');

create policy "usuarios_autenticados_upload_empresa" on storage.objects
  for insert to authenticated with check (bucket_id = 'empresa');

create policy "usuarios_autenticados_update_empresa" on storage.objects
  for update to authenticated using (bucket_id = 'empresa');

create policy "usuarios_autenticados_delete_empresa" on storage.objects
  for delete to authenticated using (bucket_id = 'empresa');
