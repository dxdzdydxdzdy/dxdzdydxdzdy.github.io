import s from './NestjsEntityArticle.module.scss';
import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { HomeworkBlock } from '@/components/ui/HomeworkBlock/HomeworkBlock';
import { ColumnTypesDemo } from './ColumnTypesDemo';
import { QUIZ_QUESTIONS } from './quizData';

export function NestjsEntityArticle() {
  return (
    <article className={s.article}>

      {/* ── Intro ── */}
      <section className={s.section}>
        <p className={s.lead}>
          Сущность (entity) — это TypeScript-класс, который TypeORM воспринимает как
          таблицу в базе данных. Каждое поле класса — колонка. Чтобы TypeORM это понял,
          вешаем декораторы из пакета <code>typeorm</code>.
        </p>
        <CodeHighlight code={`import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Column() title!: string
}`} />
        <p className={s.body}>
          Без декораторов это просто класс. Добавили <code>@Entity</code> — TypeORM знает,
          что это таблица. Добавили <code>@Column</code> — TypeORM знает, что это колонка.
        </p>
      </section>

      {/* ── @Entity ── */}
      <section className={s.section}>
        <SectionTitle>@Entity: регистрируем класс как таблицу</SectionTitle>
        <p className={s.body}>
          Без <code>name</code> TypeORM создаст таблицу с именем <code>movieentity</code> —
          просто имя класса в нижнем регистре. Параметр <code>name</code> задаёт нормальное
          имя в Postgres:
        </p>
        <CodeHighlight code={`// таблица будет называться movieentity
@Entity()
export class MovieEntity { ... }

// таблица будет называться movies
@Entity({ name: 'movies' })
export class MovieEntity { ... }`} />
        <p className={s.body}>
          Принято называть таблицы в нижнем регистре во множественном числе:
          <code>movies</code>, <code>users</code>, <code>orders</code>.
        </p>
      </section>

      {/* ── Primary key ── */}
      <section className={s.section}>
        <SectionTitle>Первичный ключ: числа или UUID</SectionTitle>
        <p className={s.body}>
          Первичный ключ — уникальный идентификатор каждой строки. Два варианта:
        </p>
        <div className={s.twoCol}>
          <div className={s.card}>
            <div className={s.cardHead}>
              <span className={s.cardLabel}>автоинкремент</span>
              <span className={`${s.cardBadge} ${s.num}`}>number</span>
            </div>
            <div className={s.cardBody}>
              <span className={s.cardCode}>{'@PrimaryGeneratedColumn()\nid!: number'}</span>
              <span className={s.cardNote}>
                Postgres даёт 1, 2, 3... Просто, предсказуемо, удобно для учебных проектов.
              </span>
            </div>
          </div>
          <div className={s.card}>
            <div className={s.cardHead}>
              <span className={s.cardLabel}>UUID</span>
              <span className={`${s.cardBadge} ${s.str}`}>string</span>
            </div>
            <div className={s.cardBody}>
              <span className={s.cardCode}>{"@PrimaryGeneratedColumn('uuid')\nid!: string"}</span>
              <span className={s.cardNote}>
                Генерирует строку вида <em>a3f9b2c1-...</em> Нельзя угадать следующий ID — безопаснее в реальных проектах.
              </span>
            </div>
          </div>
        </div>
        <div className={s.callout}>
          <span>
            Поменял тип первичного ключа с <code>number</code> на <code>string</code> —
            обнови сервис и контроллер. Там где было <code>id: number</code> и{' '}
            <code>+id</code> при преобразовании, теперь просто <code>id: string</code>.
          </span>
        </div>
      </section>

      {/* ── @Column types demo ── */}
      <section className={s.section}>
        <SectionTitle>@Column: типы колонок</SectionTitle>
        <p className={s.body}>
          <code>@Column()</code> без параметров создаёт колонку типа <code>varchar</code>
          без ограничений. Чаще нужно явно указать тип и настройки.
          Переключай вкладки — каждая показывает поле из нашей сущности:
        </p>
        <ColumnTypesDemo />
        <div className={s.anatomy}>
          {[
            { key: 'type',      val: <>Тип колонки в БД: <code>varchar</code>, <code>text</code>, <code>int</code>, <code>decimal</code>, <code>boolean</code>, <code>enum</code>, <code>date</code></> },
            { key: 'length',    val: 'Максимальная длина строки. Только для varchar.' },
            { key: 'nullable',  val: <>По умолчанию <code>false</code>. Поставь <code>true</code> для необязательных полей.</> },
            { key: 'default',   val: 'Значение в БД если поле не передано при INSERT.' },
            { key: 'unsigned',  val: 'Только для числовых типов. Запрещает отрицательные значения.' },
            { key: 'precision', val: <>Для <code>decimal</code>: всего цифр в числе включая дробную часть.</> },
            { key: 'scale',     val: <>Для <code>decimal</code>: цифр после запятой.</> },
            { key: 'name',      val: <>Имя колонки в БД. TypeScript — <code>camelCase</code>, Postgres — <code>snake_case</code>.</> },
          ].map(r => (
            <div key={r.key} className={s.anatRow}>
              <div className={s.anatKey}>{r.key}</div>
              <div className={s.anatVal}>{r.val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Service dates ── */}
      <section className={s.section}>
        <SectionTitle>@CreateDateColumn и @UpdateDateColumn</SectionTitle>
        <p className={s.body}>
          Два специальных декоратора которые TypeORM заполняет сам — вручную эти поля не трогают:
        </p>
        <CodeHighlight code={`@CreateDateColumn({ name: 'created_at' })
createdAt!: Date

@UpdateDateColumn({ name: 'updated_at' })
updatedAt!: Date`} />
        <div className={s.anatomy}>
          {[
            {
              key: '@CreateDateColumn',
              val: 'Ставит текущую дату при первом INSERT. Больше никогда не меняется.',
            },
            {
              key: '@UpdateDateColumn',
              val: <>Обновляется при каждом <code>repository.save(entity)</code>. Всегда показывает дату последнего изменения.</>,
            },
          ].map(r => (
            <div key={r.key} className={s.anatRow}>
              <div className={s.anatKey}>{r.key}</div>
              <div className={s.anatVal}>{r.val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Enum ── */}
      <section className={s.section}>
        <SectionTitle>Enum: ограниченный список значений</SectionTitle>
        <p className={s.body}>
          Если поле должно принимать только определённые значения — используй Enum.
          Сначала описываем TypeScript enum, потом передаём его в декоратор:
        </p>
        <CodeHighlight code={`export enum Genre {
  ACTION = 'action',
  COMEDY = 'comedy',
  DRAMA  = 'drama',
  HORROR = 'horror',
}

@Column({
  type: 'enum',
  enum: Genre,
  default: Genre.DRAMA,
})
genre!: Genre`} />
        <p className={s.body}>
          TypeORM создаёт в Postgres отдельный тип <code>CREATE TYPE ... AS ENUM</code>.
          Попытка сохранить строку не из списка — ошибка на уровне базы данных,
          не только в TypeScript. Значения enum принято хранить в нижнем регистре{' '}
          (<code>'action'</code>, не <code>'ACTION'</code>) — так проще работать в SQL-запросах.
        </p>
      </section>

      {/* ── Full entity ── */}
      <section className={s.section}>
        <SectionTitle>Итоговая сущность</SectionTitle>
        <p className={s.body}>
          Вся сущность целиком — удобно посмотреть как всё собирается вместе:
        </p>
        <CodeHighlight code={`import {
  Column, CreateDateColumn, Entity,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

export enum Genre {
  ACTION = 'action',
  COMEDY = 'comedy',
  DRAMA  = 'drama',
  HORROR = 'horror',
}

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 128, default: 'Movie title' })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string

  @Column({ name: 'release_year', type: 'int', unsigned: true })
  releaseYear!: number

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0.0 })
  rating!: number

  @Column({ name: 'is_available', type: 'boolean', default: false })
  isAvailable!: boolean

  @Column({ type: 'enum', enum: Genre, default: Genre.DRAMA })
  genre!: Genre

  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt!: Date
}`} />
      </section>

      {/* ── Quiz ── */}
      <section className={s.section}>
        <SectionTitle>Проверь себя</SectionTitle>
        <QuizBlock questions={QUIZ_QUESTIONS} />
      </section>

      {/* ── Homework ── */}
      <HomeworkBlock items={[
        'Добавь в MovieEntity поле posterUrl типа varchar(512), nullable — ссылка на обложку фильма. Убедись что колонка появилась в Beekeeper Studio после перезапуска.',
        'Создай сущность DirectorEntity с полями: id (UUID), name (varchar), birthYear (int, unsigned), createdAt. Зарегистрируй её через TypeOrmModule.forFeature в movie.module.ts.',
        'Добавь Enum для рейтинга возраста: G, PG, PG13, R. Прикрепи к MovieEntity с default G.',
      ]} />

    </article>
  );
}
