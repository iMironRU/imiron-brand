// Сборка README.md профиля GitHub (iMironRU/iMironRU) из источников.
// Запуск: node build/build-github-profile.mjs > dist/github-profile/README.md
import { loadJSON, filterForTarget, titleFor } from './lib/data.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/data.mjs';

const TARGET = 'github-profile';
const identity = loadJSON('identity.json');
const contacts = loadJSON('contacts.json');
const skills = loadJSON('skills.json');
const projects = loadJSON('projects.json');
const books = loadJSON('books.json');

const STATUS_LABEL = { wip: 'в работе', draft: 'черновик', published: 'опубликовано' };
const FORMAT_LABEL = { book: 'книга', longread: 'лонгрид', reference: 'справочник', guide: 'руководство', article: 'статья' };

const out = [];
out.push(`# 👋 Привет, я ${identity.shortName}`);
out.push('');
out.push(`**${titleFor(identity, TARGET)}**`);
out.push('');
out.push(`> ${identity.epigraph}`);
out.push('');
out.push(identity.channelDescription);
out.push('');

out.push('## 🛠 Стек');
out.push('');
for (const g of filterForTarget(skills.groups, TARGET)) {
  out.push(`**${g.name}** — ${g.keywords.join(', ')}`);
  out.push('');
}

out.push('## 📂 Проекты');
out.push('');
for (const p of filterForTarget(projects.projects, TARGET).filter((p) => p.featured)) {
  out.push(`- **[${p.name}](${p.url})** — ${p.tagline}.`);
}
out.push('');

const ownBooks = filterForTarget(books.books.filter((b) => b.kind === 'own'), TARGET);
if (ownBooks.length) {
  out.push('## 📚 Книги и материалы');
  out.push('');
  out.push('Пишу про 1С для разработчиков — и для тех, кто приходит на платформу с других стеков.');
  out.push('');
  for (const b of ownBooks) {
    const fmt = FORMAT_LABEL[b.format] ?? b.format ?? '';
    const status = STATUS_LABEL[b.status] ?? b.status ?? '';
    const meta = [fmt, status].filter(Boolean).join(', ');
    const suffix = meta ? ` _(${meta})_` : '';
    out.push(`- **[${b.title}](${b.url})** — ${b.description}${suffix}`);
  }
  out.push('');
}

out.push('## 🤝 Где меня найти');
out.push('');
if (identity.resumeUrl) {
  out.push(`- 📄 Резюме: [imiron.ru/resume](${identity.resumeUrl})`);
}
for (const c of filterForTarget(contacts.channels, TARGET).filter((c) => c.active !== false)) {
  const link = c.url ? `[${c.handle || c.label}](${c.url})` : (c.value || c.handle);
  out.push(`- ${c.label}: ${link}`);
}
out.push('');
if (contacts.support) {
  out.push(`## ☕ ${contacts.support.label}`);
  out.push('');
  out.push(`[Поддержать](${contacts.support.url})`);
  out.push('');
}

const dir = join(ROOT, 'dist', 'github-profile');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'README.md'), out.join('\n'));
console.log('✓ dist/github-profile/README.md собран');
