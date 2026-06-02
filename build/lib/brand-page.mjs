// Общий шаблон дизайна витрин app.imiron.ru / book.imiron.ru.
// Тот же glassmorphism — Unbounded + Mulish, серый фон, grain-оверлей.

export const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

export const BASE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #858F93;
    --surface: rgba(255,255,255,0.13);
    --solid: #7a8488;
    --border: rgba(255,255,255,0.18);
    --border-strong: rgba(255,255,255,0.35);
    --text: #ffffff;
    --muted: rgba(255,255,255,0.6);
    --muted-dim: rgba(255,255,255,0.38);
    --hover: rgba(255,255,255,0.22);
  }
  html, body { min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Mulish', sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; }
  body::before { content: ''; position: fixed; inset: 0; background-image: ${GRAIN}; pointer-events: none; z-index: 0; opacity: 0.5; }
  .page { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 72px 24px 64px; }
  .header { display: flex; flex-direction: column; align-items: center; gap: 18px; margin-bottom: 48px; animation: fadeUp 0.65s ease both; }
  .avatar { width: 72px; height: 72px; border-radius: 50%; border: 1.5px solid var(--border); overflow: hidden; background: var(--solid); }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .brand { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .brand-logo { height: 26px; opacity: 0.9; }
  .tagline { font-family: 'Unbounded', sans-serif; font-size: 9px; font-weight: 300; letter-spacing: 0.28em; text-transform: uppercase; color: var(--muted); }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 24px 28px; display: flex; align-items: center; gap: 20px; text-decoration: none; color: inherit; transition: background 0.2s, border-color 0.2s, transform 0.18s; position: relative; overflow: hidden; }
  .card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.07), transparent 60%); opacity: 0; transition: opacity 0.25s; pointer-events: none; }
  .card:hover { background: var(--hover); border-color: var(--border-strong); transform: translateY(-2px); }
  .card:hover::before { opacity: 1; }
  .icon-box { width: 50px; height: 50px; border-radius: 12px; background: rgba(0,0,0,0.12); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s; }
  .card:hover .icon-box { border-color: var(--border-strong); }
  .icon-box svg { width: 22px; height: 22px; stroke: rgba(255,255,255,0.85); fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
  .card-body { flex: 1; min-width: 0; }
  .card-title { font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 400; color: #fff; margin-bottom: 5px; letter-spacing: 0.01em; line-height: 1.35; }
  .card-desc { font-size: 12.5px; color: var(--muted); line-height: 1.6; }
  .card-meta { font-size: 11px; color: var(--muted-dim); font-family: monospace; margin-top: 6px; letter-spacing: 0.02em; }
  .arrow { flex-shrink: 0; width: 30px; height: 30px; border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s, background 0.2s; }
  .card:hover .arrow { border-color: white; background: white; }
  .arrow svg { width: 13px; height: 13px; stroke: var(--muted); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.2s; }
  .card:hover .arrow svg { stroke: var(--bg); }
  .footer { margin-top: 56px; text-align: center; animation: fadeUp 0.65s 0.4s ease both; }
  .footer a { font-size: 12px; color: var(--muted); text-decoration: none; letter-spacing: 0.05em; transition: color 0.2s; }
  .footer a:hover { color: #fff; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 520px) { .card { padding: 18px; gap: 14px; } .arrow { display: none; } .page { padding: 52px 16px 52px; } }
`;

export const FONTS = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;600&family=Mulish:wght@300;400;600&display=swap" rel="stylesheet">
`;

export const HEADER_HTML = (tagline) => `
  <header class="header">
    <div class="avatar">
      <img src="https://imiron.ru/images/foto.svg" alt="Miron" onerror="this.style.display='none'">
    </div>
    <div class="brand">
      <img class="brand-logo" src="https://imiron.ru/images/title.svg" alt="iMiron"
           onerror="this.outerHTML='<span style=\\'font-family:Unbounded,sans-serif;font-size:18px;font-weight:400;letter-spacing:0.05em\\'>iMiron</span>'">
      <span class="tagline">${tagline}</span>
    </div>
  </header>
`;

export const FOOTER_HTML = `
  <footer class="footer">
    <a href="https://imiron.ru">← imiron.ru</a>
  </footer>
`;

export const ARROW_SVG = `<div class="arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>`;

// SVG-иконки по id
const ICONS = {
  'check-circle': `<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>`,
  'id-card': `<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/>`,
  'translit': `<path d="M4 6h7M7 4v2M9 6l3 6M6 12h6"/><path d="M13 6l4 10M15 14h4"/>`,
  'doc': `<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 10h8M8 14h5"/><path d="M8 6h4"/>`,
  'monitor': `<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M6 8h3m3 0h3M6 11h3m3 0h3"/>`,
  'tool': `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  'file-xml': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h4"/>`,
  'currency': `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  'layers': `<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>`,
  'square': `<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/>`,
  'bag': `<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/>`,
  'clock': `<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>`,
};

export function icon(id) {
  const paths = ICONS[id] || ICONS['tool'];
  return `<svg viewBox="0 0 24 24">${paths}</svg>`;
}

export function wrap(title, css, body) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${FONTS}
<style>${css}</style>
</head>
<body>
<div class="page">
${body}
</div>
</body>
</html>`;
}
