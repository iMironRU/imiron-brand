// Сборка резюме из data/resume.json (стандарт JSON Resume) в HTML.
// HTML дальше можно отрендерить в PDF (headless-браузер) или прогнать темой JSON Resume.
// Запуск: node build/build-resume.mjs
import { loadJSON, ROOT } from './lib/data.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const r = loadJSON('resume.json');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const work = (r.work || []).map((w) => `
  <section class="item">
    <h3>${esc(w.position)} — ${esc(w.name)}</h3>
    <div class="dates">${esc(w.startDate)}${w.endDate ? ' – ' + esc(w.endDate) : ' – н.в.'}</div>
    ${w.summary ? `<p>${esc(w.summary)}</p>` : ''}
    <ul>${(w.highlights || []).filter((h) => !h.startsWith('TODO')).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
  </section>`).join('');

const skills = (r.skills || []).map((s) => `<li><b>${esc(s.name)}:</b> ${esc((s.keywords || []).join(', '))}</li>`).join('');
const projects = (r.projects || []).map((p) => `<li><b>${esc(p.name)}</b> — ${esc(p.description)} <a href="${esc(p.url)}">${esc(p.url)}</a></li>`).join('');

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<title>${esc(r.basics.name)} — резюме</title>
<style>
 body{font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;max-width:800px;margin:40px auto;color:#1a1a1a;padding:0 20px}
 h1{margin-bottom:0} .label{color:#555;font-size:17px} .contacts{color:#444;font-size:14px;margin:8px 0 24px}
 h2{border-bottom:2px solid #eee;padding-bottom:4px;margin-top:28px} .item{margin:14px 0} .item h3{margin:0}
 .dates{color:#888;font-size:13px} ul{margin:6px 0}
</style></head><body>
<h1>${esc(r.basics.name)}</h1>
<div class="label">${esc(r.basics.label)}</div>
<div class="contacts">${esc(r.basics.email)} · ${esc(r.basics.url)} · ${esc(r.basics.location?.city || '')}</div>
<p>${esc(r.basics.summary)}</p>
<h2>Опыт</h2>${work}
<h2>Навыки</h2><ul>${skills}</ul>
<h2>Проекты</h2><ul>${projects}</ul>
<h2>Образование</h2><ul>${(r.education || []).map((e) => `<li>${esc(e.institution)} — ${esc(e.area)} (${esc(e.endDate)})</li>`).join('')}</ul>
</body></html>`;

const dir = join(ROOT, 'dist', 'resume');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'resume.html'), html);
console.log('✓ dist/resume/resume.html собран (PDF: прогнать через headless-браузер или тему JSON Resume)');
