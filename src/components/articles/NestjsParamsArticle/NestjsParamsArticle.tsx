import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { Callout } from '@/components/ui/Callout/Callout';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { HomeworkBlock } from '@/components/ui/HomeworkBlock/HomeworkBlock';
import { ParamDecoratorDemo } from './ParamDecoratorDemo';
import { QUIZ_QUESTIONS } from './quizData';
import s from './NestjsParamsArticle.module.scss';

const DECO_ROWS = [
  {
    deco: '@Param(key?)',
    desc: <><code>@Param(\'id\')</code> — один сегмент, <code>@Param()</code> — все сегменты объектом.</>,
    source: 'URL-путь: /movies/:id',
  },
  {
    deco: '@Query(key?)',
    desc: <><code>@Query(\'page\')</code> — один параметр, <code>@Query()</code> — все как объект.</>,
    source: 'Query: ?page=2&sort=asc',
  },
  {
    deco: '@Body(key?)',
    desc: <><code>@Body(\'title\')</code> — одно поле, <code>@Body()</code> — весь объект тела.</>,
    source: 'Тело запроса (JSON)',
  },
  {
    deco: '@Headers(key?)',
    desc: <><code>@Headers(\'user-agent\')</code> — один заголовок, <code>@Headers()</code> — все.</>,
    source: 'HTTP-заголовки',
  },
  {
    deco: '@Req()',
    desc: 'Весь объект запроса Express/Fastify. Используй только когда других декораторов не хватает.',
    source: 'Объект Request',
  },
  {
    deco: '@Res()',
    desc: 'Объект ответа. После его использования NestJS отключает авторматическую отправку — отвечай вручную.',
    source: 'Объект Response',
  },
  {
    deco: '@Ip()',
    desc: 'IP-адрес клиента из req.ip.',
    source: 'req.ip',
  },
  {
    deco: '@Session()',
    desc: 'Объект сессии из req.session. Требует подключения express-session.',
    source: 'req.session',
  },
];

export function NestjsParamsArticle() {
  return (
    <div className={s.article}>

      {/* ── 1. Что это и зачем ───────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Декораторы параметров — что это и зачем</SectionTitle>
        <p className={s.lead}>
          Когда в контроллер приходит HTTP-запрос, внутри него есть много данных:
          URL с параметрами, тело запроса, заголовки, cookies. В чистом Express
          всё это лежит в объекте <code>req</code> — и ты сам пишешь
          <code> req.query.page</code>, <code>req.body.title</code> и т.д.
        </p>
        <p className={s.body}>
          NestJS предлагает другой подход: <strong>специальный декоратор для каждой
          части запроса</strong>. Вместо того чтобы доставать данные из
          <code> req</code> вручную — объявляешь что именно тебе нужно прямо
          в сигнатуре метода.
        </p>
        <div className={s.compare}>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.bad}`}>// Express — вручную</div>
            <div className={s.compareBody}>
              <code>{`app.get('/movies', (req, res) => {
  const page  = req.query.page;
  const genre = req.query.genre;
  // ...
});`}</code>
            </div>
          </div>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.good}`}>// NestJS — декораторами</div>
            <div className={s.compareBody}>
              <code>{`@Get()
findAll(
  @Query('page')  page:  string,
  @Query('genre') genre: string,
) {}`}</code>
            </div>
          </div>
        </div>
        <Callout variant="info">
          Декораторы параметров делают сигнатуру метода читаемым контрактом: сразу видно,
          какие данные метод ожидает из запроса.
        </Callout>
      </section>

      {/* ── 2. Обзорная таблица ──────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Все декораторы — обзор</SectionTitle>
        <div className={s.decoTable}>
          <div className={s.decoHead}>
            <div className={s.decoHCell}>Декоратор</div>
            <div className={s.decoHCell}>Что делает</div>
            <div className={s.decoHCell}>Откуда берёт</div>
          </div>
          {DECO_ROWS.map(r => (
            <div key={r.deco} className={s.decoRow}>
              <div className={s.decoDeco}>{r.deco}</div>
              <div className={s.decoDesc}>{r.desc}</div>
              <div className={s.decoSource}>{r.source}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Интерактивное демо ────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Попробуй сам — выбери декоратор</SectionTitle>
        <p className={s.body}>
          Ниже — один и тот же HTTP-запрос. Нажми на декоратор и посмотри
          какую часть запроса он извлечёт:
        </p>
        <ParamDecoratorDemo />
      </section>

      {/* ── 4. @Query ────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>@Query — query-параметры</SectionTitle>
        <p className={s.body}>
          Query-параметры — это часть URL после знака <code>?</code>.
          Используются для фильтрации, сортировки и пагинации.
        </p>
        <CodeHighlight code={`// GET /movies?genre=action&year=2024

@Get()
findAll(
  @Query('genre') genre: string,    // 'action'
  @Query('year')  year:  string,    // '2024'
) {
  if (genre) return \`Фильмы в жанре \${genre}\`;
  return [];
}

// Получить сразу все параметры одним объектом:
@Get()
findAll(@Query() query: { genre?: string; year?: string }) {
  return JSON.stringify(query); // { genre: 'action', year: '2024' }
}`} />
        <Callout variant="warn">
          Все query-параметры приходят как <strong>строки</strong>, даже если передать цифру.
          <code>?page=2</code> → <code>page === '2'</code>, не <code>2</code>.
          Для автоматической конвертации используй <code>ValidationPipe</code> с <code>transform: true</code>.
        </Callout>
      </section>

      {/* ── 5. @Body ─────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>@Body — тело запроса</SectionTitle>
        <p className={s.body}>
          Тело запроса используется в POST, PUT, PATCH — когда нужно передать
          данные для создания или изменения ресурса.
        </p>
        <CodeHighlight code={`// POST /movies
// Body: { "title": "Fight Club", "genre": "drama" }

// Вариант 1 — одно поле:
@Post()
create(@Body('title') title: string) {
  return \`Фильм "\${title}" добавлен\`;
}

// Вариант 2 — весь объект (через DTO):
@Post()
create(@Body() body: { title: string; genre: string }) {
  return body; // { title: 'Fight Club', genre: 'drama' }
}`} />
        <Callout variant="info">
          В реальных проектах вместо <code>{'{ title: string; genre: string }'}</code> используют DTO-класс
          с декораторами валидации. Мы уже разбирали это в статье про валидацию.
        </Callout>
      </section>

      {/* ── 6. @Param ────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>@Param — динамические сегменты URL</SectionTitle>
        <p className={s.body}>
          Динамические сегменты — части URL с двоеточием: <code>/movies/:id</code>.
          Значение меняется от запроса к запросу, но имя параметра фиксировано.
        </p>
        <CodeHighlight code={`// GET /movies/42
@Get(':id')
findOne(@Param('id') id: string) {
  return { id }; // { id: '42' }
}

// Несколько параметров:
// GET /movies/5/reviews/3
@Get(':movieId/reviews/:reviewId')
findReview(
  @Param('movieId')   movieId:   string,  // '5'
  @Param('reviewId')  reviewId:  string,  // '3'
) {}

// Все параметры объектом:
@Get(':movieId/reviews/:reviewId')
findReview(@Param() params: Record<string, string>) {
  // params = { movieId: '5', reviewId: '3' }
}`} />
      </section>

      {/* ── 7. @Headers ──────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>@Headers — HTTP-заголовки</SectionTitle>
        <p className={s.body}>
          Заголовки содержат метаданные запроса: тип контента, токен авторизации,
          информацию о браузере и т.д.
        </p>
        <CodeHighlight code={`// Получить конкретный заголовок:
@Get('user-agent')
getUserAgent(@Headers('user-agent') ua: string) {
  return \`Браузер: \${ua}\`;
}

// Получить все заголовки:
@Get('headers')
getAllHeaders(@Headers() headers: Record<string, string>) {
  return headers;
  // { 'content-type': 'application/json', 'user-agent': '...', ... }
}`} />
      </section>

      {/* ── 8. @Req и @Res ───────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>@Req и @Res — сырые объекты запроса и ответа</SectionTitle>
        <p className={s.body}>
          Когда специальных декораторов не хватает — можно получить весь объект
          запроса через <code>@Req()</code> и объект ответа через <code>@Res()</code>.
        </p>
        <CodeHighlight code={`import { type Request, type Response } from 'express';

@Get('details')
getDetails(@Req() req: Request) {
  return {
    method:  req.method,
    url:     req.url,
    headers: req.headers,
    query:   req.query,
  };
}

@Get('manual')
manualResponse(@Res() res: Response) {
  res.status(200).json({ message: 'hello' });
  // return здесь писать не нужно — NestJS отключил авто-ответ
}`} />
        <Callout variant="warn">
          <strong>@Req() и @Res() — крайний случай.</strong> Они привязывают контроллер к
          конкретному HTTP-фреймворку (Express или Fastify). При смене платформы или в юнит-тестах
          придётся мокировать весь объект целиком. Используй их только когда
          других декораторов действительно не хватает — например для работы с cookies или потоками.
        </Callout>
      </section>

      {/* ── 9. Quiz ───────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Проверь себя</SectionTitle>
        <QuizBlock questions={QUIZ_QUESTIONS} />
      </section>

      {/* ── 10. Практика ─────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Практика</SectionTitle>
        <HomeworkBlock items={[
          <>В BooksController добавь метод <code>search</code> — GET /books/search. Он должен принимать query-параметры <code>title</code> и <code>author</code> и возвращать строку с их значениями.</>,
          <>Добавь маршрут GET /books/:bookId/chapters/:chapterId. Получи оба параметра через @Param() одним объектом и верни их в ответе.</>,
          <>Добавь POST /books. Принимай в теле поля <code>title</code> (string) и <code>year</code> (number). Верни объект с этими полями и сообщением "книга добавлена".</>,
          <>Добавь метод, который возвращает заголовок <code>user-agent</code> входящего запроса. Протестируй через Postman или браузер.</>,
        ]} />
      </section>

    </div>
  );
}
