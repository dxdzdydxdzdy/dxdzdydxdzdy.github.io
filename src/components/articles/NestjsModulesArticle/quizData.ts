import type { QuizQuestion } from '@/components/ui/QuizBlock/QuizBlock';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'mod1',
    difficulty: 'easy',
    question: 'Для чего нужен декоратор @Module()?',
    options: [
      'Помечает класс как модуль и задаёт его состав',
      'Создаёт HTTP-сервер и регистрирует обработчики запросов для всего модуля',
      'Автоматически подключает модуль к базе данных и инициализирует соединение',
      'Регистрирует все middleware глобально на уровне приложения',
    ],
    correct: 0,
    explanation: '@Module() — метаданные для NestJS: какие контроллеры, провайдеры и импорты входят в модуль. Без него класс — просто класс, фреймворк о нём ничего не знает.',
  },
  {
    id: 'mod2',
    difficulty: 'easy',
    question: 'Что указывают в поле controllers декоратора @Module?',
    options: [
      'Классы контроллеров этого модуля',
      'Функции-обработчики маршрутов в виде стрелочных функций',
      'Экземпляры контроллеров, созданные и настроенные вручную ещё до старта приложения',
      'Все middleware и перехватчики, которые будут работать на маршрутах модуля',
    ],
    correct: 0,
    explanation: 'controllers принимает массив классов контроллеров. NestJS сам создаёт их экземпляры через DI-контейнер и регистрирует маршруты из декораторов @Get, @Post и т.д.',
  },
  {
    id: 'mod3',
    difficulty: 'easy',
    question: 'Чем отличается поле exports от поля providers?',
    options: [
      'Это одно и то же, разные названия',
      'providers — зависимости модуля; exports — что из них видно снаружи',
      'providers глобальные, exports — только для текущего модуля',
      'exports нужен исключительно для контроллеров при подключении к роутингу',
    ],
    correct: 1,
    explanation: 'providers — что модуль создаёт и использует сам. exports — что он готов отдать другим. Без exports провайдеры модуля закрыты снаружи — это инкапсуляция по умолчанию.',
  },
  {
    id: 'mod4',
    difficulty: 'easy',
    question: 'Что такое AppModule?',
    options: [
      'Модуль для подключения к базе данных',
      'Корневой модуль — точка входа, объединяет все остальные',
      'Папка, которую NestJS сканирует автоматически при старте сервера',
      'Конфигурационный файл в формате TypeScript для настройки DI-контейнера',
    ],
    correct: 1,
    explanation: 'AppModule — самый верхний модуль в иерархии. NestFactory.create(AppModule) стартует с него и «раскрывает» всё приложение. Обычно только импортирует другие модули.',
  },
  {
    id: 'mod5',
    difficulty: 'easy',
    question: 'MovieModule создан, но не добавлен в imports AppModule. Что произойдёт?',
    options: [
      'NestJS найдёт его по соглашению имён файлов',
      'Маршруты MovieController будут недоступны',
      'Модуль загрузится лениво при первом запросе к его маршруту',
      'Приложение не запустится: NestJS требует чтобы все модули были явно перечислены в AppModule ещё на этапе компиляции',
    ],
    correct: 1,
    explanation: 'NestJS не сканирует папки автоматически. Если модуль не попал в imports AppModule (или цепочку модулей которую видит AppModule) — его контроллеры не зарегистрированы.',
  },
  {
    id: 'mod6',
    difficulty: 'medium',
    question: 'AuthModule хочет использовать UserService. Что нужно сделать в UserModule?',
    options: [
      'Добавить UserService в exports',
      'Добавить @Injectable() на UserModule',
      'Добавить UserService в imports AuthModule напрямую, минуя module-уровень',
      'Создать отдельный SharedModule который дублирует UserService для каждого потребителя',
    ],
    correct: 0,
    explanation: 'Два шага: UserModule добавляет UserService в exports (открывает доступ), AuthModule добавляет UserModule в imports (подключает его). Без exports — сервис закрыт, без imports — не виден.',
  },
  {
    id: 'mod7',
    difficulty: 'medium',
    question: 'AuthModule импортирует UserModule, но UserModule не добавил UserService в exports. Что случится при запуске?',
    options: [
      'Nest стартует, но инжекция вернёт undefined',
      'Ошибка TypeScript при компиляции',
      'Ошибка при старте: зависимость не найдена',
      'NestJS создаст новый экземпляр UserService автоматически, минуя DI-граф и модульные ограничения',
    ],
    correct: 2,
    explanation: 'NestJS строит DI-граф при инициализации. Если AuthModule ищет UserService, которого нет в его «видимости» — ошибка при старте, ещё до первого запроса.',
  },
  {
    id: 'mod8',
    difficulty: 'medium',
    code: `@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}
}`,
    question: 'Что нужно, чтобы этот код заработал корректно?',
    options: [
      'Добавить UserService в providers AuthModule',
      'UserModule экспортирует UserService, AuthModule импортирует UserModule',
      'Использовать new UserService() вместо инжекции',
      'Добавить @Global() на AuthService и прописать UserService в AppModule.providers для глобального доступа',
    ],
    correct: 1,
    explanation: 'DI-контейнер NestJS разрешает зависимости по типу. UserService должен быть экспортирован из UserModule, а UserModule — добавлен в imports AuthModule.',
  },
  {
    id: 'mod9',
    difficulty: 'medium',
    question: 'Что делает @Global() на модуле?',
    options: [
      'Делает exports модуля доступными везде без явного imports',
      'Регистрирует провайдеры как синглтон с приоритетом над локальными зависимостями',
      'Запрещает другим модулям переопределять провайдеры данного модуля',
      'Создаёт глобальный namespace для предотвращения конфликтов имён классов',
    ],
    correct: 0,
    explanation: '@Global() означает: добавь модуль один раз в AppModule, и его exports будут видны во всём приложении. Остальные модули не пишут imports: [GlobalModule].',
  },
  {
    id: 'mod10',
    difficulty: 'medium',
    question: 'Когда стоит применять @Global()?',
    options: [
      'Для инфраструктуры: Prisma, Config, Logger',
      'Для каждого модуля, чтобы не прописывать imports вручную в каждом файле проекта',
      'Для модулей, которые используются хотя бы в двух разных местах',
      'Только для тестовых и mock-модулей в e2e-тестах',
    ],
    correct: 0,
    explanation: '@Global() — для инфраструктуры, которая нужна повсюду. Бизнес-модули должны явно объявлять зависимости — это делает код читаемым и архитектуру понятной.',
  },
  {
    id: 'mod11',
    difficulty: 'hard',
    question: 'DatabaseModule помечен @Global(). Куда его добавить в imports?',
    options: [
      'В каждый модуль, который использует PrismaService, чтобы явно документировать зависимости',
      'Только в AppModule один раз',
      'Нигде — @Global() полностью снимает необходимость в любых imports',
      'В AppModule и в каждый feature-модуль, иначе DI-контейнер не создаст экземпляр сервиса',
    ],
    correct: 1,
    explanation: '@Global() не освобождает от добавления в imports AppModule — это нужно, чтобы NestJS вообще создал модуль. В остальные модули добавлять не нужно.',
  },
  {
    id: 'mod12',
    difficulty: 'hard',
    code: `@Global()
@Module({
  providers: [ConfigService],
  // exports нет
})
export class ConfigModule {}`,
    question: 'Можно ли инжектировать ConfigService в другом модуле?',
    options: [
      'Да — @Global() автоматически экспортирует все providers модуля',
      'Нет — exports обязателен даже для @Global() модулей',
      'Да — если добавить ConfigModule в imports нужного модуля явно',
      'Зависит от версии NestJS и флага в tsconfig',
    ],
    correct: 1,
    explanation: '@Global() и exports — разные механизмы. @Global() говорит "не нужен явный imports в других модулях". exports говорит "этот провайдер можно взять снаружи". Без exports — ничего не отдаётся.',
  },
  {
    id: 'mod13',
    difficulty: 'hard',
    question: 'Можно ли написать imports: [MovieService] напрямую в другом модуле?',
    options: [
      'Да — если MovieService помечен @Injectable()',
      'Нет — imports принимает только модули',
      'Да — любой @Injectable() класс работает в imports вместо модуля',
      'Только через DynamicModule с forFeature() который оборачивает отдельные сервисы в псевдо-модуль',
    ],
    correct: 1,
    explanation: 'imports принимает модули (@Module()-классы). Провайдер становится доступным только через цепочку: exports модуля-источника → imports целевого модуля.',
  },
  {
    id: 'mod14',
    difficulty: 'hard',
    question: 'Зачем предпочитать явный imports/exports бизнес-модулей перед @Global()?',
    options: [
      'Явные imports быстрее — нет оверхеда поиска в глобальном реестре',
      'Зависимости видны прямо в коде модуля — архитектура читаема',
      '@Global() не поддерживается без дополнительных пакетов вроде ConfigModule или Prisma',
      'Явные imports создают изолированные экземпляры сервиса для каждого потребителя, что нужно при параллельном тестировании',
    ],
    correct: 1,
    explanation: 'Явная зависимость — документация в коде: imports: [UserModule] сразу говорит, от чего зависит модуль. С @Global() зависимости неявные — их сложнее отследить в большой кодовой базе.',
  },
  {
    id: 'mod15',
    difficulty: 'hard',
    question: 'Модули A, B и C независимо используют ServiceD из ModuleD. ModuleD не @Global(). Что нужно?',
    options: [
      'Добавить ModuleD в imports A, B, C; добавить ServiceD в exports ModuleD',
      'Прописать ServiceD в providers каждого из A, B и C — тогда каждый модуль создаст собственный независимый экземпляр сервиса',
      'Пометить ModuleD как @Global() — единственный способ избежать дублирования imports',
      'Создать три отдельные копии ServiceD специально для каждого потребителя',
    ],
    correct: 0,
    explanation: 'Стандартный путь: ModuleD экспортирует ServiceD, каждый из A/B/C импортирует ModuleD. DI-контейнер создаст ServiceD один раз — синглтон, общий для всех потребителей.',
  },
];
