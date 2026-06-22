import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { Callout } from '@/components/ui/Callout/Callout';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { HomeworkBlock } from '@/components/ui/HomeworkBlock/HomeworkBlock';
import { ModuleFlowDemo } from './ModuleFlowDemo';
import { QUIZ_QUESTIONS } from './quizData';
import s from './NestjsModulesArticle.module.scss';

const MODULE_FIELDS = [
  {
    key: 'controllers',
    desc: 'Контроллеры модуля — классы с декораторами @Get, @Post и т.д. NestJS создаёт их экземпляры и регистрирует маршруты.',
  },
  {
    key: 'providers',
    desc: 'Сервисы и другие зависимости модуля. Создаются DI-контейнером и доступны для инъекции внутри модуля.',
  },
  {
    key: 'exports',
    desc: 'Провайдеры, которые станут доступны другим модулям. По умолчанию всё закрыто — только явный экспорт открывает доступ.',
  },
  {
    key: 'imports',
    desc: 'Модули, чьи exports нужны этому модулю. Если MovieModule экспортирует MovieService — добавь его сюда, и он станет доступен через конструктор.',
  },
];

export function NestjsModulesArticle() {
  return (
    <div className={s.article}>

      {/* ── 1. Что такое модуль ───────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Что такое модуль</SectionTitle>
        <p className={s.lead}>
          В NestJS <strong>модуль</strong> — это TypeScript-класс с декоратором{' '}
          <code>@Module()</code>. Он группирует связанный код: контроллер,
          сервис, репозиторий. Каждое приложение состоит как минимум из одного модуля —
          корневого <code>AppModule</code>.
        </p>
        <p className={s.body}>
          Такая архитектура позволяет разделить приложение на независимые части:
          модуль фильмов, модуль пользователей, модуль авторизации. Каждый модуль
          инкапсулирует свою логику и явно объявляет, что он принимает и что отдаёт.
        </p>
        <div className={s.flow}>
          <span className={`${s.flowStep} ${s.app}`}>AppModule</span>
          <span className={s.flowArrow}>→</span>
          <span className={`${s.flowStep} ${s.module}`}>MovieModule</span>
          <span className={s.flowArrow}>+</span>
          <span className={`${s.flowStep} ${s.module}`}>UserModule</span>
          <span className={s.flowArrow}>+</span>
          <span className={`${s.flowStep} ${s.module}`}>AuthModule</span>
          <span className={s.flowArrow}>→</span>
          <span className={`${s.flowStep} ${s.ok}`}>Готовое приложение</span>
        </div>
      </section>

      {/* ── 2. Декоратор @Module ──────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Декоратор @Module — четыре поля</SectionTitle>
        <p className={s.body}>
          <code>@Module()</code> принимает объект с четырьмя необязательными полями.
          Незаполненные поля просто игнорируются.
        </p>
        <div className={s.anatomy}>
          {MODULE_FIELDS.map(({ key, desc }) => (
            <div key={key} className={s.anatRow}>
              <div className={s.anatKey}>{key}</div>
              <div className={s.anatVal}>{desc}</div>
            </div>
          ))}
        </div>
        <CodeHighlight lang="ts" filename="src/movie/movie.module.ts" code={`import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  controllers: [MovieController],  // обрабатывает HTTP-запросы
  providers:   [MovieService],     // бизнес-логика
  exports:     [MovieService],     // открываем для других модулей
})
export class MovieModule {}`} />
        <Callout variant="info">
          Поле <code>imports</code> здесь не нужно — MovieModule не зависит от других
          модулей. Как только появится зависимость (например, DatabaseModule) — добавим.
        </Callout>
      </section>

      {/* ── 3. AppModule ─────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>AppModule — точка входа</SectionTitle>
        <p className={s.body}>
          <code>AppModule</code> — корневой модуль. Именно его передаёт{' '}
          <code>NestFactory.create()</code> при запуске. Его задача —
          собрать все остальные модули в одно приложение через <code>imports</code>.
        </p>
        <CodeHighlight lang="ts" filename="src/app.module.ts" code={`import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { UserModule }  from './user/user.module';
import { AuthModule }  from './auth/auth.module';

@Module({
  imports: [
    MovieModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}`} />
        <p className={s.body}>
          Если модуль не попал в <code>imports</code> AppModule (и не попал
          транзитивно через другой модуль) — его контроллеры <em>не зарегистрированы</em>.
          Маршруты недоступны, сервисы не создаются.
        </p>
        <Callout variant="warn">
          AppModule обычно не содержит контроллеров и провайдеров — только импортирует
          модули. Бизнес-логика живёт в своих модулях, не в корневом.
        </Callout>
      </section>

      {/* ── 4. Экспорт сервиса ────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Экспорт сервиса — поле exports</SectionTitle>
        <p className={s.body}>
          По умолчанию NestJS применяет <strong>инкапсуляцию</strong>: провайдеры модуля
          видны только внутри него. Чтобы <em>другой</em> модуль мог использовать
          сервис — нужно явно добавить его в <code>exports</code>.
        </p>
        <CodeHighlight lang="ts" code={`// ❌ Без exports — MovieService закрыт снаружи
@Module({
  providers: [MovieService],
  // exports нет
})
export class MovieModule {}

// ✓ С exports — MovieService доступен для импортирующих модулей
@Module({
  providers: [MovieService],
  exports:   [MovieService],
})
export class MovieModule {}`} />
        <p className={s.body}>
          Экспортировать можно только то, что объявлено в <code>providers</code>
          этого же модуля. Экспорт «чужого» сервиса невозможен.
        </p>
      </section>

      {/* ── 5. Импорт модуля ──────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Импорт модуля и конструкторная инъекция</SectionTitle>
        <p className={s.body}>
          Допустим, <code>UserService</code> должен обращаться к данным фильмов.
          Для этого нужно сделать два шага:
        </p>
        <CodeHighlight lang="ts" code={`// Шаг 1: MovieModule экспортирует MovieService
@Module({
  providers: [MovieService],
  exports:   [MovieService],
})
export class MovieModule {}

// Шаг 2: UserModule импортирует MovieModule
@Module({
  imports:   [MovieModule],   // ← подключаем модуль
  providers: [UserService],
})
export class UserModule {}`} />
        <p className={s.body}>
          Теперь <code>UserService</code> может получить <code>MovieService</code>
          через конструктор — DI-контейнер NestJS сам передаст готовый экземпляр:
        </p>
        <CodeHighlight lang="ts" filename="src/user/user.service.ts" code={`import { Injectable } from '@nestjs/common';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class UserService {
  constructor(
    private readonly movieService: MovieService,
  ) {}

  getUserFavorites(userId: number) {
    // Можем вызывать любой публичный метод MovieService
    return this.movieService.findAll();
  }
}`} />
        <Callout variant="info">
          <code>private readonly</code> — соглашение NestJS: зависимость нельзя
          переприсвоить извне. <code>private</code> — не нужна в шаблоне контроллера.
          <code>readonly</code> — защита от случайной замены внутри класса.
        </Callout>
        <p className={s.body}>
          <code>imports</code> принимает <em>модули</em>, не отдельные сервисы.
          Нельзя написать <code>imports: [MovieService]</code> — только <code>imports: [MovieModule]</code>.
          Сервис становится доступным только через цепочку exports → imports.
        </p>
      </section>

      {/* ── 6. @Global() ─────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Глобальные модули — @Global()</SectionTitle>
        <p className={s.body}>
          Некоторые зависимости нужны <em>везде</em>: подключение к базе данных,
          конфигурация, логгер. Добавлять их в <code>imports</code> каждого модуля —
          утомительно. Для этого есть <code>@Global()</code>:
        </p>
        <CodeHighlight lang="ts" filename="src/database/database.module.ts" code={`import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()   // ← делает модуль глобальным
@Module({
  providers: [PrismaService],
  exports:   [PrismaService],  // exports всё равно нужен
})
export class DatabaseModule {}`} />
        <p className={s.body}>
          После этого достаточно один раз добавить <code>DatabaseModule</code> в
          <code>imports</code> AppModule — и <code>PrismaService</code> будет доступен
          в любом модуле приложения без явного <code>imports: [DatabaseModule]</code>.
        </p>
        <CodeHighlight lang="ts" filename="src/app.module.ts" code={`@Module({
  imports: [
    DatabaseModule,   // ← один раз здесь
    MovieModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}`} />
        <CodeHighlight lang="ts" code={`// В MovieModule — НЕ нужен imports: [DatabaseModule]
@Module({
  providers: [MovieService],
})
export class MovieModule {}

// В MovieService — получаем через конструктор
@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}
  //          ↑ работает без imports в MovieModule
}`} />
        <Callout variant="warn">
          <code>@Global()</code> не отменяет необходимость <code>exports</code>.
          Если забыть <code>exports: [PrismaService]</code> — инъекция не сработает
          даже с <code>@Global()</code>.
        </Callout>

        <div className={s.compareGrid}>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.good}`}>// когда @Global() уместен</div>
            <div className={s.compareBody}>
              Подключение к БД (<code>PrismaModule</code>)<br />
              Конфигурация (<code>ConfigModule</code>)<br />
              Логгер, используемый везде<br />
              Redis-клиент
            </div>
          </div>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.bad}`}>// когда лучше явный import</div>
            <div className={s.compareBody}>
              Бизнес-модули (<code>MovieModule</code>, <code>UserModule</code>)<br />
              Модули, используемые в 1–2 местах<br />
              Всё, где важна читаемая зависимость<br />
              При командной разработке
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Интерактивное демо ────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Демо: как связаны modules, exports и @Global()</SectionTitle>
        <p className={s.body}>
          Три сценария: что ломается без <code>exports</code>, как работает
          обычный импорт, и что меняет <code>@Global()</code>.
        </p>
        <ModuleFlowDemo />
      </section>

      {/* ── 8. Архитектура: вложенные модули ──────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Вложенные модули и организация папок</SectionTitle>
        <p className={s.body}>
          В больших приложениях модули группируют по доменам и объединяют через
          промежуточный «агрегатный» модуль:
        </p>
        <CodeHighlight lang="text" code={`src/
  app.module.ts         ← импортирует ApiModule
  api/
    api.module.ts       ← импортирует MovieModule, UserModule, AuthModule
    movie/
      movie.module.ts
      movie.controller.ts
      movie.service.ts
    user/
      user.module.ts
      ...
    auth/
      auth.module.ts
      ...`} />
        <p className={s.body}>
          <code>AppModule</code> импортирует <code>ApiModule</code>,{' '}
          <code>ApiModule</code> импортирует конкретные модули. Это сокращает
          список в AppModule и разделяет зоны ответственности.
        </p>
        <p className={s.body}>
          Имена файлов по соглашению NestJS: <code>movie.module.ts</code>,{' '}
          <code>movie.service.ts</code>, <code>movie.controller.ts</code>.
          CLI сам следует этому стандарту при генерации сущностей.
        </p>
      </section>

      {/* ── 9. Самопроверка ──────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Самопроверка</SectionTitle>
        <QuizBlock questions={QUIZ_QUESTIONS} />
      </section>

      {/* ── 10. Практика ─────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Практика</SectionTitle>
        <HomeworkBlock items={[
          <>Создай модуль <code>CategoryModule</code> с <code>CategoryService</code>. Добавь метод <code>findAll(): string[]</code>, который возвращает массив строк — список категорий на твой выбор.</>,
          <>Открой <code>CategoryService</code> для других модулей через поле <code>exports</code> в декораторе <code>CategoryModule</code>.</>,
          <>Создай <code>ProductModule</code> с <code>ProductService</code> и <code>ProductController</code>. Добавь <code>CategoryModule</code> в поле <code>imports</code> декоратора <code>ProductModule</code>.</>,
          <>В конструктор <code>ProductService</code> добавь параметр <code>private categoryService: CategoryService</code>. Напиши метод <code>getCategories()</code>, который вызывает <code>categoryService.findAll()</code>.</>,
          <>Добавь маршрут <code>GET /products/categories</code> в <code>ProductController</code>, который возвращает результат <code>productService.getCategories()</code>.</>,
          <>Зарегистрируй оба модуля в <code>AppModule</code>. Протестируй в Postman: <code>GET /products/categories</code> должен вернуть массив категорий. Потом убери <code>exports</code> из <code>CategoryModule</code> и убедись, что приложение не запустится.</>,
        ]} />
      </section>

    </div>
  );
}
