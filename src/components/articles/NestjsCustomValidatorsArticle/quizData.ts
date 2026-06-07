import type { QuizQuestion } from '@/components/ui/QuizBlock/QuizBlock';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'cv1',
    difficulty: 'easy',
    question: 'Когда стоит создавать кастомный декоратор вместо встроенного?',
    options: [
      'Всегда — кастомные декораторы лучше встроенных',
      'Когда встроенных декораторов достаточно для задачи',
      'Когда нужна логика, которую нельзя выразить через встроенные декораторы',
      'Только при работе с базой данных',
    ],
    correct: 2,
    explanation: 'Кастомный декоратор создаётся когда встроенных не хватает: нестандартный формат строки, проверка относительно другого поля, асинхронная проверка по БД. Если задачу решает @IsString или @Matches — кастомный не нужен.',
  },
  {
    id: 'cv2',
    difficulty: 'easy',
    question: 'Что делает функция registerDecorator?',
    options: [
      'Регистрирует новый HTTP-маршрут',
      'Добавляет декоратор в глобальный список NestJS',
      'Связывает property-декоратор с логикой валидации в class-validator',
      'Создаёт экземпляр класса DTO',
    ],
    correct: 2,
    explanation: 'registerDecorator — функция class-validator, которая регистрирует правило валидации для конкретного поля конкретного класса. Принимает target (класс), propertyName, validator с методами validate и defaultMessage.',
  },
  {
    id: 'cv3',
    difficulty: 'easy',
    question: 'Какой интерфейс нужно реализовать при создании декоратора через класс?',
    options: [
      'ValidatorInterface',
      'ValidationRule',
      'ConstraintValidator',
      'ValidatorConstraintInterface',
    ],
    correct: 3,
    explanation: 'ValidatorConstraintInterface из class-validator требует реализации двух методов: validate(value, args) — логика проверки, и defaultMessage(args) — сообщение по умолчанию.',
  },
  {
    id: 'cv4',
    difficulty: 'easy',
    question: 'Что возвращает метод validate() в кастомном декораторе?',
    options: [
      'Строку с сообщением об ошибке или null',
      'true если данные валидны, false если нет',
      'Объект { valid: boolean, message: string }',
      'Promise<void>',
    ],
    correct: 1,
    explanation: 'validate() возвращает boolean: true — валидно, false — ошибка. При false class-validator вызовет defaultMessage() или использует сообщение из validationOptions. Async validator может возвращать Promise<boolean>.',
  },
  {
    id: 'cv5',
    difficulty: 'medium',
    question: 'Зачем нужно поле constraints в registerDecorator?',
    options: [
      'Для указания типа поля DTO',
      'Для передачи параметров декоратора внутрь validator.validate()',
      'Для установки приоритета валидации',
      'Для указания версии class-validator',
    ],
    correct: 1,
    explanation: 'constraints — массив аргументов, которые передаются при вызове декоратора: @StartsWith("task-") → constraints: ["task-"]. Внутри validate() доступны через args.constraints[0], args.constraints[1] и т.д.',
  },
  {
    id: 'cv6',
    difficulty: 'medium',
    code: `validator: {
  validate(value: any, args: ValidationArguments) {
    const [field] = args.constraints;
    const related = (args.object as any)[field];
    return value === related;
  }
}`,
    question: 'Что содержит args.object в этом валидаторе?',
    options: [
      'Только значение текущего поля',
      'Весь объект DTO со всеми переданными полями',
      'Метаданные класса',
      'Объект запроса Express/Fastify',
    ],
    correct: 1,
    explanation: 'args.object — экземпляр DTO-класса с реальными значениями всех полей. Именно это позволяет кросс-полевую валидацию: получить значение другого поля и сравнить с текущим.',
  },
  {
    id: 'cv7',
    difficulty: 'medium',
    question: 'В чём разница между inline-validator (объект в registerDecorator) и class-based (@ValidatorConstraint)?',
    options: [
      'Они полностью идентичны по возможностям',
      'Class-based поддерживает async, inline — нет',
      'Inline компактнее для простых случаев; class-based позволяет инжектировать сервисы NestJS',
      'Inline работает быстрее',
    ],
    correct: 2,
    explanation: 'Inline удобен для простой логики без зависимостей. Class-based с @Injectable() позволяет инжектировать UserService, Repository и т.д. — необходимо для async-проверок по БД (уникальность email и т.п.).',
  },
  {
    id: 'cv8',
    difficulty: 'medium',
    code: `registerDecorator({
  name: 'startsWith',
  target: object.constructor,
  propertyName,
  options: validationOptions,
  constraints: [prefix],
  validator: { ... }
});`,
    question: 'Зачем передавать validationOptions вторым аргументом в registerDecorator через поле options?',
    options: [
      'Это обязательное требование API',
      'Чтобы пользователь декоратора мог переопределить сообщение об ошибке через { message: "..." }',
      'Для настройки async-режима',
      'Чтобы установить приоритет среди других декораторов',
    ],
    correct: 1,
    explanation: 'validationOptions позволяет вызывающему коду переопределить стандартное сообщение: @StartsWith("task-", { message: "Моё сообщение" }). Без передачи options пользователь не сможет это сделать.',
  },
  {
    id: 'cv9',
    difficulty: 'medium',
    question: 'Где принято хранить файлы кастомных декораторов в NestJS проекте?',
    options: [
      'Прямо в DTO-файле',
      'В корне src/',
      'В папке decorators/ внутри модуля или в shared/decorators/',
      'В папке validators/ рядом с main.ts',
    ],
    correct: 2,
    explanation: 'Конвенция: src/task/decorators/ для декораторов конкретного модуля, или src/common/decorators/ для общих. Имя файла: is-slug.decorator.ts, starts-with.decorator.ts — суффикс .decorator.ts.',
  },
  {
    id: 'cv10',
    difficulty: 'medium',
    question: 'Нужно проверить что email не занят в базе данных. Какой тип декоратора подходит?',
    options: [
      'Sync inline-validator',
      'Async validator с @ValidatorConstraint({ async: true }) и инжектированным сервисом',
      'Обычный @IsEmail()',
      'Middleware вместо декоратора',
    ],
    correct: 1,
    explanation: 'Проверка по БД — асинхронная операция. @ValidatorConstraint({ async: true }) + class с @Injectable() позволяет инжектировать UserRepository и вернуть Promise<boolean> из validate(). ValidationPipe дождётся результата.',
  },
  {
    id: 'cv11',
    difficulty: 'hard',
    code: `@ValidatorConstraint({ name: 'isSlug', async: false })
export class IsSlugConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  }
}`,
    question: 'Что произойдёт если передать value = undefined?',
    options: [
      'Ошибка Runtime — regex.test(undefined) выбросит исключение',
      'Валидация пройдёт — undefined не является строкой с неверным форматом',
      'test(undefined) вернёт false → ошибка валидации',
      'NestJS автоматически пропустит undefined без вызова validate()',
    ],
    correct: 2,
    explanation: 'regex.test(undefined) — JavaScript приведёт undefined к строке "undefined" и проверит против регекса. Это вернёт false → ошибку. Правильная защита: typeof value === "string" && /regex/.test(value).',
  },
  {
    id: 'cv12',
    difficulty: 'hard',
    question: 'Кросс-полевой декоратор @MatchesField("password") вешается на поле confirmPassword. Что будет если в DTO нет поля password вообще?',
    options: [
      'Ошибка компиляции TypeScript',
      'Декоратор выбросит исключение при запуске',
      'args.object.password будет undefined — сравнение с любым значением confirmPassword вернёт false',
      'NestJS автоматически пропустит проверку',
    ],
    correct: 2,
    explanation: 'Никакой ошибки при запуске не будет. args.object.password === undefined, а confirmPassword — скорее всего строка. undefined !== "anything" → валидация не пройдёт. Нужна явная проверка на существование поля.',
  },
  {
    id: 'cv13',
    difficulty: 'hard',
    question: 'Как правильно зарегистрировать class-based валидатор с инжекцией сервиса в NestJS?',
    options: [
      'Просто добавить @Injectable() на класс ограничения',
      'Добавить @Injectable() и зарегистрировать в providers модуля — тогда NestJS создаст его через IoC-контейнер',
      'Передать сервис напрямую в registerDecorator',
      'Это невозможно — class-validator работает вне IoC-контейнера NestJS',
    ],
    correct: 1,
    explanation: 'Класс @ValidatorConstraint + @Injectable() нужно добавить в providers модуля. NestJS создаст экземпляр с инжекцией. Без регистрации в providers — class-validator создаст его сам, без зависимостей.',
  },
  {
    id: 'cv14',
    difficulty: 'hard',
    question: 'Декоратор @ValidatorConstraint — для чего он нужен? Можно ли без него?',
    options: [
      'Обязателен — без него registerDecorator не работает',
      'Только для async-валидаторов',
      'Помечает класс как валидатор для class-validator и задаёт имя и режим (sync/async); без него нужно передавать объект validator inline',
      'Регистрирует класс в NestJS DI-контейнере',
    ],
    correct: 2,
    explanation: '@ValidatorConstraint({ name, async }) — это метаданные для class-validator: имя (для отладки) и async-флаг. Без него нужно использовать inline-validator (объект с validate и defaultMessage прямо в registerDecorator).',
  },
  {
    id: 'cv15',
    difficulty: 'hard',
    question: 'Что содержит args.property в ValidationArguments?',
    options: [
      'Значение поля',
      'Весь объект DTO',
      'Имя поля на котором висит декоратор',
      'Массив constraints',
    ],
    correct: 2,
    explanation: 'ValidationArguments содержит: value (значение поля), object (весь DTO), property (имя поля — строка), constraints (параметры декоратора), targetName (имя класса). property полезен для динамических сообщений: `Поле ${args.property} должно...`.',
  },
];
