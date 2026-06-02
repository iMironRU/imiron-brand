// Сборщик витрины app.imiron.ru
import { loadJSON, ROOT } from './lib/data.mjs';
import { BASE_CSS, HEADER_HTML, FOOTER_HTML, ARROW_SVG, icon, wrap } from './lib/brand-page.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const data = loadJSON('apps.json');

const TAB_CSS = `
  .tabs { display: flex; gap: 4px; background: rgba(0,0,0,0.1); border-radius: 40px; padding: 4px; margin-bottom: 36px; animation: fadeUp 0.65s 0.08s ease both; }
  .tab { font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: transparent; border: none; border-radius: 36px; padding: 9px 20px; cursor: pointer; transition: background 0.2s, color 0.2s; white-space: nowrap; }
  .tab.active { background: rgba(255,255,255,0.18); color: #fff; border: 1px solid var(--border); }
  .tab:hover:not(.active) { color: rgba(255,255,255,0.8); }
  .panel { display: none; width: 100%; max-width: 720px; flex-direction: column; gap: 16px; animation: fadeUp 0.4s ease both; }
  .panel.active { display: flex; }
`;

function card(item) {
  return `
    <a class="card" href="${esc(item.url)}" target="_blank" rel="noopener">
      <div class="icon-box">${icon(item.icon)}</div>
      <div class="card-body">
        <div class="card-title">${esc(item.name)}</div>
        <div class="card-desc">${esc(item.description)}</div>
        ${item.meta ? `<div class="card-meta">${esc(item.meta)}</div>` : ''}
      </div>
      ${ARROW_SVG}
    </a>`;
}

const onlineCards = data.online.map(card).join('');
const onecCards = data.onec.map(card).join('');

const body = `
  ${HEADER_HTML('мои приложения и разработки')}

  <div class="tabs">
    <button class="tab active" onclick="switchTab('online',this)">Онлайн</button>
    <button class="tab" onclick="switchTab('onec',this)">Для 1С</button>
  </div>

  <div class="panel active" id="panel-online">${onlineCards}</div>
  <div class="panel" id="panel-onec">${onecCards}</div>

  ${FOOTER_HTML}

  <script>
    function switchTab(id, btn) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + id).classList.add('active');
    }
  </script>
`;

const html = wrap('Приложения — iMiron', BASE_CSS + TAB_CSS, body);
const dir = join(ROOT, 'dist', 'app');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log('✓ dist/app/index.html собран');
