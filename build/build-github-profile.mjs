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

out.push('## 🤝 Где меня найти');
out.push('');
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
