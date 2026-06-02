// Сборщик витрины «github-pages» / imiron.ru
// Собирает index.html из всех data-источников, фильтруя по target='github-pages'.
import { loadJSON, filterForTarget, titleFor, ROOT } from './lib/data.mjs';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const TARGET = 'github-pages';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const link = (url, text) => `<a href="${esc(url)}">${esc(text)}</a>`;

const identity = loadJSON('identity.json');
const projects = filterForTarget(loadJSON('projects.json').projects, TARGET);
const skillGroups = filterForTarget(loadJSON('skills.json').groups, TARGET);
const cases = filterForTarget(loadJSON('cases.json').cases, TARGET);
const contacts = filterForTarget(loadJSON('contacts.json').channels, TARGET);
const support = loadJSON('contacts.json').support;

const title = titleFor(identity, TARGET);

// ── Bio (из content/, если есть) ────────────────────────────────────────────
let bioHtml = `<p>${esc(identity.core)}</p>`;
const bioPath = join(ROOT, 'content', 'bio', 'bio-medium.md');
if (existsSync(bioPath)) {
  const raw = readFileSync(bioPath, 'utf8').replace(/^---[\s\S]*?---\n/, '').trim();
  bioHtml = raw.split(/\n\n+/).map((p) => `<p>${esc(p.replace(/\n/g, ' '))}</p>`).join('\n');
}

// ── Секции ───────────────────────────────────────────────────────────────────
const projectsHtml = projects.map((p) => `
  <article class="card">
    <h3>${link(p.url, p.name)}</h3>
    <p class="tagline">${esc(p.tagline)}</p>
    <p>${esc(p.description)}</p>
    ${p.keywords?.length ? `<p class="tags">${p.keywords.map((k) => `<span>${esc(k)}</span>`).join(' ')}</p>` : ''}
  </article>`).join('');

const skillsHtml = skillGroups.map((g) => `
  <div class="skill-group${g.primary ? ' primary' : ''}">
    <strong>${esc(g.name)}</strong>${g.level ? ` <span class="level">${esc(g.level)}</span>` : ''}
    <div class="keywords">${(g.keywords || []).map((k) => `<span>${esc(k)}</span>`).join(' ')}</div>
    ${g.note ? `<p class="note">${esc(g.note)}</p>` : ''}
  </div>`).join('');

const casesHtml = cases.map((c) => `
  <article class="case">
    <h3>${esc(c.title)}</h3>
    <p class="meta">${esc(c.domain)} · ${esc(c.period)}</p>
    <p><strong>Задача:</strong> ${esc(c.problem)}</p>
    ${c.constraint ? `<p><strong>Ограничение:</strong> ${esc(c.constraint)}</p>` : ''}
    <p><strong>Решение:</strong> ${esc(c.solution)}</p>
    <p><strong>Итог:</strong> ${esc(c.outcome)}</p>
    ${c.lesson ? `<p class="lesson">💡 ${esc(c.lesson)}</p>` : ''}
  </article>`).join('');

const contactsHtml = contacts.map((ch) => {
  const label = esc(ch.label);
  const val = ch.url ? link(ch.url, ch.handle || ch.label) : esc(ch.value || ch.handle || ch.label);
  return `<li>${label}: ${val}</li>`;
}).join('');

const supportHtml = (support && filterForTarget([support], TARGET).length === 0)
  ? ''
  : support ? `<p class="support">${link(support.url, support.label)}</p>` : '';

// ── HTML ─────────────────────────────────────────────────────────────────────
const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(identity.shortName)} — ${esc(title)}</title>
  <meta name="description" content="${esc(identity.core)}">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font: 16px/1.6 -apple-system, Segoe UI, Roboto, sans-serif; max-width: 860px; margin: 0 auto; padding: 24px 20px; color: #1a1a1a; }
    a { color: #0969da; }
    h1 { margin-bottom: 4px; font-size: 2rem; }
    h2 { margin-top: 48px; border-bottom: 2px solid #eee; padding-bottom: 6px; }
    .epigraph { color: #555; font-style: italic; margin: 4px 0 8px; }
    .portrait { font-size: 1.1rem; color: #333; margin-bottom: 24px; }

    .card, .case { border: 1px solid #e1e4e8; border-radius: 8px; padding: 16px 20px; margin: 16px 0; }
    .card h3, .case h3 { margin: 0 0 6px; }
    .tagline { color: #555; margin: 0 0 8px; font-style: italic; }
    .meta { color: #888; font-size: 0.9rem; margin: 0 0 10px; }
    .lesson { background: #f6f8fa; border-left: 3px solid #0969da; padding: 8px 12px; margin-top: 10px; }
    .tags span, .keywords span { display: inline-block; background: #f0f3f6; border-radius: 4px; padding: 2px 7px; font-size: 0.82rem; margin: 2px 2px 0 0; }
    .skill-group { margin: 12px 0; }
    .skill-group.primary strong { font-size: 1.05rem; }
    .level { color: #888; font-size: 0.85rem; margin-left: 6px; }
    .note { color: #888; font-size: 0.88rem; margin: 4px 0 0; }
    ul { padding-left: 20px; }
    footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 0.88rem; }
  </style>
</head>
<body>

<header>
  <h1>${esc(identity.shortName)}</h1>
  <p class="epigraph">«${esc(identity.epigraph)}»</p>
  <p class="portrait">${esc(title)}</p>
</header>

<section id="about">
  ${bioHtml}
</section>

<section id="projects">
  <h2>Проекты</h2>
  ${projectsHtml}
</section>

<section id="skills">
  <h2>Стек и экспертиза</h2>
  ${skillsHtml}
</section>

<section id="cases">
  <h2>Кейсы</h2>
  ${casesHtml}
</section>

<section id="contacts">
  <h2>Контакты</h2>
  <ul>${contactsHtml}</ul>
  ${supportHtml}
</section>

<footer>
  <p>Собрано из <a href="https://github.com/iMironRU/imiron-brand">imiron-brand</a></p>
</footer>

</body>
</html>`;

const dir = join(ROOT, 'dist', 'github-pages');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log('✓ dist/github-pages/index.html собран');
