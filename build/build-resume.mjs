// Сборка резюме из data/resume.json в HTML бренд-стиле.
import { loadJSON, ROOT } from './lib/data.mjs';
import { BASE_CSS, HEADER_HTML, FOOTER_HTML, wrap } from './lib/brand-page.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const r = loadJSON('resume.json');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CSS = `
  .content { width: 100%; max-width: 760px; display: flex; flex-direction: column; gap: 40px; }

  .section { display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.6s ease both; }
  .section:nth-child(1) { animation-delay: 0.05s; }
  .section:nth-child(2) { animation-delay: 0.1s; }
  .section:nth-child(3) { animation-delay: 0.15s; }
  .section:nth-child(4) { animation-delay: 0.2s; }
  .section:nth-child(5) { animation-delay: 0.25s; }

  .section-label {
    font-family: 'Unbounded', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.5);
  }

  /* hero */
  .hero { text-align: center; animation: fadeUp 0.65s ease both; }
  .hero-name { font-family: 'Unbounded', sans-serif; font-size: clamp(16px,3vw,22px); font-weight: 400; color: #fff; margin-bottom: 8px; }
  .hero-label { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 6px; }
  .hero-contacts { font-size: 12px; color: var(--muted-dim); font-family: monospace; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; }
  .hero-contacts a { color: var(--muted); text-decoration: none; }
  .hero-contacts a:hover { color: #fff; }
  .summary { font-size: 13.5px; color: rgba(255,255,255,0.65); line-height: 1.75; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; margin-top: 4px; }

  /* work */
  .job { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 20px 22px; display: flex; flex-direction: column; gap: 8px; }
  .job-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .job-title { font-family: 'Unbounded', sans-serif; font-size: 12px; font-weight: 400; color: #fff; line-height: 1.45; }
  .job-dates { font-size: 11px; color: var(--muted-dim); font-family: monospace; white-space: nowrap; padding-top: 2px; }
  .job-company { font-size: 12px; color: var(--muted); }
  .job-summary { font-size: 12.5px; color: rgba(255,255,255,0.55); line-height: 1.65; }
  .job-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 5px; }
  .job-list li { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.6; padding-left: 14px; position: relative; }
  .job-list li::before { content: '—'; position: absolute; left: 0; color: var(--muted-dim); }

  /* skills */
  .skill-row { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 12px 16px; }
  .skill-head { display: flex; align-items: center; gap: 10px; margin-bottom: 7px; }
  .skill-name { font-family: 'Unbounded', sans-serif; font-size: 10.5px; color: #fff; letter-spacing: 0.03em; }
  .skill-kw { display: flex; flex-wrap: wrap; gap: 5px; }
  .skill-kw span { background: rgba(0,0,0,0.12); border-radius: 20px; padding: 2px 8px; font-size: 11px; color: rgba(255,255,255,0.5); }

  /* projects */
  .proj-item { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; text-decoration: none; color: inherit; transition: background 0.2s, border-color 0.2s; gap: 12px; }
  .proj-item:hover { background: var(--hover); border-color: var(--border-strong); }
  .proj-name { font-family: 'Unbounded', sans-serif; font-size: 11px; color: #fff; margin-bottom: 4px; }
  .proj-desc { font-size: 11.5px; color: var(--muted); line-height: 1.55; }
  .proj-link { font-size: 10px; color: var(--muted-dim); font-family: monospace; margin-top: 4px; }

  /* education */
  .edu-item { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
  .edu-inst { font-family: 'Unbounded', sans-serif; font-size: 11px; color: #fff; line-height: 1.4; margin-bottom: 4px; }
  .edu-area { font-size: 12px; color: var(--muted); }
  .edu-date { font-size: 11px; color: var(--muted-dim); font-family: monospace; white-space: nowrap; }

  @media (max-width: 520px) { .job { padding: 16px; } .page { padding: 52px 16px 52px; } .job-head { flex-direction: column; gap: 4px; } }
`;

// ── Секции ────────────────────────────────────────────────────────────────────
const workHtml = (r.work || []).map((w) => `
  <div class="job">
    <div class="job-head">
      <div>
        <div class="job-title">${esc(w.position)}</div>
        <div class="job-company">${esc(w.name)}</div>
      </div>
      <div class="job-dates">${esc(w.startDate)}${w.endDate ? ' – ' + esc(w.endDate) : ' – н.в.'}</div>
    </div>
    ${w.summary ? `<div class="job-summary">${esc(w.summary)}</div>` : ''}
    ${(w.highlights || []).filter((h) => !h.startsWith('TODO')).length
      ? `<ul class="job-list">${(w.highlights || []).filter((h) => !h.startsWith('TODO')).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>`
      : ''}
  </div>`).join('');

const skillsHtml = (r.skills || []).map((s) => `
  <div class="skill-row">
    <div class="skill-head"><span class="skill-name">${esc(s.name)}</span></div>
    <div class="skill-kw">${(s.keywords || []).map((k) => `<span>${esc(k)}</span>`).join('')}</div>
  </div>`).join('');

const projectsHtml = (r.projects || []).map((p) => `
  <a class="proj-item" href="${esc(p.url)}" target="_blank" rel="noopener">
    <div>
      <div class="proj-name">${esc(p.name)}</div>
      <div class="proj-desc">${esc(p.description)}</div>
      <div class="proj-link">${esc(p.url)}</div>
    </div>
  </a>`).join('');

const educationHtml = (r.education || []).map((e) => `
  <div class="edu-item">
    <div>
      <div class="edu-inst">${esc(e.institution)}</div>
      <div class="edu-area">${esc(e.area)}${e.studyType ? ` · ${esc(e.studyType)}` : ''}</div>
    </div>
    <div class="edu-date">${esc(e.endDate || e.startDate || '')}</div>
  </div>`).join('');

const heroContacts = [
  r.basics.email ? `<a href="mailto:${esc(r.basics.email)}">${esc(r.basics.email)}</a>` : '',
  r.basics.url ? `<a href="${esc(r.basics.url)}" target="_blank">${esc(r.basics.url)}</a>` : '',
  r.basics.location?.city ? `<span>${esc(r.basics.location.city)}</span>` : '',
].filter(Boolean).join('');

const body = `
  ${HEADER_HTML('резюме')}

  <div class="content">

    <div class="section">
      <div class="hero">
        <div class="hero-name">${esc(r.basics.name)}</div>
        <div class="hero-label">${esc(r.basics.label)}</div>
        <div class="hero-contacts">${heroContacts}</div>
      </div>
      <div class="summary">${esc(r.basics.summary)}</div>
    </div>

    <div class="section">
      <div class="section-label">/ опыт</div>
      ${workHtml}
    </div>

    ${skillsHtml ? `
    <div class="section">
      <div class="section-label">/ навыки</div>
      ${skillsHtml}
    </div>` : ''}

    ${projectsHtml ? `
    <div class="section">
      <div class="section-label">/ проекты</div>
      ${projectsHtml}
    </div>` : ''}

    ${educationHtml ? `
    <div class="section">
      <div class="section-label">/ образование</div>
      ${educationHtml}
    </div>` : ''}

  </div>

  ${FOOTER_HTML}
`;

const html = wrap(`${esc(r.basics.name)} — резюме`, BASE_CSS + CSS, body);
const dir = join(ROOT, 'dist', 'resume');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'resume.html'), html);
console.log('✓ dist/resume/resume.html собран');
