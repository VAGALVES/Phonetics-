-- JL Marcenaria · Supabase schema mínimo
-- Rode este arquivo no Supabase > SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.projetos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome_projeto text,
  cliente text,
  numero_proposta text,
  status text not null default 'orcamento'
    check (status in ('orcamento', 'aprovado', 'producao', 'entregue', 'cancelado')),
  valor_total numeric not null default 0,
  margem_liquida numeric not null default 0,
  dados jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_projetos_updated_at on public.projetos;
create trigger trg_projetos_updated_at
before update on public.projetos
for each row
execute function public.set_updated_at();

alter table public.projetos enable row level security;

drop policy if exists "Users can view own projetos" on public.projetos;
drop policy if exists "Users can insert own projetos" on public.projetos;
drop policy if exists "Users can update own projetos" on public.projetos;
drop policy if exists "Users can delete own projetos" on public.projetos;

create policy "Users can view own projetos" on public.projetos for select using (auth.uid() = user_id);
create policy "Users can insert own projetos" on public.projetos for insert with check (auth.uid() = user_id);
create policy "Users can update own projetos" on public.projetos for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own projetos" on public.projetos for delete using (auth.uid() = user_id);

create index if not exists idx_projetos_user_updated on public.projetos (user_id, updated_at desc);
