// Валидация всех data/*.json против схем из schema/.
// Запуск: node build/validate.mjs   (нужен ajv: npm i)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { DATA, ROOT } from './lib/data.mjs';

let Ajv;
try { Ajv = (await import('ajv')).default; }
catch { console.error('Установите зависимости: npm i'); process.exit(1); }

const ajv = new Ajv({ allErrors: true, strict: false });
const SCHEMA = join(ROOT, 'schema');
let ok = true;

for (const f of readdirSync(DATA).filter((f) => f.endsWith('.json'))) {
  const name = basename(f, '.json');
  const schemaPath = join(SCHEMA, `${name}.schema.json`);
  const data = JSON.parse(readFileSync(join(DATA, f), 'utf8'));
  if (!existsSync(schemaPath)) { console.log(`• ${f}: схемы нет, пропуск`); continue; }
  const validate = ajv.compile(JSON.parse(readFileSync(schemaPath, 'utf8')));
  if (validate(data)) console.log(`✓ ${f}`);
  else { ok = false; console.error(`✗ ${f}`, validate.errors); }
}
process.exit(ok ? 0 : 1);
