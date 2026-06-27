import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { Callout } from '@/components/ui/Callout/Callout';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { HomeworkBlock } from '@/components/ui/HomeworkBlock/HomeworkBlock';
import { ConfigEvolutionDemo } from './ConfigEvolutionDemo';
import { QUIZ_QUESTIONS } from './quizData';
import s from './NestjsTypeormArticle.module.scss';

const BENEFITS = [
  {
    num: '01',
    title: 'Абстракция над SQL',
    desc: 'Пишешь repo.save(movie) вместо INSERT INTO movies VALUES (...). ORM сам генерирует SQL под нужную базу данных.',
  },
  {
    num: '02',
    title: 'Управление миграциями',
    desc: 'Схема базы данных меняется со временем. Миграции — это скрипты, которые синхронизируют БД с изменениями в коде.',
  },
  {
    num: '03',
    title: 'Безопасность типов',
    desc: 'Сущности описываются как TypeScript-классы. Нет опечаток в названиях колонок, TypeScript подскажет ошибку на этапе компиляции.',
  },
];

const KEY_SETTINGS = [
  {
    key: 'type',
    val: <>База данных. Для нашего случая: <code>&#39;postgres&#39;</code>. TypeORM поддерживает также mysql, sqlite, mongodb и другие.</>,
  },
  {
    key: 'autoLoadEntities',
    val: <>При <code>true</code> — NestJS сам находит все сущности, зарегистрированные через <code>TypeOrmModule.forFeature()</code>. Без этого пришлось бы перечислять их вручную в <code>entities: []</code>.</>,
  },
  {
    key: 'synchronize',
    val: <><strong>Только для разработки.</strong> При <code>true</code> TypeORM автоматически применяет изменения в сущностях к схеме базы при каждом запуске. В проде используй миграции — <code>synchronize: true</code> может удалить колонки с данными.</>,
  },
];

export function NestjsTypeormArticle() {
  return (
    <div className={s.article}>

      {/* ── 1. Что такое ORM ─────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Что такое ORM и зачем он нужен</SectionTitle>
        <p className={s.lead}>
          Когда приложение работает с базой данных, оно постоянно делает одно и то же:
          создаёт записи, читает их, обновляет, удаляет. Можно писать SQL вручную,
          но есть способ удобнее — <strong>ORM (Object-Relational Mapping)</strong>.
        </p>
        <p className={s.body}>
          ORM позволяет работать с таблицами базы данных как с обычными объектами в TypeScript.
          Ты описываешь таблицу как класс — и дальше забываешь про SQL:
          ORM сам генерирует нужные запросы.
        </p>
        <div className={s.benefits}>
          {BENEFITS.map(b => (
            <div key={b.num} className={s.benefit}>
              <span className={s.benefitNum}>{b.num}</span>
              <span className={s.benefitTitle}>{b.title}</span>
              <p className={s.benefitDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
        <p className={s.body}>
          В NestJS стандартный выбор — <strong>TypeORM</strong>. Он нативно
          интегрируется через <code>@nestjs/typeorm</code> и отлично работает с PostgreSQL,
          MySQL, SQLite и другими базами.
        </p>
      </section>

      {/* ── 2. Поднимаем Postgres ─────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Поднимаем Postgres через Docker</SectionTitle>
        <p className={s.body}>
          Вместо установки PostgreSQL напрямую на компьютер — поднимем его в Docker-контейнере.
          Создай в корне проекта файл <code>docker-compose.yml</code>:
        </p>
        <CodeHighlight code={`version: '3.9'

services:
  postgres:
    container_name: postgres
    image: postgres:16        # фиксируем версию — не latest
    restart: always
    environment:
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
    ports:
      - 5433:5432             # внешний:внутренний
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - nestjs-course

volumes:
  postgres_data:

networks:
  nestjs-course:`} />
        <Callout variant="warn">
          Не используй <code>image: postgres:latest</code> — при выходе новой мажорной версии
          контейнер перестанет подниматься из-за несовместимости формата данных. Фиксируй
          конкретную версию: <code>postgres:16</code>.
        </Callout>
        <p className={s.body}>
          Создай файл <code>.env</code> в корне проекта с переменными окружения.
          Этот файл не должен попасть в git — добавь его в <code>.gitignore</code>:
        </p>
        <CodeHighlight code={`POSTGRES_USER=root
POSTGRES_PASSWORD=123456
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=nestjs-course`} />
        <p className={s.body}>
          Запусти контейнер и создай базу данных в Beekeeper Studio или DBeaver,
          подключившись на <code>localhost:5433</code>:
        </p>
        <CodeHighlight code={`docker compose up -d`} />
      </section>

      {/* ── 3. Устанавливаем пакеты ──────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Устанавливаем пакеты</SectionTitle>
        <p className={s.body}>
          Для работы TypeORM с Postgres нужны три пакета:
        </p>
        <CodeHighlight code={`npm install @nestjs/typeorm typeorm pg

# @nestjs/typeorm — интеграция TypeORM с NestJS
# typeorm       — сама ORM-библиотека
# pg            — драйвер для PostgreSQL`} />
        <p className={s.body}>
          И пакет для работы с переменными окружения:
        </p>
        <CodeHighlight code={`npm install @nestjs/config`} />
      </section>

      {/* ── 4. Три подхода к конфигурации ────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Три подхода к конфигурации TypeORM</SectionTitle>
        <p className={s.body}>
          Существует три способа подключить TypeORM в <code>AppModule</code> — от простого
          к правильному. Посмотри на каждый:
        </p>
        <ConfigEvolutionDemo />
      </section>

      {/* ── 5. ConfigModule и ConfigService ──────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>ConfigModule и ConfigService — как это работает</SectionTitle>
        <p className={s.body}>
          Сначала подключаем <code>ConfigModule</code> в <code>AppModule</code>.
          Параметр <code>isGlobal: true</code> делает его доступным во всех модулях
          приложения без повторного импорта:
        </p>
        <CodeHighlight code={`@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports:    [ConfigModule],
      inject:     [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    // ... остальные модули
  ],
})`} />
        <p className={s.body}>
          <code>ConfigService</code> предоставляет два метода для чтения переменных:
        </p>
        <div className={s.anatomy}>
          <div className={s.anatRow}>
            <div className={s.anatKey}>config.get('KEY')</div>
            <div className={s.anatVal}>
              Возвращает значение или <code>undefined</code> если переменная не найдена.
              Приложение запустится, но упадёт позже при первом обращении к БД.
            </div>
          </div>
          <div className={s.anatRow}>
            <div className={s.anatKey}>config.getOrThrow('KEY')</div>
            <div className={s.anatVal}>
              Бросает ошибку <strong>при старте</strong> если переменная не задана.
              Сразу видно что именно не настроено. Рекомендуется всегда использовать этот метод.
            </div>
          </div>
          <div className={s.anatRow}>
            <div className={s.anatKey}>config.getOrThrow&lt;number&gt;('PORT')</div>
            <div className={s.anatVal}>
              Дженерик указывает ожидаемый тип. Полезно для <code>port</code> —
              TypeScript перестаёт ругаться что <code>string</code> не совпадает с <code>number</code>.
            </div>
          </div>
        </div>
        <Callout variant="warn">
          <code>process.env.POSTGRES_PORT</code> всегда возвращает строку, даже если
          в <code>.env</code> написано число. TypeORM ждёт <code>number</code> для поля <code>port</code>.
          Используй <code>config.getOrThrow&lt;number&gt;(&#39;POSTGRES_PORT&#39;)</code> —
          это решает проблему.
        </Callout>
      </section>

      {/* ── 6. Почему imports и inject оба нужны ─────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Почему нужны и imports, и inject одновременно</SectionTitle>
        <p className={s.body}>
          Это самая запутанная часть. Два поля делают разные вещи:
        </p>
        <div className={s.anatomy}>
          <div className={s.anatRow}>
            <div className={s.anatKey}>imports: [ConfigModule]</div>
            <div className={s.anatVal}>
              Гарантирует что <code>ConfigModule</code> загрузится <strong>до</strong> выполнения{' '}
              <code>useFactory</code>. Без этого NestJS не найдёт <code>ConfigService</code>
              в момент инициализации TypeORM.
            </div>
          </div>
          <div className={s.anatRow}>
            <div className={s.anatKey}>inject: [ConfigService]</div>
            <div className={s.anatVal}>
              <code>useFactory</code> — это обычная функция, не класс. DI-контейнер не может
              передать ей зависимости через конструктор. <code>inject</code> явно говорит:
              "передай <code>ConfigService</code> первым аргументом в функцию".
            </div>
          </div>
        </div>
        <Callout variant="info">
          Если убрать <code>imports</code> — NestJS не найдёт ConfigService.
          Если убрать <code>inject</code> — ConfigService не попадёт в useFactory.
        </Callout>
      </section>

      {/* ── 7. Выносим конфиг в отдельный файл ──────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Выносим конфиг в отдельный файл</SectionTitle>
        <p className={s.body}>
          Создай папку <code>src/config/</code> и файл <code>typeorm.config.ts</code>:
        </p>
        <CodeHighlight code={`// src/config/typeorm.config.ts
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmConfig(
  config: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host:     config.getOrThrow('POSTGRES_HOST'),
    port:     config.getOrThrow<number>('POSTGRES_PORT'),
    username: config.getOrThrow('POSTGRES_USER'),
    password: config.getOrThrow('POSTGRES_PASSWORD'),
    database: config.getOrThrow('POSTGRES_DB'),
    autoLoadEntities: true,
    synchronize: true,  // только в dev
  };
}`} />
        <p className={s.body}>
          <code>AppModule</code> теперь остаётся чистым:
        </p>
        <CodeHighlight code={`import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports:    [ConfigModule],
      inject:     [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    TaskModule, AuthorModule, BookModule,
  ],
})`} />
      </section>

      {/* ── 8. Ключевые настройки ────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Важные настройки TypeORM</SectionTitle>
        <div className={s.anatomy}>
          {KEY_SETTINGS.map(r => (
            <div key={r.key} className={s.anatRow}>
              <div className={s.anatKey}>{r.key}</div>
              <div className={s.anatVal}>{r.val}</div>
            </div>
          ))}
        </div>
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
          <>Подними Postgres через docker-compose.yml. Убедись что контейнер запускается командой <code>docker compose up -d</code> и виден через <code>docker ps</code>.</>,
          <>Создай базу данных через Beekeeper Studio или DBeaver, подключившись на <code>localhost:5433</code>.</>,
          <>Установи пакеты <code>@nestjs/typeorm typeorm pg @nestjs/config</code>. Подключи <code>ConfigModule.forRoot({'{ isGlobal: true }'})</code> в AppModule.</>,
          <>Создай файл <code>src/config/typeorm.config.ts</code> с функцией <code>getTypeOrmConfig</code>. Подключи TypeORM в AppModule через <code>forRootAsync</code> используя эту функцию. Убедись что приложение запускается без ошибок.</>,
        ]} />
      </section>

    </div>
  );
}
