import s from './NestjsRepositoryArticle.module.scss';
import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { HomeworkBlock } from '@/components/ui/HomeworkBlock/HomeworkBlock';
import { RepoMethodsDemo } from './RepoMethodsDemo';
import { QUIZ_QUESTIONS } from './quizData';

export function NestjsRepositoryArticle() {
  return (
    <article className={s.article}>

      {/* ── Intro ── */}
      <section className={s.section}>
        <p className={s.lead}>
          Репозиторий — объект для работы с конкретной таблицей. Через него делаешь
          запросы к БД: найти все, найти одну, создать, обновить, удалить.
          TypeORM генерирует SQL сам — ты пишешь TypeScript.
        </p>
      </section>

      {/* ── @InjectRepository ── */}
      <section className={s.section}>
        <SectionTitle>Подключение репозитория в сервис</SectionTitle>
        <p className={s.body}>
          Репозиторий подключается через конструктор. Декоратор{' '}
          <code>@InjectRepository</code> говорит DI-контейнеру NestJS какую именно
          сущность использовать:
        </p>
        <CodeHighlight code={`import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}
}`} />
        <p className={s.body}>
          <code>Repository&lt;MovieEntity&gt;</code> — типизированный интерфейс к таблице
          <code>movies</code>. Все методы знают с каким типом работают и TypeScript
          это проверит на этапе компиляции.
        </p>
        <p className={s.body}>
          Чтобы DI нашёл репозиторий, сущность должна быть зарегистрирована
          в модуле через <code>TypeOrmModule.forFeature([MovieEntity])</code>.
        </p>
      </section>

      {/* ── Methods overview ── */}
      <section className={s.section}>
        <SectionTitle>Методы репозитория</SectionTitle>
        <div className={s.methodsTable}>
          {([
            { name: 'find(options?)',          sync: 'async', desc: <>Все записи. Принимает опции: <code>where</code>, <code>order</code>, <code>take</code>, <code>skip</code>, <code>select</code>.</> },
            { name: 'findOne({ where })',      sync: 'async', desc: <>Одна запись по условию. Возвращает <code>null</code> если не нашёл.</> },
            { name: 'create(dto)',             sync: 'sync',  desc: 'Создаёт JS-объект в памяти. В базу не пишет. Нужен перед save().' },
            { name: 'save(entity)',            sync: 'async', desc: <>INSERT если нет id, UPDATE если id есть. Возвращает сохранённый объект с <code>id</code>, <code>createdAt</code>.</> },
            { name: 'remove(entity)',          sync: 'async', desc: 'Удаляет запись. Принимает объект сущности, не id.' },
            { name: 'count({ where })',        sync: 'async', desc: 'Количество записей по условию. Удобно для пагинации.' },
            { name: 'exists({ where })',       sync: 'async', desc: 'Проверяет существование записи. Возвращает boolean.' },
          ] as const).map(r => (
            <div key={r.name} className={s.methodRow}>
              <div className={s.methodName}>{r.name}</div>
              <div className={`${s.methodSync} ${s[r.sync]}`}>{r.sync}</div>
              <div className={s.methodDesc}>{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive demo ── */}
      <section className={s.section}>
        <SectionTitle>Как это выглядит в сервисе</SectionTitle>
        <p className={s.body}>
          Каждая вкладка — один метод. Слева код в сервисе, справа SQL который
          TypeORM выполняет под капотом:
        </p>
        <RepoMethodsDemo />
      </section>

      {/* ── find options ── */}
      <section className={s.section}>
        <SectionTitle>Опции find()</SectionTitle>
        <p className={s.body}>
          <code>find()</code> принимает объект с настройками запроса:
        </p>
        <CodeHighlight code={`this.movieRepository.find({
  where:  { isAvailable: true, genre: Genre.ACTION },
  order:  { createdAt: 'desc' },
  take:   10,
  skip:   0,
  select: { id: true, title: true, rating: true },
})`} />
        <div className={s.optTable}>
          {[
            { key: 'where',  desc: <>Фильтрация. Передаёт <code>WHERE</code> в SQL. Принимает объект с полями сущности.</> },
            { key: 'order',  desc: <>Сортировка. <code>{ "{ createdAt: 'desc' }" }</code> → <code>ORDER BY created_at DESC</code>.</> },
            { key: 'take',   desc: <>Лимит записей — <code>LIMIT</code>. Используй вместе со <code>skip</code> для пагинации.</> },
            { key: 'skip',   desc: <>Пропустить N записей — <code>OFFSET</code>. Страница 3 при take=10: skip = 20.</> },
            { key: 'select', desc: <>Выбрать только нужные поля — <code>SELECT id, title</code>. Остальные поля придут как <code>undefined</code>.</> },
          ].map(r => (
            <div key={r.key} className={s.optRow}>
              <div className={s.optKey}>{r.key}</div>
              <div className={s.optDesc}>{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Full service ── */}
      <section className={s.section}>
        <SectionTitle>Полный сервис</SectionTitle>
        <p className={s.body}>
          Все методы вместе — можно использовать как шаблон:
        </p>
        <CodeHighlight code={`@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async findAll(): Promise<MovieEntity[]> {
    return this.movieRepository.find({
      where: { isAvailable: true },
      order: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOne({ where: { id } })
    if (!movie) throw new NotFoundException('Фильм не найден')
    return movie
  }

  async create(dto: MovieDto): Promise<MovieEntity> {
    const movie = this.movieRepository.create(dto)
    return this.movieRepository.save(movie)
  }

  async update(id: string, dto: MovieDto): Promise<boolean> {
    const movie = await this.findById(id)
    Object.assign(movie, dto)
    await this.movieRepository.save(movie)
    return true
  }

  async delete(id: string): Promise<string> {
    const movie = await this.findById(id)
    await this.movieRepository.remove(movie)
    return id
  }
}`} />
      </section>

      {/* ── Quiz ── */}
      <section className={s.section}>
        <SectionTitle>Проверь себя</SectionTitle>
        <QuizBlock questions={QUIZ_QUESTIONS} />
      </section>

      {/* ── Homework ── */}
      <HomeworkBlock items={[
        'Добавь метод findByGenre(genre: Genre) — возвращает все доступные фильмы нужного жанра, отсортированные по рейтингу от высокого к низкому.',
        'Добавь метод toggleAvailable(id: string) — меняет isAvailable на противоположное значение. Возвращает обновлённый фильм.',
        'Реализуй пагинацию в findAll: метод принимает page: number и limit: number, возвращает { data: MovieEntity[], total: number }. Используй find() + count().',
      ]} />

    </article>
  );
}
