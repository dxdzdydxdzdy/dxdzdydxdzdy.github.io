import s from './NestjsPractice1Article.module.scss';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';

type Req = { text: React.ReactNode };

function Task({
  num, title, desc, reqs, result, hint, star = false,
}: {
  num: string;
  title: string;
  desc?: React.ReactNode;
  reqs: Req[];
  result?: React.ReactNode;
  hint?: React.ReactNode;
  star?: boolean;
}) {
  return (
    <div className={`${s.task}${star ? ` ${s.taskStar}` : ''}`}>
      <div className={`${s.taskHead}${star ? ` ${s.taskHeadStar}` : ''}`}>
        <span className={s.taskNum}>{num}</span>
        <span className={s.taskTitle}>{title}</span>
        {star && <span className={s.starBadge}>★</span>}
      </div>
      <div className={s.taskBody}>
        {desc && <p className={s.taskDesc}>{desc}</p>}
        <div className={s.reqList}>
          <span className={s.reqLabel}>требования</span>
          {reqs.map((r, i) => (
            <div key={i} className={s.req}>{r.text}</div>
          ))}
        </div>
        {result && (
          <div className={s.resultBlock}>
            <span className={s.resultLabel}>ожидаемый результат</span>
            <div className={s.resultText}>{result}</div>
          </div>
        )}
        {hint && <div className={s.hintBlock}><span className={s.hintContent}>{hint}</span></div>}
      </div>
    </div>
  );
}

export function NestjsPractice1Article() {
  return (
    <article className={s.article}>

      {/* ── Intro ── */}
      <section className={s.intro}>
        <p className={s.lead}>
          Закрепляем всё пройденное — от декораторов до репозитория.
          Задача: построить API книжного магазина <strong>BookStore</strong> с нуля.
          Никаких подсказок с готовым кодом — только условия и ожидаемый результат.
        </p>
        <p className={s.lead}>
          В итоге должны работать эти эндпоинты:
        </p>
        <div className={s.endpoints}>
          {([
            { m: 'GET',    cls: 'get',    p: '/api/books',             n: 'все книги, можно фильтровать' },
            { m: 'GET',    cls: 'get',    p: '/api/books/:id',         n: 'одна книга по id' },
            { m: 'POST',   cls: 'post',   p: '/api/books',             n: 'создать книгу' },
            { m: 'PUT',    cls: 'put',    p: '/api/books/:id',         n: 'обновить книгу' },
            { m: 'DELETE', cls: 'delete', p: '/api/books/:id',         n: 'удалить книгу' },
            { m: 'PATCH',  cls: 'patch',  p: '/api/books/:id/publish', n: 'переключить isPublished' },
            { m: 'GET',    cls: 'get',    p: '/api/books/search',      n: '★ поиск + пагинация' },
          ] as const).map(e => (
            <div key={`${e.m}-${e.p}`} className={s.endpoint}>
              <span className={`${s.method} ${s[e.cls]}`}>{e.m}</span>
              <span className={s.path}>{e.p}</span>
              <span className={s.pathNote}>{e.n}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Task 1 ── */}
      <Task
        num="задание 1"
        title="Сущность BookEntity"
        desc={<>Создай модуль <code>books</code> командой <code>nest g module books</code> и опиши сущность со следующими полями:</>}
        reqs={[
          { text: <><code>id</code> — UUID, первичный ключ, генерируется автоматически</> },
          { text: <><code>title</code> — varchar, максимум 200 символов, обязательное</> },
          { text: <><code>author</code> — varchar, максимум 100 символов, обязательное</> },
          { text: <><code>description</code> — text, необязательное (nullable)</> },
          { text: <><code>price</code> — decimal, precision 6, scale 2 (например 1299.99), default 0</> },
          { text: <><code>pages</code> — int, unsigned (не может быть отрицательным)</> },
          { text: <><code>isPublished</code> — boolean, default <code>false</code>, имя в БД <code>is_published</code></> },
          { text: <>Enum <code>BookGenre</code>: <code>FICTION</code>, <code>NON_FICTION</code>, <code>SCIENCE</code>, <code>BIOGRAPHY</code> — со значениями в нижнем регистре</> },
          { text: <><code>genre</code> — enum BookGenre, default <code>FICTION</code></> },
          { text: <><code>createdAt</code>, <code>updatedAt</code> — автоматические даты, имена в БД через snake_case</> },
        ]}
        result={<>После перезапуска сервера таблица <code>books</code> появится в Beekeeper Studio со всеми колонками.</>}
        hint={<>Не забудь зарегистрировать сущность в <code>books.module.ts</code> через <code>TypeOrmModule.forFeature([BookEntity])</code>.</>}
      />

      {/* ── Task 2 ── */}
      <Task
        num="задание 2"
        title="DTO с валидацией"
        desc={<>Создай <code>BookDto</code> — используется и для создания, и для обновления.</>}
        reqs={[
          { text: <><code>title</code> — строка, не пустая, максимум 200 символов</> },
          { text: <><code>author</code> — строка, не пустая, максимум 100 символов</> },
          { text: <><code>description</code> — строка, необязательное (<code>@IsOptional()</code>)</> },
          { text: <><code>price</code> — число, минимум 0</> },
          { text: <><code>pages</code> — целое число, минимум 1</> },
          { text: <><code>genre</code> — должен быть одним из значений <code>BookGenre</code></> },
        ]}
        result={<>POST /api/books с телом <code>{"{ title: '' }"}</code> должен вернуть 400 с массивом ошибок валидации.</>}
        hint={<>Для <code>pages</code> нужны два декоратора: <code>@IsInt()</code> и <code>@Min(1)</code>. Для жанра — <code>@IsEnum(BookGenre)</code>.</>}
      />

      {/* ── Task 3 ── */}
      <Task
        num="задание 3"
        title="BookService с репозиторием"
        desc="Реализуй все методы сервиса. Репозиторий подключается через конструктор."
        reqs={[
          { text: <><code>findAll(genre?, isPublished?)</code> — все книги. Оба параметра опциональные: если переданы — фильтруй через <code>where</code></> },
          { text: <><code>findById(id)</code> — одна книга. Если не найдена — <code>NotFoundException('Книга не найдена')</code></> },
          { text: <><code>create(dto)</code> — создать книгу, вернуть сохранённую сущность</> },
          { text: <><code>update(id, dto)</code> — найти через <code>findById</code>, обновить через <code>Object.assign</code>, сохранить</> },
          { text: <><code>delete(id)</code> — найти через <code>findById</code>, удалить, вернуть <code>id</code> удалённой книги</> },
          { text: <><code>togglePublish(id)</code> — инвертировать <code>isPublished</code> (<code>!book.isPublished</code>), сохранить, вернуть книгу</> },
        ]}
        result={<>GET /api/books должен вернуть пустой массив. POST /api/books с корректным телом — созданную книгу с <code>id</code> и датами.</>}
      />

      {/* ── Task 4 ── */}
      <Task
        num="задание 4"
        title="BookController"
        desc={<>Все эндпоинты под префиксом <code>books</code>. Глобальный префикс <code>api</code> уже настроен в <code>main.ts</code>.</>}
        reqs={[
          { text: <><code>GET /api/books</code> — принимает опциональные query-параметры <code>genre</code> и <code>isPublished</code>, передаёт в <code>findAll()</code></> },
          { text: <><code>GET /api/books/:id</code> — вызывает <code>findById()</code></> },
          { text: <><code>POST /api/books</code> — принимает <code>@Body() dto: BookDto</code>, вызывает <code>create()</code></> },
          { text: <><code>PUT /api/books/:id</code> — принимает <code>@Param('id')</code> и <code>@Body() dto: BookDto</code></> },
          { text: <><code>DELETE /api/books/:id</code> — принимает <code>@Param('id')</code></> },
          { text: <><code>PATCH /api/books/:id/publish</code> — только <code>@Param('id')</code>, вызывает <code>togglePublish()</code></> },
        ]}
        result={<>Все 6 эндпоинтов работают в Postman. GET /api/books?genre=fiction возвращает только книги с жанром fiction.</>}
        hint={<>Для <code>isPublished</code> из query придёт строка <code>'true'</code>/<code>'false'</code>, а не boolean. Преобразуй: <code>isPublished === 'true'</code>.</>}
      />

      {/* ── Task 5 star ── */}
      <Task
        num="задание со звёздочкой"
        title="Поиск и пагинация"
        star
        desc={<>
          Реализуй эндпоинт <code>GET /api/books/search</code> с поиском по названию и пагинацией.
          Это сложнее чем предыдущие задания — здесь нужны методы TypeORM которые мы не разбирали,
          придётся разобраться самостоятельно.
        </>}
        reqs={[
          { text: <>Query-параметры: <code>q</code> (строка поиска), <code>page</code> (номер страницы, default 1), <code>limit</code> (размер страницы, default 10)</> },
          { text: <>Поиск по <code>title</code> без учёта регистра — <code>ILIKE '%harry%'</code> в Postgres</> },
          { text: <>Пагинация через <code>take</code> и <code>skip</code>: <code>skip = (page - 1) * limit</code></> },
          { text: <>Вернуть объект: <code>{'{ data, total, page, totalPages }'}</code></> },
          { text: <><code>totalPages = Math.ceil(total / limit)</code></> },
          { text: <>Если <code>q</code> не передан — возвращать все книги с пагинацией</> },
        ]}
        result={
          <CodeHighlight code={`// GET /api/books/search?q=гарри&page=1&limit=5
{
  "data": [ ...5 книг с "гарри" в названии ],
  "total": 12,
  "page": 1,
  "totalPages": 3
}`} />
        }
        hint={<>
          Для поиска <code>ILIKE</code> используй <code>ILike</code> из пакета <code>typeorm</code>:
          <br /><code>where: {'{ title: ILike(`%${q}%`) }'}</code>
          <br />Для одновременного получения записей и общего количества — метод <code>findAndCount(options)</code>.
          Он возвращает <code>[MovieEntity[], number]</code> одним запросом.
        </>}
      />

    </article>
  );
}
