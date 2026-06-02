// Сборщик витрины book.imiron.ru
import { loadJSON, ROOT } from './lib/data.mjs';
import { BASE_CSS, HEADER_HTML, FOOTER_HTML, icon, wrap } from './lib/brand-page.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const { books } = loadJSON('books.json');

const BOOK_CSS = `
  .section-head { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 40px; animation: fadeUp 0.65s 0.08s ease both; }
  .section-label { font-family: 'Unbounded', sans-serif; font-size: 9px; font-weight: 400; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.9); }
  .section-title { font-family: 'Unbounded', sans-serif; font-size: 22px; font-weight: 400; color: #fff; letter-spacing: 0.01em; }
  .books { width: 100%; max-width: 760px; display: flex; flex-direction: column; gap: 20px; }
  .book { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px 28px 22px; display: flex; flex-direction: column; gap: 16px; transition: background 0.25s, border-color 0.25s, transform 0.2s; animation: fadeUp 0.6s ease both; }
  .book:hover { background: var(--hover); border-color: var(--border-strong); transform: translateY(-2px); }
  .book-top { display: flex; gap: 18px; align-items: flex-start; }
  .book-num { font-family: 'Unbounded', sans-serif; font-size: 11px; font-weight: 300; color: var(--muted-dim); letter-spacing: 0.05em; min-width: 24px; padding-top: 3px; }
  .book-meta { flex: 1; min-width: 0; }
  .book-title { font-family: 'Unbounded', sans-serif; font-size: 15px; font-weight: 400; color: #fff; line-height: 1.4; margin-bottom: 6px; }
  .book-author { font-size: 13px; color: var(--muted); letter-spacing: 0.02em; margin-bottom: 10px; }
  .book-desc { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.65; }
  .book-stores { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 4px; padding-left: 42px; }
  .store-btn { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.12); border: 1px solid var(--border); border-radius: 40px; padding: 7px 14px; font-family: 'Mulish', sans-serif; font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.8); text-decoration: none; letter-spacing: 0.02em; transition: background 0.2s, border-color 0.2s, color 0.2s; white-space: nowrap; }
  .store-btn:hover { background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.5); color: #fff; }
  .store-btn svg { width: 14px; height: 14px; flex-shrink: 0; opacity: 0.7; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .store-btn:hover svg { opacity: 1; }
  @media (max-width: 520px) { .book { padding: 20px 18px 18px; } .book-top { gap: 12px; } .book-stores { padding-left: 0; } .section-title { font-size: 18px; } .page { padding: 56px 16px 56px; } }
`;

function pad2(n) { return String(n).padStart(2, '0'); }

function storeBtn(s) {
  return `<a class="store-btn" href="${esc(s.url)}" target="_blank" rel="noopener">
    ${icon(s.icon)} ${esc(s.label)}
  </a>`;
}

const booksHtml = books.map((b, i) => `
  <article class="book" style="animation-delay:${0.1 + i * 0.1}s">
    <div class="book-top">
      <span class="book-num">${pad2(i + 1)}</span>
      <div class="book-meta">
        <div class="book-title">${esc(b.title)}</div>
        <div class="book-author">${esc(b.author)}</div>
        <div class="book-desc">${esc(b.description)}</div>
      </div>
    </div>
    ${b.stores?.length ? `<div class="book-stores">${b.stores.map(storeBtn).join('')}</div>` : ''}
  </article>`).join('');

const body = `
  ${HEADER_HTML('рекомендованные книги')}

  <div class="section-head">
    <span class="section-label">/ books</span>
    <h1 class="section-title">Читаю и советую</h1>
  </div>

  <div class="books">${booksHtml}</div>

  ${FOOTER_HTML}
`;

const html = wrap('Книги — iMiron', BASE_CSS + BOOK_CSS, body);
const dir = join(ROOT, 'dist', 'book');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log('✓ dist/book/index.html собран');
