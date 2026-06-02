# imiron-brand

**Единый источник истины для личного бренда [iMironRU](https://github.com/iMironRU).**
Один источник — много представлений. Контент о владельце пишется один раз и
собирается в витрины: профиль GitHub, GitHub Pages / imiron.ru, резюме, Хабр, Инфостарт.

## Принцип

- Факты (контакты, стек, проекты, кейсы, опыт, резюме) — только в `data/*.json`.
- Нарративы (биография, портрет) — только в `content/`.
- Витрины **генерируются** сборщиками. Готовые артефакты руками не правятся —
  правка идёт в источник, затем пересборка.
- Что куда идёт — задаёт поле `targets` (маркеры площадок). `["all"]` — во все;
  отсутствие поля — везде; `[]` — никуда.

## Структура

```
data/        источники (JSON): identity, contacts, skills, projects, cases, apps, books, resume
content/     нарративы (Markdown): bio-short / bio-medium / bio-long (портрет)
schema/      JSON Schema на каждый источник
build/        сборщики (Node.js, ESM) + lib/ + validate.mjs
targets/     шаблоны/ассеты витрин
dist/        результат сборки (gitignored)
```

## Команды

```bash
npm i                 # зависимости (ajv)
npm run validate      # проверить data/ по схемам
npm run build         # собрать профиль GitHub + резюме
npm run build:profile # только README профиля
npm run build:resume  # только резюме (HTML, дальше → PDF)
```

## Витрины и маркеры

| Маркер           | Витрина                         | Сборщик                     |
| ---------------- | ------------------------------- | --------------------------- |
| `github-profile` | README профиля iMironRU         | build-github-profile.mjs ✅ |
| `resume`         | резюме (JSON Resume → HTML/PDF)  | build-resume.mjs ✅         |
| `github-pages`   | imironru.github.io (= imiron.ru) | build-github-pages.mjs 🚧   |
| `habr`           | профиль/манифест на Хабре        | build-habr.mjs 🚧           |
| `infostart`      | профиль на Инфостарте            | build-infostart.mjs 🚧      |

`imiron.ru` подключается к GitHub Pages кастомным доменом (файл `CNAME`).

## Лицензия

CC BY-SA 4.0 · [@iMironRU](https://github.com/iMironRU)
