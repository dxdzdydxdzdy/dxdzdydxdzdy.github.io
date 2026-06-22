import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { Callout } from '@/components/ui/Callout/Callout';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { URLAnatomyDemo } from './URLAnatomyDemo';
import { URLJourneyDemo } from './URLJourneyDemo';
import { QUIZ_QUESTIONS } from './quizData';
import s from './WhatIsBrowserArticle.module.scss';

const HISTORY = [
  {
    year: '1990',
    name: 'WorldWideWeb',
    desc: 'Первый браузер — создал сам Тим Бернерс-Ли. Показывал только текст и некоторые изображения. Позже переименован в Nexus.',
  },
  {
    year: '1993',
    name: 'Mosaic',
    desc: 'Первый широко распространённый браузер с открытым кодом. Создан студентом Марком Андрессеном. Сделал веб визуальным.',
  },
  {
    year: '1994',
    name: 'Netscape Navigator',
    desc: 'Андрессен уходит из NCSA и создаёт Netscape — браузер с исправленными недостатками и поддержкой разных ОС. Быстро захватил 80% рынка.',
  },
  {
    year: '1994',
    name: 'Консорциум W3C',
    desc: 'CERN и MIT подписали соглашение об основании W3C. Задача — стандартизировать HTML. Без этого каждый браузер жил бы по своим правилам.',
  },
  {
    year: '1995',
    name: 'Internet Explorer',
    desc: 'Microsoft создаёт IE на основе кода Mosaic и предустанавливает его в Windows. К 2001 году — 96% рынка. Монополия остановила развитие веба на годы.',
  },
  {
    year: '2004',
    name: 'Firefox',
    desc: 'Mozilla (наследник Netscape) выпускает Firefox. За год — 100 млн загрузок. Конкуренция вернулась на рынок.',
  },
  {
    year: '2007',
    name: 'Safari',
    desc: 'Apple выпускает Safari. По сей день — единственный браузер на iOS: Apple требует использовать WebKit на всех iPhone.',
  },
  {
    year: '2008',
    name: 'Chrome',
    desc: 'Google выпускает Chrome с быстрым движком V8. Меняет ожидания по скорости JavaScript. Постепенно становится лидером рынка.',
  },
  {
    year: '2015',
    name: 'Edge',
    desc: 'Microsoft закрывает IE и выпускает Edge. В 2020 году переписывает его на движке Chromium — том же, что у Chrome.',
  },
];

export function WhatIsBrowserArticle() {
  return (
    <div className={s.article}>

      {/* ── 1. Как всё начиналось ────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Как всё начиналось</SectionTitle>
        <p className={s.lead}>
          1989 год, Швейцария. Тим Бернерс-Ли — сотрудник ядерного исследовательского центра CERN.
          Учёные из разных стран работали вместе, но обмен документами был неудобным.
          Тим предложил решение: система электронных документов, связанных между собой ссылками.
        </p>
        <p className={s.body}>
          Идея была в том, чтобы обернуть текст специальными словами-ключами,
          по которым программа поймёт — этот кусок нужно показать жирным, этот крупным,
          а этот сделать ссылкой на другой документ.
          Такие обёртки назвали <strong>тегами</strong>.
        </p>
        <p className={s.body}>
          Язык из этих тегов получил название <strong>HTML</strong> —
          HyperText Markup Language, язык гипертекстовой разметки.
          Документы получили расширения <code>.htm</code> и <code>.html</code>.
          Первая версия языка содержала всего 18 тегов.
        </p>
        <CodeHighlight lang="html" code={`<!-- Тег оборачивает текст и говорит браузеру как его показать -->

<h1>Большой заголовок</h1>
<p>Обычный абзац текста.</p>
<b>Жирный текст</b>
<a href="other-doc.html">Ссылка на другой документ</a>

<!-- Без браузера это просто текст с угловыми скобками.
     Браузер читает теги и показывает форматирование. -->`} />
      </section>

      {/* ── 2. Зачем нужен браузер ──────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Зачем нужен браузер</SectionTitle>
        <p className={s.lead}>
          HTML-документ с тегами — это просто текст. Чтобы теги не были видны,
          а вместо них отображалось форматирование, нужна специальная программа.
          Такую программу назвали <strong>браузером</strong>.
        </p>
        <p className={s.body}>
          Браузер читает HTML-теги и показывает результат: вместо{' '}
          <code>&lt;h1&gt;</code> — большой заголовок, вместо{' '}
          <code>&lt;b&gt;</code> — жирный текст, вместо{' '}
          <code>&lt;a&gt;</code> — кликабельную ссылку, вместо{' '}
          <code>&lt;img&gt;</code> — картинку.
        </p>
        <p className={s.body}>
          Первый браузер появился в 1990 году — его создал сам Тим Бернерс-Ли.
          Назывался <strong>WorldWideWeb</strong>, позже переименован в Nexus.
          Умел показывать только текст и некоторые изображения.
          Но для старта того интернета, который мы знаем сейчас, этого было достаточно.
        </p>
        <Callout variant="accent">
          Тим Бернерс-Ли в одиночку придумал всё сразу: HTML (язык разметки),
          браузер (программу для просмотра), HTTP (протокол передачи данных)
          и URL (формат адресов). В 1994 году он основал консорциум W3C —
          организацию по стандартизации веба, которая работает по сей день.
        </Callout>
      </section>

      {/* ── 3. История браузеров ─────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>История: от Nexus до Chrome</SectionTitle>
        <p className={s.body}>
          Идею быстро подхватили крупные компании — каждая пыталась занять лидерство
          и реализовала собственный набор HTML-тегов. Это означало: страница,
          написанная под один браузер, некорректно отображалась в другом.
          Консорциум W3C появился именно для того, чтобы этого не произошло.
        </p>
        <div className={s.timeline}>
          {HISTORY.map(item => (
            <div key={item.year + item.name} className={s.timelineItem}>
              <div className={s.timelineYear}>{item.year}</div>
              <div className={s.timelineBody}>
                <div className={s.timelineName}>{item.name}</div>
                <div className={s.timelineDesc}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={s.callout}>
          <div className={s.calloutLabel}>ВОЙНЫ БРАУЗЕРОВ — КРАТКО</div>
          <div className={s.calloutText}>
            Войны шли дважды. Первая (1995–2001): Netscape против IE — Microsoft победил,
            просто предустановив IE в Windows. Netscape умер. Вторая (2008–2020): Chrome против всех —
            Google победил скоростью и маркетингом через Google.com.
            Монополии вредят: когда IE занимал 96% рынка, веб годами стоял без новых стандартов.
          </div>
        </div>
      </section>

      {/* ── 4. Где хранятся сайты ───────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Где хранятся сайты</SectionTitle>
        <p className={s.lead}>
          Браузер умеет отображать HTML. Но где хранятся сами файлы с HTML?
        </p>
        <p className={s.body}>
          На <strong>веб-серверах</strong> — это мощные компьютеры, подключённые к интернету
          круглосуточно. Их миллионы по всему миру. У каждого есть числовой адрес — IP.
          Именно к одному из них и обращается твой браузер, когда ты открываешь сайт.
        </p>
        <p className={s.body}>
          Чтобы браузер и сервер понимали друг друга, им нужен общий язык — <strong>протокол</strong>.
          Его тоже придумал Тим Бернерс-Ли и назвал <strong>HTTP</strong>
          (HyperText Transfer Protocol — протокол передачи гипертекста).
        </p>
        <div className={s.twoCols}>
          <div className={s.colCard}>
            <div className={s.colTitle}>// браузер → серверу</div>
            <ul className={s.colList}>
              <li className={s.colItemOk}>Дай мне страницу /courses/html</li>
              <li className={s.colItemOk}>Мой язык: русский</li>
              <li className={s.colItemOk}>Я — Chrome 125 на Windows</li>
            </ul>
          </div>
          <div className={s.colCard}>
            <div className={s.colTitle} style={{ color: '#4db8ff' }}>// сервер → браузеру</div>
            <ul className={s.colList}>
              <li className={s.colItemOk}>Статус: 200 OK — нашёл страницу</li>
              <li className={s.colItemOk}>Тип файла: text/html</li>
              <li className={s.colItemOk}>Содержимое: &lt;!DOCTYPE html&gt;...</li>
            </ul>
          </div>
        </div>
        <p className={s.body}>
          Если страница существует — сервер вернёт код <strong>200</strong> и HTML.
          Если нет — <strong>404</strong>. Код <strong>301</strong> — страница переехала.
          <strong> 500</strong> — что-то сломалось на сервере. Коды от 200 до 599 — это стандартные
          ответы, которые сервер отправляет браузеру на любой запрос.
        </p>
      </section>

      {/* ── 5. Из чего состоит адрес сайта ──────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Из чего состоит адрес сайта</SectionTitle>
        <p className={s.body}>
          Тим Бернерс-Ли придумал и формат адресов — <strong>URL</strong>.
          Это не просто набор символов: каждая часть несёт свой смысл.
          Кликни на любую — узнаешь что она означает:
        </p>
        <URLAnatomyDemo />
        <p className={s.body}>
          Большинство частей необязательны. В повседневной жизни ты видишь только домен и путь —
          остальное браузер либо скрывает, либо добавляет сам.
        </p>
      </section>

      {/* ── 6. Что происходит после Enter ───────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Что происходит после нажатия Enter</SectionTitle>
        <p className={s.body}>
          Ты ввёл адрес и нажал Enter. Браузер берёт URL из адресной строки,
          выделяет доменный адрес и начинает цепочку шагов — прежде чем страница
          появится на экране. Пройди по каждому:
        </p>
        <URLJourneyDemo />
      </section>

      {/* ── Quiz ─────────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Проверь себя</SectionTitle>
        <QuizBlock questions={QUIZ_QUESTIONS} />
      </section>

    </div>
  );
}
