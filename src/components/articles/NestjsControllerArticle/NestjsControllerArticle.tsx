import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { Callout } from '@/components/ui/Callout/Callout';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { HomeworkBlock } from '@/components/ui/HomeworkBlock/HomeworkBlock';
import { UrlBuilderDemo } from './UrlBuilderDemo';
import { QUIZ_QUESTIONS } from './quizData';
import s from './NestjsControllerArticle.module.scss';

const ANATOMY_ROWS = [
  {
    key: '@Controller()',
    val: <>Без параметров. Все маршруты класса начинаются с корня <code>/</code>. Подходит если контроллер один и путь задаётся только в методах.</>,
  },
  {
    key: "@Controller('movies')",
    val: <>Со строкой. Все маршруты класса получат префикс <code>/movies</code>. Это самый распространённый вариант.</>,
  },
  {
    key: '@Controller({ path, host })',
    val: <>С объектом конфигурации. Позволяет задать не только путь, но и ограничить контроллер по домену (заголовку <code>Host</code>).</>,
  },
];

export function NestjsControllerArticle() {
  return (
    <div className={s.article}>

      {/* ── 1. Что такое @Controller ──────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Что делает декоратор @Controller</SectionTitle>
        <p className={s.lead}>
          Когда браузер или мобильное приложение отправляет HTTP-запрос — например,
          <code> GET /movies/42</code> — NestJS должен понять: кто за него отвечает?
          Вот тут и вступает <code>@Controller</code>.
        </p>
        <p className={s.body}>
          <strong>@Controller — это адрес класса.</strong> Строка внутри декоратора
          задаёт <em>префикс</em>: общую начальную часть URL, которую получат все маршруты в этом классе.
          Без этого декоратора NestJS просто не заметит класс и не зарегистрирует ни одного маршрута.
        </p>
        <CodeHighlight code={`import { Controller, Get } from '@nestjs/common';

@Controller('movies')           // ← все маршруты начинаются с /movies
export class MoviesController {

  @Get()                        // → GET /movies
  findAll() { return []; }

  @Get(':id')                   // → GET /movies/:id
  findOne() { return {}; }

  @Get('popular')               // → GET /movies/popular
  findPopular() { return []; }
}`} />
        <Callout variant="info">
          Строка в <code>@Controller</code> и строка в <code>@Get</code> / <code>@Post</code> соединяются
          автоматически. Писать <code>@Get('/movies/:id')</code> не нужно — достаточно <code>@Get(':id')</code>.
        </Callout>
      </section>

      {/* ── 2. Из чего складывается URL ──────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Из чего складывается итоговый URL</SectionTitle>
        <p className={s.body}>
          Полный URL в NestJS состоит максимум из трёх частей. Все три — необязательные,
          но порядок всегда фиксирован:
        </p>
        <div className={s.anatomy}>
          <div className={s.anatRow}>
            <div className={s.anatKey}>1. Глобальный префикс</div>
            <div className={s.anatVal}>
              Задаётся в <code>main.ts</code> через <code>app.setGlobalPrefix('api')</code>.
              Применяется ко всем маршрутам всего приложения сразу.
            </div>
          </div>
          <div className={s.anatRow}>
            <div className={s.anatKey}>2. Префикс контроллера</div>
            <div className={s.anatVal}>
              Строка в <code>@Controller('movies')</code>. Применяется ко всем маршрутам одного класса.
            </div>
          </div>
          <div className={s.anatRow}>
            <div className={s.anatKey}>3. Путь метода</div>
            <div className={s.anatVal}>
              Строка в <code>@Get(':id')</code>, <code>@Post('create')</code> и т.д.
              Уточняет конкретный маршрут внутри контроллера.
            </div>
          </div>
        </div>
        <p className={s.body}>
          Попробуй поменять значения — URL обновится в реальном времени:
        </p>
        <UrlBuilderDemo />
        <Callout variant="info">
          Если очистить все три поля — URL будет просто <code>/</code>. Это корень приложения.
        </Callout>
      </section>

      {/* ── 3. Три способа вызова @Controller ────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Три формы @Controller</SectionTitle>
        <div className={s.modeGrid}>
          <div className={s.modeCard}>
            <span className={s.modeTag}>Без параметра</span>
            <span className={s.modeCode}>@Controller()</span>
            <p className={s.modeDesc}>
              Контроллер без префикса. Маршруты доступны от корня.
              <code>@Get('films')</code> станет <code>GET /films</code>.
            </p>
            <span className={s.modeResult}>→ @Get('x') = /x</span>
          </div>
          <div className={s.modeCard}>
            <span className={s.modeTag}>Строка</span>
            <span className={s.modeCode}>@Controller('movies')</span>
            <p className={s.modeDesc}>
              Самый частый вариант. Все маршруты класса получат
              общий префикс <code>/movies</code>.
            </p>
            <span className={s.modeResult}>→ @Get('x') = /movies/x</span>
          </div>
          <div className={s.modeCard}>
            <span className={s.modeTag}>Объект</span>
            <span className={s.modeCode}>@Controller({'{ path, host }'})</span>
            <p className={s.modeDesc}>
              Расширенный вариант. Задаёт путь и дополнительные
              ограничения, например по домену.
            </p>
            <span className={s.modeResult}>→ @Get('x') = /movies/x</span>
          </div>
        </div>
      </section>

      {/* ── 4. Ограничение по хосту ───────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Ограничение по домену — опция host</SectionTitle>
        <p className={s.body}>
          Объект конфигурации позволяет указать <code>host</code> — тогда контроллер будет
          принимать запросы <strong>только с указанного домена</strong>. Запросы с других
          доменов получат 404, как будто маршрута не существует.
        </p>
        <CodeHighlight code={`@Controller({ path: 'movies', host: 'dxlearn.ru' })
export class MoviesController {
  // Доступно только если заголовок Host: dxlearn.ru
  // Запрос с другого домена → 404
}`} />
        <p className={s.body}>
          Можно передать массив хостов — контроллер примет запросы с любого из них:
        </p>
        <CodeHighlight code={`@Controller({
  path: 'movies',
  host: ['dxlearn.ru', 'admin.dxlearn.ru'],
})`} />
        <Callout variant="warn">
          На практике <code>host</code> нужен редко — в основном для мультитенантных
          приложений, когда один сервер обслуживает несколько разных доменов с разной логикой.
          В обычных API его не используют.
        </Callout>
      </section>

      {/* ── 5. Глобальный префикс ────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Глобальный префикс — setGlobalPrefix</SectionTitle>
        <p className={s.body}>
          Если хочешь чтобы <strong>все</strong> маршруты приложения начинались с
          одного префикса — например <code>/api</code> — не нужно прописывать его
          в каждом контроллере. Достаточно один раз в <code>main.ts</code>:
        </p>
        <CodeHighlight code={`// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');   // ← добавляем ОДИН РАЗ

  await app.listen(3000);
}
bootstrap();`} />
        <p className={s.body}>
          После этого <code>GET /movies/:id</code> станет <code>GET /api/movies/:id</code> —
          автоматически, без изменений в контроллерах.
        </p>
        <div className={s.compare}>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.bad}`}>// без setGlobalPrefix</div>
            <div className={s.compareBody}>
              <code>GET /movies</code><br />
              <code>GET /users</code><br />
              <code>GET /auth/login</code>
            </div>
          </div>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.good}`}>// setGlobalPrefix('api')</div>
            <div className={s.compareBody}>
              <code>GET /api/movies</code><br />
              <code>GET /api/users</code><br />
              <code>GET /api/auth/login</code>
            </div>
          </div>
        </div>
        <p className={s.body}>
          Иногда нужно чтобы <em>один</em> маршрут был без префикса — например
          <code> /health</code> для проверки работоспособности сервера. Для этого
          есть опция <code>exclude</code>:
        </p>
        <CodeHighlight code={`app.setGlobalPrefix('api', {
  exclude: ['/health'],  // этот маршрут останется на /health
});
// GET /health → работает без /api
// GET /movies → становится GET /api/movies`} />
      </section>

      {/* ── 6. Quiz ───────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Проверь себя</SectionTitle>
        <QuizBlock questions={QUIZ_QUESTIONS} />
      </section>

      {/* ── 7. Практика ──────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Практика</SectionTitle>
        <HomeworkBlock items={[
          'Создай контроллер BooksController с префиксом books.',
          'Добавь методы: GET /books (список), GET /books/:id (одна книга), POST /books (создание). Пока пусть возвращают любые заглушки.',
          'В main.ts добавь глобальный префикс api. Убедись что все маршруты теперь доступны по /api/books, /api/books/:id.',
          'Создай второй контроллер AuthorsController с префиксом authors. Добавь GET /authors. Проверь что маршрут становится /api/authors.',
        ]} />
      </section>

    </div>
  );
}
