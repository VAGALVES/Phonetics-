# Fonética Inglesa para Brasileiros

> **VS Consulting · Linguistic Lab** — Framework editorial de fonética inglesa para falantes nativos de português brasileiro.

Aplicação web estática que cataloga os 40 sons do inglês americano (General American), classificados pela sua relação com o português brasileiro. Cada som vem com áudio integrado (Web Speech API), análise comparativa, grafias frequentes, exemplos contextualizados e pares mínimos para os contrastes mais críticos.

## Características

- **40 sons mapeados** — 11 monoftongos, 5 ditongos, 24 consoantes
- **Sistema cromático tripartite** — existe em PT-BR (sage), aproximado (amber), novo/desafiador (terra)
- **Áudio integrado** via Web Speech API (en-US)
- **Pares mínimos** para sons críticos (ship/sheep, think/sink, they/day)
- **Diagnóstico** de erros típicos do falante brasileiro
- **Roadmap de estudo** em 4 fases otimizadas por retorno linguístico
- **PWA completo** — instalável, funciona offline
- **Mobile-first**, dark editorial, branding VS Consulting

## Estrutura do projeto

```
phonetics-vs/
├── index.html          # Aplicação principal
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (cache offline)
├── netlify.toml        # Configuração de deploy
├── og-image.png        # Open Graph (1200×630)
├── icon-192.png        # Ícone PWA
├── icon-512.png        # Ícone PWA
├── apple-touch-icon.png # Ícone iOS (180px)
├── favicon.ico         # Favicon multi-size
├── .gitignore
└── README.md
```

## Deploy via Mobile (passo a passo)

### Parte 1 — Subir no GitHub pelo celular

1. **Abra o GitHub no navegador do celular**: `github.com`
2. Toque no **`+`** no topo → **`New repository`**
3. Nome: `phonetics-vs` · Visibilidade: **Public** · NÃO marque "Add README" → **Create repository**
4. Na tela do repo vazio, role até **"uploading an existing file"** (link azul) e toque
5. Toque em **"choose your files"** → selecione **TODOS os 10 arquivos** desta pasta
   - `index.html`, `manifest.json`, `sw.js`, `netlify.toml`, `og-image.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon.ico`, `README.md`
6. Aguarde upload terminar
7. Em **"Commit changes"**, escreva: `feat: initial release v1.0`
8. Toque em **`Commit changes`** (botão verde)

### Parte 2 — Conectar ao Netlify

1. Abra **`app.netlify.com`** no celular → **Sign up with GitHub**
2. Toque em **`Add new site`** → **`Import an existing project`**
3. Toque em **`Deploy with GitHub`** → autorize
4. Selecione o repositório **`phonetics-vs`**
5. Configurações de build (deixar como está — o `netlify.toml` configura tudo):
   - Branch: `main`
   - Build command: *(vazio)*
   - Publish directory: `.`
6. Toque em **`Deploy phonetics-vs`**

Em ~30 segundos o app está no ar com URL `https://nome-aleatorio.netlify.app`.

### Parte 3 — Personalizar URL

No painel do site no Netlify:
- **Site settings → Change site name** → escolha algo como `phonetics-vs` ou `vs-phonetics`
- A URL fica `https://phonetics-vs.netlify.app`

### Parte 4 — Atualizações futuras

Toda vez que você editar um arquivo no GitHub (ou subir versão nova), o Netlify detecta automaticamente e re-deploya. Zero trabalho.

## Considerações para uso na China

1. **Web Speech API** funciona localmente em Chrome/Edge/Safari — não depende de servidor externo na maioria dos casos.
2. **Google Fonts** podem ser bloqueados. Para máxima resiliência, considere baixar as fontes (Fraunces, Instrument Sans, JetBrains Mono) e servir localmente.
3. **Service Worker** pré-cacheia tudo na primeira visita — após isso, funciona 100% offline.

## Roadmap futuro

- [ ] Áudio gravado por nativo americano (substituir TTS para os 10 sons novos)
- [ ] Sistema de progresso (localStorage)
- [ ] Modo "drill" — pares mínimos em loop
- [ ] Reconhecimento de voz para auto-avaliação
- [ ] Versão Mandarim partindo do português

## Créditos

**VS Consulting · Linguistic Lab**
Para Vagner & Thays — preparação fonética para imersão internacional.

---

*Versão 1.0 · MMXXVI · Um estudo sobre a arquitetura sonora do inglês.*
