// Сборщик главной витрины imiron.ru — линктри-лендинг.
// Дизайн: серый фон #858F93, аватар + лого + соцсети + ссылки на субдомены.
// Ассеты (фото, лого, соцроконки, фавиконки) лежат в assets/images/ репозитория
// и копируются в dist/site/images/ — деплоятся на Pages вместе с сайтом.
import { loadJSON, ROOT } from './lib/data.mjs';
import { mkdirSync, writeFileSync, existsSync, cpSync } from 'node:fs';
import { join } from 'node:path';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const contacts = loadJSON('contacts.json');

// Маппинг id-канала → имя SVG-иконки на imiron.ru/images/social/
const ICON_MAP = {
  'youtube': 'youtube',
  'vk': 'vk',
  'telegram-contact': 'telegramm',
  'blog': 'teletype',
  'dzen': 'dzen',
};

// Только каналы с иконкой и target=site
const socialChannels = contacts.channels.filter(
  (ch) => ICON_MAP[ch.id] && (!ch.targets || ch.targets.includes('site') || ch.targets.includes('all'))
);

const socialItems = socialChannels.map((ch) => `
      <li class="social__item">
        <a class="social__link" href="${esc(ch.url)}" target="_blank" rel="noopener">
          <img class="social__img" width="61" height="61" src="https://imiron.ru/images/social/${ICON_MAP[ch.id]}.svg" alt="${esc(ch.label)}">
        </a>
      </li>`).join('');

const html = `<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Miron</title>
  <link rel="apple-touch-icon" sizes="180x180" href="https://imiron.ru/images/favicon/apple-touch-icon.png">
  <link rel="shortcut icon" href="https://imiron.ru/images/favicon/favicon.ico" type="image/x-icon">
  <link rel="icon" type="image/png" sizes="192x192" href="https://imiron.ru/images/favicon/favicon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="https://imiron.ru/images/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="https://imiron.ru/images/favicon/favicon-16x16.png">

  <meta name="zen-verification" content="TiJJwmxqgvi2azgB1UNyxJdzlF08WIZmrGIrHLYD4QLfxuWANCFrEjyNNxFoX0MD" />

  <style>
    html{-webkit-box-sizing:border-box;box-sizing:border-box}*,*::after,*::before{-webkit-box-sizing:inherit;box-sizing:inherit}ul,ol{padding:0}a{text-decoration:none;color:inherit}body,h1,h2,h3,h4,h5,h6,p,ul,ol,li,figure,figcaption,blockquote,dl,dd{margin:0}ul{list-style:none}img{max-width:100%;display:block}input,button,textarea,select{font:inherit;color:inherit;border-radius:none;background-color:inherit;padding:0}html,body{height:100%}body{background-color:#858F93}img{max-width:100%;-o-object-fit:cover;object-fit:cover}.main{height:100%}.miron{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;min-height:100%;padding:50px 15px}@media (max-width: 576px), (orientation: landscape) and (max-height: 576px){.miron{padding:15px}}.miron__link{display:block;margin-bottom:30px}@media (max-width: 576px), (orientation: landscape) and (max-height: 576px){.miron__link{margin-bottom:25px}}.miron__foto{max-width:163px;width:100%;height:auto}@media (max-width: 576px), (orientation: landscape) and (max-height: 576px){.miron__foto{max-width:120px}}.miron__logo{width:100%;max-width:522px;height:auto}@media (max-width: 576px), (orientation: landscape) and (max-height: 576px){.miron__logo{max-width:300px}}.social{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.social__item:not(:last-child){margin-right:28px}@media (max-width: 576px), (orientation: landscape) and (max-height: 576px){.social__item:not(:last-child){margin-right:15px}}.social__link{display:block}.social__img{max-width:61px;height:auto;width:100%}@media (max-width: 576px), (orientation: landscape) and (max-height: 576px){.social__img{max-width:43px}}
    .mylinks{margin-top:22px;display:flex;align-items:center;gap:10px}
    .mylinks a{font-size:11px;letter-spacing:0.1em;opacity:0.4;transition:opacity 0.2s}
    .mylinks a:hover{opacity:0.8}
    .mylinks span{opacity:0.2;font-size:11px}
  </style>
</head>

<body>

<main class="main">
  <section class="miron">
    <a class="miron__link" href="#">
      <img class="miron__foto" src="https://imiron.ru/images/foto.svg" width="163" height="163" alt="avatar">
    </a>
    <a class="miron__link" href="#">
      <img class="miron__logo" src="https://imiron.ru/images/title.svg" width="522" height="126" alt="iMiron">
    </a>

    <ul class="miron__social social">
      ${socialItems}
    </ul>

    <div class="mylinks">
      <a href="https://app.imiron.ru">{приложения что я сделал}</a>
      <span>·</span>
      <a href="/book">{книги — пишу и читаю}</a>
    </div>
  </section>
</main>

</body>
</html>`;

const dir = join(ROOT, 'dist', 'site');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.html'), html);
// Кастомный домен GitHub Pages — imiron.ru отдаётся с корня imironru.github.io.
writeFileSync(join(dir, 'CNAME'), 'imiron.ru\n');

// Ассеты imiron.ru/images/* — копируем из репозитория в сборку.
const assetsDir = join(ROOT, 'assets', 'images');
if (existsSync(assetsDir)) {
  cpSync(assetsDir, join(dir, 'images'), { recursive: true });
  console.log('✓ dist/site/index.html + CNAME + images собран');
} else {
  console.log('✓ dist/site/index.html + CNAME собран (assets/images/ пока нет)');
}
