/**
 * JL Marcenaria · Service Worker
 *
 * Estratégia:
 *  - App shell (HTML/JS/CSS): stale-while-revalidate
 *      Serve cache imediato, busca atualização em background.
 *      Próxima visita pega a nova versão.
 *  - Ícones e assets estáticos: cache-first
 *      Não mudam, podem ficar em cache longo.
 *  - Supabase API: network-only
 *      Operações com banco SEMPRE precisam ir online.
 *      Sem cache de resposta = sem leitura stale de dados sensíveis.
 *  - esm.sh (Supabase JS): stale-while-revalidate
 *      Permite o app abrir offline mesmo sem internet.
 *
 * Versionamento:
 *  CACHE_VERSION é injetado no momento do deploy.
 *  Quando muda → caches antigos são apagados → app força refresh.
 */

const CACHE_VERSION = 'jl-v1-20260503-205316';
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Recursos do app shell — pré-cacheados na instalação
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192-maskable.png',
  '/icons/icon-512-maskable.png',
  '/icons/apple-touch-icon.png'
];

/* ───────────────────────────────
   INSTALAÇÃO: pré-cache do shell
   ─────────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()) // ativa sem esperar abas antigas fecharem
  );
});

/* ───────────────────────────────
   ATIVAÇÃO: limpar caches antigos
   ─────────────────────────────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // toma controle de todas as abas abertas
  );
});

/* ───────────────────────────────
   FETCH: roteamento por estratégia
   ─────────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Apenas GET é cacheável
  if (request.method !== 'GET') return;

  // 1) Supabase API → network-only (não cacheamos chamadas de banco)
  if (url.hostname.endsWith('.supabase.co') || url.hostname.endsWith('.supabase.in')) {
    return; // browser comportamento default
  }

  // 2) esm.sh (Supabase JS) → stale-while-revalidate
  if (url.hostname === 'esm.sh') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 3) App shell e assets locais → stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

/* ───────────────────────────────
   ESTRATÉGIA: stale-while-revalidate
   ─────────────────────────────── */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  // Busca em background, atualiza cache se vier resposta válida
  const networkPromise = fetch(request)
    .then((response) => {
      // Só cacheia respostas OK e do tipo basic/cors
      if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  // Retorna cache imediato se houver, senão espera network
  return cachedResponse || networkPromise || new Response('Offline · sem cache disponível', {
    status: 503,
    statusText: 'Offline',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

/* ───────────────────────────────
   MENSAGENS: comunicação com a página
   ─────────────────────────────── */
self.addEventListener('message', (event) => {
  // Quando a página manda 'SKIP_WAITING', o SW novo ativa imediatamente
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
