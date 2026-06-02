# imiron-brand

Единый источник всего, что написано обо мне — **Александре Мирошниченко (iMironRU)**.

Данные живут здесь один раз. Сборщики разносят их по витринам автоматически при каждом пуше.

## Что здесь публикуется

| Витрина | Адрес | Что |
|---|---|---|
| Лендинг | [imiron.ru](https://imiron.ru) · [imironru.github.io](https://imironru.github.io) | Главная страница |
| Приложения | [app.imiron.ru](https://app.imiron.ru) · [imironru.github.io/app/](https://imironru.github.io/app/) | Онлайн-инструменты и расширения 1С |
| Книги | [book.imiron.ru](https://book.imiron.ru) · [imironru.github.io/book/](https://imironru.github.io/book/) | Рекомендованные книги |
| Портфолио | [imironru.github.io/portfolio/](https://imironru.github.io/portfolio/) | Проекты, стек, кейсы, контакты |
| Резюме | [imironru.github.io/imiron-brand/resume/](https://imironru.github.io/imiron-brand/resume/resume.html) | HTML-резюме |
| Профиль GitHub | [github.com/iMironRU](https://github.com/iMironRU) | README профиля |

## Где лежат собранные HTML

После каждого пуша GitHub Actions собирает и раскладывает файлы по репозиториям.
Если нужно скопировать вручную — все готовые файлы живут в ветке и репозиториях витрин:

| Файл | Ветка / репозиторий |
|---|---|
| `index.html` (лендинг) | [iMironRU/imironru.github.io](https://github.com/iMironRU/imironru.github.io) — корень |
| `app/index.html` | [iMironRU/imironru.github.io](https://github.com/iMironRU/imironru.github.io) — папка `app/` |
| `book/index.html` | [iMironRU/imironru.github.io](https://github.com/iMironRU/imironru.github.io) — папка `book/` |
| `portfolio/index.html` | [iMironRU/imironru.github.io](https://github.com/iMironRU/imironru.github.io) — папка `portfolio/` |
| `resume/resume.html` | [iMironRU/imiron-brand](https://github.com/iMironRU/imiron-brand/tree/gh-pages) — ветка `gh-pages` |
| `README.md` (профиль) | [iMironRU/iMironRU](https://github.com/iMironRU/iMironRU) — корень |

## Как поменять что-то о себе

Правишь нужный файл прямо через веб-интерфейс GitHub — сборка запускается автоматически.

| Что менять | Файл |
|---|---|
| Контакты, соцсети | [`data/contacts.json`](data/contacts.json) |
| Проекты | [`data/projects.json`](data/projects.json) |
| Стек и навыки | [`data/skills.json`](data/skills.json) |
| Кейсы | [`data/cases.json`](data/cases.json) |
| Приложения и расширения 1С | [`data/apps.json`](data/apps.json) |
| Книги | [`data/books.json`](data/books.json) |
| Резюме | [`data/resume.json`](data/resume.json) |
| О себе (кто я, эпиграф, титулы) | [`data/identity.json`](data/identity.json) |
| Биография (текст) | [`content/bio/`](content/bio/) |

## Лицензия

CC BY-SA 4.0 · [iMironRU](https://github.com/iMironRU)
