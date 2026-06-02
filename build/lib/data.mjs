// Общие хелперы сборки: загрузка данных и фильтрация по маркеру площадки (target).
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..', '..');
export const DATA = join(ROOT, 'data');
export const CONTENT = join(ROOT, 'content');

export function loadJSON(file) {
  return JSON.parse(readFileSync(join(DATA, file), 'utf8'));
}

// Подходит ли элемент данной площадке.
// Нет targets, или содержит 'all', или содержит сам target.
export function forTarget(item, target) {
  const t = item.targets;
  if (!t || t.length === 0) return !t; // нет поля -> везде; пустой массив -> нигде
  return t.includes('all') || t.includes(target);
}

export function filterForTarget(items, target) {
  return items.filter((i) => forTarget(i, target));
}

// Канонический титул под площадку из identity.titleByTarget.
export function titleFor(identity, target) {
  const key = identity.titleByTarget?.[target] || 'formal';
  return identity.titles[key];
}

// Чтение markdown с YAML-фронтматтером (минимальный парсер: targets и прочее).
export function readContent(relPath) {
  const raw = readFileSync(join(CONTENT, relPath), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      let v = kv[2].trim();
      if (v.startsWith('[') && v.endsWith(']')) {
        v = v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
      }
      meta[kv[1]] = v;
    }
  }
  return { meta, body: m[2] };
}
