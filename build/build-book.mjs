// Сборщик витрины book.imiron.ru
import { loadJSON, ROOT } from './lib/data.mjs';
import { BASE_CSS, HEADER_HTML, FOOTER_HTML, icon, wrap } from './lib/brand-page.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const { books } = loadJSON('books.json');

const BOOK_CSS = `
  .tabs { display: inline-flex; gap: 4px; padding: 5px; margin-bottom: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 40px; animation: fadeUp 0.65s 0.08s ease both; }
  .tab { font-family: 'Unbounded', sans-serif; font-size: 12px; font-weight: 400; letter-spacing: 0.04em; color: var(--muted); background: transparent; border: none; border-radius: 40px; padding: 11px 26px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.22s, color 0.22s; }
  .tab:hover { color: #fff; }
  .tab.is-active { background: rgba(255,255,255,0.92); color: #2a3033; }
  .tab-count { font-family: 'Mulish', sans-serif; font-size: 11px; font-weight: 600; opacity: 0.55; }
  .tab.is-active .tab-count { opacity: 0.75; }
  .panel { display: none; width: 100%; justify-content: center; }
  .panel.is-active { display: flex; }
  .panel-lead { text-align: center; font-size: 13px; color: var(--muted); line-height: 1.7; max-width: 560px; margin: 0 auto 28px; }
  .books { width: 100%; max-width: 760px; display: flex; flex-direction: column; gap: 20px; margin: 0 auto; }
  .book { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px 28px 22px; display: flex; flex-direction: column; gap: 16px; transition: background 0.25s, border-color 0.25s, transform 0.2s; animation: fadeUp 0.6s ease both; }
  .book:hover { background: var(--hover); border-color: var(--border-strong); transform: translateY(-2px); }
  .book-top { display: flex; gap: 18px; align-items: flex-start; }
  .book-num { font-family: 'Unbounded', sans-serif; font-size: 11px; font-weight: 300; color: var(--muted-dim); letter-spacing: 0.05em; min-width: 24px; padding-top: 3px; }
  .book-meta { flex: 1; min-width: 0; }
  .book-title { font-family: 'Unbounded', sans-serif; font-size: 15px; font-weight: 400; color: #fff; line-height: 1.4; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .book-status { display: inline-flex; align-items: center; font-family: 'Mulish', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 9px; border-radius: 40px; border: 1px solid var(--border); color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); }
  .book-status--wip { color: #ffd479; border-color: rgba(255,212,121,0.4); background: rgba(255,212,121,0.08); }
  .book-status--draft { color: rgba(255,255,255,0.55); }
  .book-status--published { color: #9be29b; border-color: rgba(155,226,155,0.4); background: rgba(155,226,155,0.08); }
  .book-author { font-size: 13px; color: var(--muted); letter-spacing: 0.02em; margin-bottom: 10px; }
  .book-desc { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.65; }
  .book-stores { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 4px; padding-left: 42px; }
  .store-btn { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.12); border: 1px solid var(--border); border-radius: 40px; padding: 7px 14px; font-family: 'Mulish', sans-serif; font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.8); text-decoration: none; letter-spacing: 0.02em; transition: background 0.2s, border-color 0.2s, color 0.2s; white-space: nowrap; }
  .store-btn:hover { background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.5); color: #fff; }
  .store-btn svg { width: 14px; height: 14px; flex-shrink: 0; opacity: 0.7; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .store-btn:hover svg { opacity: 1; }
  @media (max-width: 520px) { .book { padding: 20px 18px 18px; } .book-top { gap: 12px; } .book-stores { padding-left: 0; } .tab { padding: 10px 18px; font-size: 11px; } .page { padding: 56px 16px 56px; } }
`;

function pad2(n) { return String(n).padStart(2, '0'); }

function storeBtn(s) {
  return `<a class="store-btn" href="${esc(s.url)}" target="_blank" rel="noopener">
    ${icon(s.icon)} ${esc(s.label)}
  </a>`;
}

const STATUS_LABEL = {
  wip: 'в работе',
  draft: 'черновик',
  published: 'опубликовано'
};

function renderBook(b, i) {
  const statusBadge = b.status ? `<span class="book-status book-status--${esc(b.status)}">${esc(STATUS_LABEL[b.status] ?? b.status)}</span>` : '';
  const repoBtn = b.url
    ? `<a class="store-btn" href="${esc(b.url)}" target="_blank" rel="noopener">${icon('layers')} Репозиторий</a>`
    : '';
  const storesHtml = b.stores?.length ? b.stores.map(storeBtn).join('') : '';
  const links = (repoBtn + storesHtml);
  return `
  <article class="book" style="animation-delay:${0.1 + i * 0.1}s">
    <div class="book-top">
      <span class="book-num">${pad2(i + 1)}</span>
      <div class="book-meta">
        <div class="book-title">${esc(b.title)}${statusBadge}</div>
        <div class="book-author">${esc(b.author)}</div>
        <div class="book-desc">${esc(b.description)}</div>
      </div>
    </div>
    ${links ? `<div class="book-stores">${links}</div>` : ''}
  </article>`;
}

const own = books.filter(b => b.kind === 'own');
const recommend = books.filter(b => b.kind !== 'own');

const ownHtml = own.map(renderBook).join('');
const recommendHtml = recommend.map(renderBook).join('');

const TAB_SCRIPT = `
  (function () {
    var tabs = document.querySelectorAll('.tab');
    var panels = document.querySelectorAll('.panel');
    function activate(name) {
      var found = false;
      tabs.forEach(function (t) {
        var on = t.dataset.panel === name;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) found = true;
      });
      panels.forEach(function (p) { p.classList.toggle('is-active', p.id === 'panel-' + name); });
      return found;
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        activate(t.dataset.panel);
        history.replaceState(null, '', '#' + t.dataset.panel);
      });
    });
    var hash = (location.hash || '').replace('#', '');
    if (!activate(hash)) activate('write');
  })();
`;

const body = `
  ${HEADER_HTML('книги и материалы')}

  <div class="tabs" role="tablist">
    ${own.length ? `<button class="tab" data-panel="write" role="tab" aria-selected="false">Пишу <span class="tab-count">${own.length}</span></button>` : ''}
    <button class="tab" data-panel="read" role="tab" aria-selected="false">Читаю <span class="tab-count">${recommend.length}</span></button>
  </div>

  ${own.length ? `
  <section class="panel" id="panel-write" role="tabpanel">
    <div>
      <p class="panel-lead">Пишу про 1С для тех, кто приходит на платформу с других стеков — и для новичков.</p>
      <div class="books">${ownHtml}</div>
    </div>
  </section>` : ''}

  <section class="panel" id="panel-read" role="tabpanel">
    <div>
      <p class="panel-lead">Книги, которые читаю сам и советую другим.</p>
      <div class="books">${recommendHtml}</div>
    </div>
  </section>

  ${FOOTER_HTML}
  <script>${TAB_SCRIPT}</script>
`;

const html = wrap('Книги — iMiron', BASE_CSS + BOOK_CSS, body);
const dir = join(ROOT, 'dist', 'book');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log('✓ dist/book/index.html собран');
