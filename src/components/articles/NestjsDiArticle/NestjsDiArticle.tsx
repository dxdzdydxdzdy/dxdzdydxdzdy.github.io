import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { Callout } from '@/components/ui/Callout/Callout';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { HomeworkBlock } from '@/components/ui/HomeworkBlock/HomeworkBlock';
import { DiResolverDemo } from './DiResolverDemo';
import { QUIZ_QUESTIONS } from './quizData';
import s from './NestjsDiArticle.module.scss';

const PROBLEMS = [
  {
    title: 'Жёсткая привязка к реализации',
    body: <>Если у <code>UserService</code> изменится конструктор или появится зависимость от базы данных — <code>AuthService</code> придётся переписывать тоже. Изменение одного класса ломает другой.</>,
  },
  {
    title: 'Невозможно подставить мок в тестах',
    body: <>Чтобы протестировать <code>AuthService</code>, нужен настоящий <code>UserService</code>. А настоящий <code>UserService</code> может требовать базу данных. В итоге unit-тест тянет за собой всю инфраструктуру.</>,
  },
  {
    title: 'Цепочка new разрастается',
    body: <>Если <code>UserService</code> зависит от <code>DatabaseService</code>, а тот от <code>ConfigService</code> — <code>AuthService</code> должен знать о всей цепочке и создавать все объекты вручную.</>,
  },
];

const CUSTOM_PROVIDERS = [
  {
    key: 'useClass',
    desc: 'Подменяет реализацию. { provide: UserService, useClass: MockUserService } — все кто просит UserService получат MockUserService. Удобно для тестов и стратегий.',
  },
  {
    key: 'useValue',
    desc: 'Передаёт готовое значение. { provide: API_URL, useValue: "https://api.example.com" } — полезно для строковых токенов, конфигурации, объектов без класса.',
  },
  {
    key: 'useFactory',
    desc: 'Создаёт значение через функцию. Позволяет передавать зависимости внутрь фабрики через inject: [] — для сложной инициализации или асинхронных провайдеров.',
  },
];

export function NestjsDiArticle() {
  return (
    <div className={s.article}>

      {/* ── 1. Проблема ──────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Проблема: жёсткие зависимости</SectionTitle>
        <p className={s.lead}>
          Представь: <code>AuthService</code> должен проверять пользователя по email.
          Для этого нужен <code>UserService</code>. Самый очевидный способ — создать его прямо внутри:
        </p>
        <CodeHighlight lang="ts" code={`@Injectable()
export class AuthService {
  // ❌ Создаём сами — жёсткая зависимость
  private userService = new UserService();

  validateUser(email: string) {
    return this.userService.findByEmail(email);
  }
}`} />
        <p className={s.body}>Код работает. Но у него три серьёзных проблемы:</p>
        <div className={s.problems}>
          {PROBLEMS.map(({ title, body }) => (
            <div key={title} className={s.problem}>
              <span className={s.problemIcon}>✕</span>
              <div className={s.problemText}>
                <strong>{title}. </strong>{body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Решение вручную ────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Решение: зависимость приходит снаружи</SectionTitle>
        <p className={s.body}>
          Вместо того чтобы создавать <code>UserService</code> внутри — попросим его
          передать через конструктор. Тот, кто создаёт <code>AuthService</code>,
          сам решит какой именно <code>UserService</code> туда положить:
        </p>
        <CodeHighlight lang="ts" code={`@Injectable()
export class AuthService {
  // ✓ Принимаем снаружи — не создаём сами
  constructor(private userService: UserService) {}

  validateUser(email: string) {
    return this.userService.findByEmail(email);
  }
}

// Где-то снаружи:
const userService = new UserService();
const authService = new AuthService(userService); // ← передаём готовый`} />
        <p className={s.body}>
          Теперь <code>AuthService</code> не знает и не заботится о том, как создаётся
          <code>UserService</code>. В тесте можно передать объект-заглушку:
        </p>
        <CodeHighlight lang="ts" code={`// В unit-тесте — передаём заглушку вместо реального сервиса
const mockUserService = {
  findByEmail: jest.fn().mockReturnValue({ id: 1, email: 'test@test.com' }),
};

const authService = new AuthService(mockUserService as UserService);
// Теперь тест работает без базы данных ✓`} />
        <Callout variant="info">
          Это и есть <strong>Dependency Injection</strong> — паттерн проектирования,
          при котором зависимости класса передаются в него снаружи, а не создаются внутри.
          «Inject» — от английского «вводить, вкалывать»: кто-то другой «вводит» зависимость в класс.
        </Callout>
      </section>

      {/* ── 3. DI-контейнер ───────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>DI-контейнер — кто делает это автоматически</SectionTitle>
        <p className={s.body}>
          Передавать зависимости вручную работает, но в реальном приложении с десятками
          классов это превращается в хаос: нужно знать кто от кого зависит и в правильном
          порядке создавать объекты. Здесь на помощь приходит <strong>DI-контейнер</strong>.
        </p>
        <p className={s.body}>
          Контейнер — это объект который:
        </p>
        <div className={s.anatomy}>
          {[
            { key: 'Хранит реестр',    val: 'Знает о каждом зарегистрированном классе и том, что ему нужно для работы.' },
            { key: 'Строит граф',       val: 'При старте анализирует конструкторы и строит дерево зависимостей: кто от кого зависит.' },
            { key: 'Создаёт объекты',  val: 'Разрешает граф снизу вверх — сначала классы без зависимостей, потом те что от них зависят.' },
            { key: 'Кэширует',         val: 'По умолчанию создаёт каждый класс один раз и переиспользует один и тот же экземпляр.' },
          ].map(({ key, val }) => (
            <div key={key} className={s.anatRow}>
              <div className={s.anatKey}>{key}</div>
              <div className={s.anatVal}>{val}</div>
            </div>
          ))}
        </div>
        <p className={s.body}>
          NestJS встроил DI-контейнер в основу фреймворка. Тебе не нужно писать
          <code>new AuthService(new UserService())</code> — контейнер разберётся сам.
        </p>
      </section>

      {/* ── 4. @Injectable и providers ───────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>@Injectable() и providers — как это работает в NestJS</SectionTitle>
        <p className={s.body}>
          Два шага чтобы подключить класс к DI-контейнеру:
        </p>
        <CodeHighlight lang="ts" filename="src/user/user.service.ts" code={`import { Injectable } from '@nestjs/common';

@Injectable()  // ← шаг 1: помечаем класс как управляемый контейнером
export class UserService {
  findByEmail(email: string) {
    return { id: 1, email };
  }
}`} />
        <CodeHighlight lang="ts" filename="src/auth/auth.module.ts" code={`import { Module } from '@nestjs/common';
import { AuthService }    from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule }     from '../user/user.module';

@Module({
  imports:     [UserModule],       // берём UserService из UserModule
  providers:   [AuthService],      // ← шаг 2: регистрируем в контейнере
  controllers: [AuthController],
})
export class AuthModule {}`} />
        <p className={s.body}>
          После этого <code>AuthService</code> может просто объявить параметр
          в конструкторе — контейнер передаст готовый экземпляр:
        </p>
        <CodeHighlight lang="ts" filename="src/auth/auth.service.ts" code={`import { Injectable } from '@nestjs/common';
import { UserService }  from '../user/user.service';

@Injectable()
export class AuthService {
  // NestJS сам найдёт UserService и передаст его сюда
  constructor(private userService: UserService) {}

  validateUser(email: string) {
    const user = this.userService.findByEmail(email);
    if (!user) throw new Error('Пользователь не найден');
    return user;
  }
}`} />
        <Callout variant="info">
          <code>private userService: UserService</code> — это сокращённая запись TypeScript.
          Она одновременно объявляет поле класса и присваивает значение из конструктора.
          Аналог: <code>{'this.userService = userService'}</code> в обычном JS.
        </Callout>
      </section>

      {/* ── 5. Под капотом ────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Под капотом: как контейнер читает типы</SectionTitle>
        <p className={s.body}>
          Выглядит как магия — NestJS смотрит на тип <code>UserService</code>
          и передаёт правильный объект. Как он это делает?
        </p>
        <p className={s.body}>
          TypeScript умеет сохранять типы параметров конструктора в рантайме.
          Для этого нужно включить две опции в <code>tsconfig.json</code>:
        </p>
        <CodeHighlight lang="json" filename="tsconfig.json" code={`{
  "compilerOptions": {
    "experimentalDecorators": true,  // разрешает декораторы
    "emitDecoratorMetadata": true    // сохраняет типы в метаданные
  }
}`} />
        <p className={s.body}>
          С этими опциями TypeScript добавляет к каждому декорированному классу
          скрытые метаданные. NestJS читает их в рантайме:
        </p>
        <CodeHighlight lang="ts" code={`// TypeScript "под капотом" добавляет вот это:
Reflect.defineMetadata(
  'design:paramtypes',
  [UserService],      // ← массив типов параметров конструктора
  AuthService
);

// NestJS при создании AuthService делает:
const types = Reflect.getMetadata('design:paramtypes', AuthService);
// → [UserService]
// → ищет UserService в реестре → находит → передаёт в конструктор`} />
        <Callout variant="warn">
          Nest CLI создаёт <code>tsconfig.json</code> с нужными опциями автоматически.
          Если создаёшь проект вручную — проверь что обе опции включены, иначе DI работать не будет.
        </Callout>
      </section>

      {/* ── 6. Синглтон ──────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Синглтон — паттерн «один на всех»</SectionTitle>
        <p className={s.body}>
          <strong>Синглтон — это паттерн проектирования</strong>: класс существует в единственном
          экземпляре на протяжении всей работы приложения. NestJS применяет этот паттерн по умолчанию
          к каждому сервису — сколько бы запросов ни пришло одновременно, все они работают с
          <strong> одним и тем же объектом</strong>.
        </p>
        <div className={s.compare}>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.bad}`}>// без синглтона</div>
            <div className={s.compareBody}>
              На каждый запрос создаётся новый объект сервиса. Пришло сто запросов — создалось
              сто объектов. Память тратится без причины. Нужно лишь в редких случаях.
            </div>
          </div>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.good}`}>// синглтон (по умолчанию)</div>
            <div className={s.compareBody}>
              Один объект на всё приложение. Пришло сто запросов — они все используют тот же
              один объект. Большинство сервисов просто содержат методы и не хранят
              данных между запросами, поэтому это работает отлично.
            </div>
          </div>
        </div>
        <p className={s.body}>
          NestJS поддерживает три режима жизни провайдера:
        </p>
        <div className={s.scopeRow}>
          {[
            {
              name: 'DEFAULT',
              nameClass: 'default',
              desc: 'Синглтон. Один объект на всё время работы приложения. Используется по умолчанию — подходит для 95% случаев.',
            },
            {
              name: 'REQUEST',
              nameClass: 'request',
              desc: 'Новый объект на каждый HTTP-запрос. Нужен если сервис должен помнить что-то специфичное только для этого запроса.',
            },
            {
              name: 'TRANSIENT',
              nameClass: 'transient',
              desc: 'Новый объект для каждого класса, который его использует. Редко нужен на практике.',
            },
          ].map(({ name, nameClass, desc }) => (
            <div key={name} className={s.scopeCard}>
              <div className={`${s.scopeName} ${s[nameClass]}`}>{name}</div>
              <div className={s.scopeDesc}>{desc}</div>
            </div>
          ))}
        </div>
        <Callout variant="info">
          В 95% случаев DEFAULT — правильный выбор. Сервисы обычно просто содержат методы
          и не хранят данных между запросами, поэтому один объект на всех работает отлично.
        </Callout>
      </section>

      {/* ── 7. DI и тесты ────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>DI и тестирование — почему это важно</SectionTitle>
        <p className={s.body}>
          Одно из главных преимуществ DI — возможность заменить реальный сервис
          на заглушку прямо в тесте. Сравни два подхода:
        </p>
        <div className={s.compare}>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.bad}`}>// без DI — тест требует реальной БД</div>
            <div className={s.compareBody}>
              <code>new AuthService()</code> создаёт <code>new UserService()</code>
              который создаёт <code>new DatabaseService()</code>.
              Тест невозможен без поднятой базы данных.
            </div>
          </div>
          <div className={s.compareCol}>
            <div className={`${s.compareHead} ${s.good}`}>// с DI — тест изолирован</div>
            <div className={s.compareBody}>
              Передаём в конструктор объект с нужными методами.
              Тест работает без базы, сети, файловой системы — только логика.
            </div>
          </div>
        </div>
        <CodeHighlight lang="ts" filename="src/auth/auth.service.spec.ts" code={`import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          // Подставляем объект-заглушку вместо реального UserService
          useValue: {
            findByEmail: jest.fn().mockReturnValue({ id: 1, email: 'a@b.com' }),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('должен вернуть пользователя', () => {
    const user = authService.validateUser('a@b.com');
    expect(user.id).toBe(1);
    // База данных не нужна ✓
  });
});`} />
      </section>

      {/* ── 8. Кастомные провайдеры ───────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Кастомные провайдеры: useClass, useValue, useFactory</SectionTitle>
        <p className={s.body}>
          Запись <code>providers: [UserService]</code> — сокращение. Полная форма:
          <code>{'{ provide: UserService, useClass: UserService }'}</code>.
          Через эту форму можно гибко управлять тем что попадает в контейнер:
        </p>
        <div className={s.provTable}>
          <div className={s.provHead}>
            <div className={s.provHCell}>ключ</div>
            <div className={s.provHCell}>что делает</div>
          </div>
          {CUSTOM_PROVIDERS.map(({ key, desc }) => (
            <div key={key} className={s.provRow}>
              <div className={s.provKey}>{key}</div>
              <div className={s.provDesc}>{desc}</div>
            </div>
          ))}
        </div>
        <CodeHighlight lang="ts" code={`// useClass — подменяем реализацию не трогая токен
@Module({
  providers: [
    { provide: UserService, useClass: CachedUserService },
  ],
})

// useValue — передаём готовое значение (конфиг, токен, мок)
export const API_URL = new InjectionToken<string>('API_URL');

@Module({
  providers: [
    { provide: API_URL, useValue: 'https://api.example.com' },
  ],
})

// useFactory — создаём через функцию, можно асинхронно
@Module({
  providers: [{
    provide: DatabaseService,
    useFactory: async (config: ConfigService) => {
      return new DatabaseService(await config.getDbUrl());
    },
    inject: [ConfigService],
  }],
})`} />
      </section>

      {/* ── 9. Демо ───────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Демо: как контейнер разрешает зависимости</SectionTitle>
        <p className={s.body}>
          Пошаговая визуализация того, что происходит при старте приложения.
          Нажимай «вперёд» и смотри в каком порядке NestJS создаёт объекты.
        </p>
        <DiResolverDemo />
      </section>

      {/* ── 10. Самопроверка ──────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Самопроверка</SectionTitle>
        <QuizBlock questions={QUIZ_QUESTIONS} />
      </section>

      {/* ── 11. Практика ─────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Практика</SectionTitle>
        <HomeworkBlock items={[
          <>Создай <code>LoggerService</code> с декоратором <code>@Injectable()</code>. Добавь метод <code>log(message: string): void</code>, который выводит сообщение в консоль с префиксом <code>[LOG]</code>.</>,
          <>Зарегистрируй <code>LoggerService</code> в <code>providers</code> модуля и добавь его в <code>exports</code> чтобы другие модули могли его использовать.</>,
          <>Добавь <code>LoggerService</code> в конструктор <code>MovieService</code> параметром <code>private logger: LoggerService</code>. Убедись что <code>MovieModule</code> импортирует модуль с <code>LoggerService</code>.</>,
          <>Вызови <code>this.logger.log('Получен список фильмов')</code> внутри метода <code>findAll()</code> и <code>this.logger.log('Получен фильм #' + id)</code> в <code>findOne()</code>.</>,
          <>Запусти приложение и отправь несколько GET-запросов через Postman. Убедись что в консоли сервера появляются сообщения с префиксом <code>[LOG]</code>.</>,
          <>Попробуй убрать <code>LoggerService</code> из <code>providers</code> или <code>exports</code> и убедись, что приложение не запустится с ошибкой о неразрешённой зависимости.</>,
        ]} />
      </section>

    </div>
  );
}
