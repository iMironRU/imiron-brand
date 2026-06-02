// Сборщик витрины «portfolio» — проекты, стек, кейсы, контакты.
import { loadJSON, filterForTarget, titleFor, ROOT } from './lib/data.mjs';
import { BASE_CSS, HEADER_HTML, FOOTER_HTML, ARROW_SVG, wrap } from './lib/brand-page.mjs';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const TARGET = 'github-pages';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const identity  = loadJSON('identity.json');
const projects  = filterForTarget(loadJSON('projects.json').projects, TARGET);
const groups    = filterForTarget(loadJSON('skills.json').groups, TARGET);
const cases     = filterForTarget(loadJSON('cases.json').cases, TARGET);
const contacts  = filterForTarget(loadJSON('contacts.json').channels, TARGET);

const title = titleFor(identity, TARGET);

// ── Bio ──────────────────────────────────────────────────────────────────────
let bio = esc(identity.core);
const bioPath = join(ROOT, 'content', 'bio', 'bio-medium.md');
if (existsSync(bioPath)) {
  bio = readFileSync(bioPath, 'utf8')
    .replace(/^---[\s\S]*?---\n/, '').trim()
    .split(/\n\n+/)
    .map((p) => `<p class="bio-p">${esc(p.replace(/\n/g, ' '))}</p>`)
    .join('');
} else {
  bio = `<p class="bio-p">${bio}</p>`;
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  .content { width: 100%; max-width: 760px; display: flex; flex-direction: column; gap: 48px; }

  /* секция */
  .section { display: flex; flex-direction: column; gap: 16px; animation: fadeUp 0.6s ease both; }
  .section:nth-child(1) { animation-delay: 0.05s; }
  .section:nth-child(2) { animation-delay: 0.12s; }
  .section:nth-child(3) { animation-delay: 0.19s; }
  .section:nth-child(4) { animation-delay: 0.26s; }
  .section:nth-child(5) { animation-delay: 0.33s; }

  .section-label {
    font-family: 'Unbounded', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.5);
  }

  /* hero */
  .hero { text-align: center; margin-bottom: 8px; animation: fadeUp 0.65s ease both; }
  .hero-epigraph { font-family: 'Unbounded', sans-serif; font-size: 11px; letter-spacing: 0.15em; color: var(--muted); margin-bottom: 10px; }
  .hero-title { font-family: 'Unbounded', sans-serif; font-size: clamp(15px,3vw,20px); font-weight: 400; color: #fff; line-height: 1.5; }
  .bio-p { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.75; }
  .bio-p + .bio-p { margin-top: 8px; }

  /* project card */
  .proj { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px 24px; display: flex; align-items: flex-start; gap: 16px; text-decoration: none; color: inherit; transition: background 0.2s, border-color 0.2s, transform 0.18s; }
  .proj:hover { background: var(--hover); border-color: var(--border-strong); transform: translateY(-2px); }
  .proj-body { flex: 1; min-width: 0; }
  .proj-name { font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 400; color: #fff; margin-bottom: 5px; }
  .proj-tagline { font-size: 12.5px; color: var(--muted); line-height: 1.55; margin-bottom: 8px; }
  .proj-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .proj-tags span { background: rgba(0,0,0,0.15); border: 1px solid var(--border); border-radius: 20px; padding: 2px 9px; font-size: 10.5px; color: var(--muted); font-family: 'Unbounded', sans-serif; letter-spacing: 0.04em; }

  /* skills */
  .skills-grid { display: flex; flex-direction: column; gap: 12px; }
  .skill-row { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px 18px; }
  .skill-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .skill-name { font-family: 'Unbounded', sans-serif; font-size: 11px; font-weight: 400; color: #fff; letter-spacing: 0.03em; }
  .skill-level { font-size: 10px; color: var(--muted-dim); font-family: 'Unbounded', sans-serif; letter-spacing: 0.05em; margin-left: auto; }
  .skill-kw { display: flex; flex-wrap: wrap; gap: 5px; }
  .skill-kw span { background: rgba(0,0,0,0.12); border-radius: 20px; padding: 3px 9px; font-size: 11px; color: rgba(255,255,255,0.55); }
  .skill-note { font-size: 11px; color: var(--muted-dim); margin-top: 6px; font-style: italic; }

  /* cases */
  .case { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px 24px; display: flex; flex-direction: column; gap: 10px; }
  .case-title { font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 400; color: #fff; line-height: 1.4; }
  .case-meta { font-size: 11px; color: var(--muted-dim); font-family: monospace; letter-spacing: 0.03em; }
  .case-row { font-size: 12.5px; color: rgba(255,255,255,0.6); line-height: 1.65; }
  .case-row b { color: rgba(255,255,255,0.8); font-weight: 600; }
  .case-lesson { background: rgba(0,0,0,0.15); border-left: 2px solid rgba(255,255,255,0.3); padding: 8px 12px; font-size: 12px; color: var(--muted); line-height: 1.6; border-radius: 0 8px 8px 0; }

  /* contacts */
  .contact-list { display: flex; flex-direction: column; gap: 10px; }
  .contact-item { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; text-decoration: none; color: inherit; transition: background 0.2s, border-color 0.2s; }
  .contact-item:hover { background: var(--hover); border-color: var(--border-strong); }
  .contact-label { font-family: 'Unbounded', sans-serif; font-size: 10px; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
  .contact-val { font-size: 13px; color: #fff; }

  @media (max-width: 520px) { .proj { padding: 16px 18px; } .case { padding: 16px 18px; } .page { padding: 52px 16px 52px; } }
`;

// ── Секции ────────────────────────────────────────────────────────────────────
const projectsHtml = projects.map((p) => `
  <a class="proj" href="${esc(p.url)}" target="_blank" rel="noopener">
    <div class="proj-body">
      <div class="proj-name">${esc(p.name)}</div>
      <div class="proj-tagline">${esc(p.tagline)}</div>
      ${p.keywords?.length ? `<div class="proj-tags">${p.keywords.map((k) => `<span>${esc(k)}</span>`).join('')}</div>` : ''}
    </div>
    ${ARROW_SVG}
  </a>`).join('');

const skillsHtml = groups.map((g) => `
  <div class="skill-row">
    <div class="skill-head">
      <span class="skill-name">${esc(g.name)}</span>
      ${g.level ? `<span class="skill-level">${esc(g.level)}</span>` : ''}
    </div>
    <div class="skill-kw">${(g.keywords || []).map((k) => `<span>${esc(k)}</span>`).join('')}</div>
    ${g.note ? `<div class="skill-note">${esc(g.note)}</div>` : ''}
  </div>`).join('');

const casesHtml = cases.map((c) => `
  <div class="case">
    <div class="case-title">${esc(c.title)}</div>
    <div class="case-meta">${esc(c.domain)} · ${esc(c.period)}</div>
    <div class="case-row"><b>Задача:</b> ${esc(c.problem)}</div>
    ${c.constraint ? `<div class="case-row"><b>Ограничение:</b> ${esc(c.constraint)}</div>` : ''}
    <div class="case-row"><b>Решение:</b> ${esc(c.solution)}</div>
    <div class="case-row"><b>Итог:</b> ${esc(c.outcome)}</div>
    ${c.lesson ? `<div class="case-lesson">${esc(c.lesson)}</div>` : ''}
  </div>`).join('');

const contactsHtml = contacts.map((ch) => {
  const href = ch.url || `mailto:${ch.value}`;
  const val = ch.handle || ch.value || ch.label;
  return `
  <a class="contact-item" href="${esc(href)}" target="_blank" rel="noopener">
    <span class="contact-label">${esc(ch.label)}</span>
    <span class="contact-val">${esc(val)}</span>
  </a>`;
}).join('');

const body = `
  ${HEADER_HTML('портфолио')}

  <div class="content">

    <div class="section">
      <div class="hero">
        <div class="hero-epigraph">«${esc(identity.epigraph)}»</div>
        <div class="hero-title">${esc(title)}</div>
      </div>
      ${bio}
    </div>

    <div class="section">
      <div class="section-label">/ проекты</div>
      ${projectsHtml}
    </div>

    <div class="section">
      <div class="section-label">/ стек и экспертиза</div>
      <div class="skills-grid">${skillsHtml}</div>
    </div>

    <div class="section">
      <div class="section-label">/ кейсы</div>
      ${casesHtml}
    </div>

    <div class="section">
      <div class="section-label">/ контакты</div>
      <div class="contact-list">${contactsHtml}</div>
    </div>

  </div>

  ${FOOTER_HTML}
`;

const html = wrap(`${esc(identity.shortName)} — портфолио`, BASE_CSS + CSS, body);
const dir = join(ROOT, 'dist', 'github-pages');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
console.log('✓ dist/github-pages/index.html собран');
