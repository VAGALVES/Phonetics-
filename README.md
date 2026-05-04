# JL Marcenaria · Inteligência de orçamento

Versão pronta para subir no GitHub e publicar no Netlify.

## Arquivos principais

- `index.html` — app completo corrigido.
- `manifest.json` — configuração PWA.
- `sw.js` — service worker.
- `icons/` — ícones do app/PWA.
- `netlify.toml` — configuração de deploy Netlify.
- `supabase-schema.sql` — tabela `projetos`, RLS e políticas.

## Antes de testar o Supabase

Rode o arquivo `supabase-schema.sql` no SQL Editor do Supabase.

## Commit sugerido

```bash
git add .
git commit -m "fix: stabilize Supabase integration and PWA assets"
git push
```
