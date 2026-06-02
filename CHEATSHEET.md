# Шпаргалка

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

## Где лежат собранные HTML

Каждый пуш создаёт [релиз](https://github.com/iMironRU/imiron-brand/releases/latest) с ZIP-архивами.
Скачай нужный архив и распакуй на хостинг вручную.

| Архив в релизе | Что внутри | Куда распаковывать |
|---|---|---|
| `site.zip` | `index.html` | корень `imiron.ru/public_html/` |
| `app.zip` | `index.html` | `app.imiron.ru/public_html/` |
| `book.zip` | `index.html` | `book.imiron.ru/public_html/` |
| `resume.zip` | `resume.html` | куда удобно |
| `portfolio.zip` | `index.html` | куда удобно |
