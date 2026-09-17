// Счётчик Яндекс.Метрики для imiron.ru. Один счётчик на весь домен:
// главная, /portfolio, /book, /app и резюме — это разделы одного сайта.
export const METRIKA_ID = 95360763;

export const METRIKA_SNIPPET = `<!-- Yandex.Metrika counter -->
<script type="text/javascript">
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}','ym');
ym(${METRIKA_ID},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/${METRIKA_ID}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->`;
