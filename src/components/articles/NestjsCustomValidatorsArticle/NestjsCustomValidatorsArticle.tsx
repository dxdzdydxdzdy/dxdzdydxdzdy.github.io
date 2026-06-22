import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { Callout } from '@/components/ui/Callout/Callout';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { HomeworkBlock } from '@/components/ui/HomeworkBlock/HomeworkBlock';
import { CustomValidatorDemo } from './CustomValidatorDemo';
import { QUIZ_QUESTIONS } from './quizData';
import s from './NestjsCustomValidatorsArticle.module.scss';

const ANATOMY = [
  { key: 'name',         val: 'Уникальное имя декоратора — используется в отладочных сообщениях class-validator.' },
  { key: 'target',       val: 'Класс, на поле которого вешается декоратор. Всегда object.constructor.' },
  { key: 'propertyName', val: 'Имя поля — строка. Берётся из параметра функции-обёртки.' },
  { key: 'options',      val: 'ValidationOptions от пользователя. Позволяет переопределить message снаружи.' },
  { key: 'constraints',  val: 'Массив параметров декоратора. Доступны внутри validate() через args.constraints.' },
  { key: 'validator',    val: 'Объект или класс с методами validate() и defaultMessage().' },
];

const ARGS_FIELDS = [
  { key: 'args.value',       desc: 'Текущее значение проверяемого поля.' },
  { key: 'args.object',      desc: 'Весь экземпляр DTO — все поля запроса. Нужен для кросс-полевой валидации.' },
  { key: 'args.property',    desc: 'Имя поля как строка. Удобно для динамических сообщений.' },
  { key: 'args.constraints', desc: 'Параметры декоратора. @StartsWith("task-") → constraints[0] === "task-".' },
  { key: 'args.targetName',  desc: 'Имя класса DTO. Полезно в общих декораторах для диагностики.' },
];

export function NestjsCustomValidatorsArticle() {
  return (
    <div className={s.article}>

      {/* ── 1. Зачем ─────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Зачем нужны кастомные декораторы</SectionTitle>
        <p className={s.lead}>
          Встроенные декораторы class-validator покрывают большинство задач. Но иногда
          правило слишком специфично: строка должна начинаться с определённого префикса,
          два поля должны совпадать, или нужно проверить уникальность email в базе данных.
          Для всего этого создают кастомный декоратор.
        </p>
        <p className={s.body}>
          Кастомный декоратор — это обычная TypeScript-функция, которая вызывает{' '}
          <code>registerDecorator</code> из класс-валидатора. Снаружи выглядит как
          любой другой декоратор: <code>@IsSlug()</code>, <code>@StartsWith('task-')</code>.
        </p>
      </section>

      {/* ── 2. Структура ─────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Структура: из чего состоит</SectionTitle>
        <p className={s.body}>
          Любой кастомный декоратор — это функция-обёртка которая внутри вызывает{' '}
          <code>registerDecorator</code>. У него шесть полей:
        </p>
        <div className={s.anatomy}>
          {ANATOMY.map(r => (
            <div key={r.key} className={s.anatRow}>
              <div className={s.anatKey}>{r.key}</div>
              <div className={s.anatVal} dangerouslySetInnerHTML={{ __html:
                r.val.replace(/`([^`]+)`/g, '<code>$1</code>')
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Способ 1: inline ──────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Способ 1 — inline validator</SectionTitle>
        <p className={s.body}>
          Самый компактный вариант: объект с <code>validate</code> и{' '}
          <code>defaultMessage</code> передаётся прямо в <code>registerDecorator</code>.
          Подходит для простых декораторов без внешних зависимостей.
        </p>
        <p className={s.body}>
          Вот реальный декоратор из проекта — проверяет что строка начинается
          с заданного префикса:
        </p>
        <CodeHighlight lang="ts" filename="src/task/decorators/starts-with.decorator.ts" code={`import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function StartsWith(
  prefix: string,
  validationOptions?: ValidationOptions
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'startsWith',
      target: object.constructor,
      propertyName,
      options: validationOptions,  // передаём наружу чтобы message можно было переопределить
      constraints: [prefix],       // параметр декоратора — доступен внутри через args.constraints[0]
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [pfx] = args.constraints;
          return typeof value === 'string' && value.startsWith(pfx);
        },
        defaultMessage(args: ValidationArguments) {
          const [pfx] = args.constraints;
          return \`Название должно начинаться с "\${pfx}"\`;
        },
      },
    });
  };
}`} />
        <p className={s.body}>Использование в DTO:</p>
        <CodeHighlight lang="ts" code={`import { StartsWith } from './decorators/starts-with.decorator';

export class CreateTaskDto {
  @StartsWith('task-')
  title: string;

  // Переопределить сообщение:
  @StartsWith('task-', { message: 'Заголовок должен начинаться с task-' })
  title: string;
}`} />
      </section>

      {/* ── 4. ValidationArguments ───────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>ValidationArguments — что внутри</SectionTitle>
        <p className={s.body}>
          Второй аргумент метода <code>validate(value, args)</code> — объект{' '}
          <code>ValidationArguments</code>. В нём всё что может понадобиться:
        </p>
        <div className={s.argsTable}>
          <div className={s.argsHead}>
            <div className={s.argsHCell}>Поле</div>
            <div className={s.argsHCell}>Содержимое</div>
          </div>
          {ARGS_FIELDS.map(r => (
            <div key={r.key} className={s.argsRow}>
              <div className={s.argsKey}>{r.key}</div>
              <div className={s.argsDesc} dangerouslySetInnerHTML={{ __html:
                r.desc.replace(/`([^`]+)`/g, '<code>$1</code>')
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Способ 2: class-based ─────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Способ 2 — class-based через @ValidatorConstraint</SectionTitle>
        <p className={s.body}>
          Второй подход — вынести логику в отдельный класс с декоратором{' '}
          <code>@ValidatorConstraint</code>. Это удобнее когда декоратор сложный,
          переиспользуется в нескольких местах, или нужны инжекции.
        </p>
        <div className={s.compare}>
          <div className={s.compareCol}>
            <span className={`${s.compareLabel} ${s.a}`}>inline</span>
            <CodeHighlight lang="ts" code={`registerDecorator({
  validator: {
    validate(value: any) {
      return /^[a-z0-9-]+$/.test(value);
    },
    defaultMessage() {
      return 'Неверный формат slug';
    },
  },
});`} />
          </div>
          <div className={s.compareCol}>
            <span className={`${s.compareLabel} ${s.b}`}>class-based</span>
            <CodeHighlight lang="ts" code={`@ValidatorConstraint({ name: 'isSlug' })
class IsSlugConstraint
  implements ValidatorConstraintInterface {

  validate(value: any) {
    return /^[a-z0-9-]+$/.test(value);
  }
  defaultMessage() {
    return 'Неверный формат slug';
  }
}

registerDecorator({
  validator: IsSlugConstraint,
});`} />
          </div>
        </div>
        <p className={s.body}>Полный пример <code>@IsSlug()</code> через класс:</p>
        <CodeHighlight lang="ts" filename="src/common/decorators/is-slug.decorator.ts" code={`import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isSlug', async: false })
export class IsSlugConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    // строчные буквы, цифры, дефисы; без пробелов и спецсимволов
    return typeof value === 'string'
      && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  }

  defaultMessage() {
    return 'Должен быть slug: строчные буквы, цифры и дефисы без пробелов';
  }
}

export function IsSlug(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsSlugConstraint,  // ← передаём класс, не объект
    });
  };
}`} />
      </section>

      {/* ── 6. Кросс-полевая валидация ───────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Кросс-полевая валидация — доступ к другим полям</SectionTitle>
        <p className={s.lead}>
          Через <code>args.object</code> внутри <code>validate()</code> доступен
          весь DTO. Это позволяет сравнивать поля между собой — классический пример:
          подтверждение пароля.
        </p>
        <CodeHighlight lang="ts" filename="src/common/decorators/matches-field.decorator.ts" code={`import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function MatchesField(
  fieldName: string,
  validationOptions?: ValidationOptions
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'matchesField',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [fieldName],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [field] = args.constraints;
          // args.object — весь объект DTO со всеми полями
          const relatedValue = (args.object as Record<string, unknown>)[field];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [field] = args.constraints;
          return \`Поле "\${args.property}" должно совпадать с "\${field}"\`;
        },
      },
    });
  };
}`} />
        <CodeHighlight lang="ts" code={`export class RegisterDto {
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MatchesField('password', { message: 'Пароли не совпадают' })
  confirmPassword: string;
}

// { password: 'Secret1', confirmPassword: 'Secret1' }  → ✓
// { password: 'Secret1', confirmPassword: 'wrong'    }  → ✗ "Пароли не совпадают"`} />
        <Callout variant="warn">
          Порядок важен: <code>password</code> должен быть объявлен до <code>confirmPassword</code> в классе,
          иначе <code>args.object.password</code> окажется <code>undefined</code> на момент проверки
          в некоторых версиях class-validator.
        </Callout>
      </section>

      {/* ── 7. Async ─────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Async декоратор — проверка по базе данных</SectionTitle>
        <p className={s.body}>
          Когда нужно обратиться к БД (например, проверить уникальность email),{' '}
          <code>validate()</code> может возвращать <code>Promise{'<boolean>'}</code>.
          Для этого нужно указать <code>async: true</code> в{' '}
          <code>@ValidatorConstraint</code> и добавить <code>@Injectable()</code>
          чтобы получить сервис через DI-контейнер.
        </p>
        <CodeHighlight lang="ts" filename="src/common/decorators/is-unique-email.decorator.ts" code={`import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../../user/user.service';

@Injectable()
@ValidatorConstraint({ name: 'isUniqueEmail', async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string) {
    const user = await this.userService.findByEmail(email);
    return !user; // true = email свободен
  }

  defaultMessage() {
    return 'Email уже занят';
  }
}

export function IsUniqueEmail(options?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsUniqueEmailConstraint,
    });
  };
}`} />
        <Callout variant="info">
          Чтобы <code>IsUniqueEmailConstraint</code> получил <code>UserService</code> через DI,
          его нужно добавить в <code>providers</code> модуля:{' '}
          <code>providers: [IsUniqueEmailConstraint, UserService]</code>.
          Иначе NestJS создаст его без зависимостей и при первом вызове упадёт с ошибкой.
        </Callout>
      </section>

      {/* ── 8. Файловая структура ────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Где хранить файлы</SectionTitle>
        <CodeHighlight lang="bash" code={`src/
  common/
    decorators/
      is-slug.decorator.ts          ← декораторы общего назначения
      matches-field.decorator.ts
      is-unique-email.decorator.ts
  task/
    decorators/
      starts-with.decorator.ts      ← декоратор конкретного модуля
    dto/
      create-task.dto.ts`} />
        <p className={s.body}>
          Суффикс <code>.decorator.ts</code> — стандартное соглашение NestJS.
          Если декоратор нужен только в одном модуле — кладём рядом с ним.
          Если используется в нескольких — выносим в <code>common/decorators/</code>.
        </p>
      </section>

      {/* ── 9. Demo ──────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Попробуй сам</SectionTitle>
        <p className={s.body}>
          Три декоратора из статьи в действии. Слева — полный исходный код,
          справа — поле для ввода значений и результат валидации.
        </p>
        <CustomValidatorDemo />
      </section>

      {/* ── Quiz ─────────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Проверь себя</SectionTitle>
        <QuizBlock questions={QUIZ_QUESTIONS} />
      </section>

      {/* ── Homework ─────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Практика</SectionTitle>
        <HomeworkBlock items={[
          <>Создай inline-декоратор <code>@IsISBN()</code> для валидации ISBN-13 (13 цифр, может содержать дефисы). Помести в <code>src/book/decorators/is-isbn.decorator.ts</code> и примени к полю <code>isbn</code> в <code>CreateBookDto</code>.</>,
          <>Создай параметризованный декоратор <code>@MaxWords(n)</code> — строка должна содержать не более n слов. Применение: <code>@MaxWords(20)</code> на поле <code>description</code>. Количество слов считай через <code>value.trim().split(/\s+/).length</code>.</>,
          <>Создай class-based декоратор <code>@IsPositiveOrZero()</code> через <code>@ValidatorConstraint</code> — число должно быть {'≥ 0'}. Примени к полю <code>discount: number</code> (скидка в процентах).</>,
          <>Создай кросс-полевой декоратор <code>@IsLessThan(field)</code> — число должно быть меньше значения другого поля. Пример: <code>@IsLessThan('originalPrice')</code> на поле <code>salePrice</code>. Проверь через Postman что <code>salePrice: 200, originalPrice: 100</code> даёт ошибку.</>,
          <>Создай декоратор <code>@IsFullName()</code> — строка должна состоять ровно из трёх слов (фамилия, имя, отчество). Примени к полю <code>name</code> в <code>CreateAuthorDto</code>. Протестируй в Postman: <code>"Толстой Лев Николаевич"</code> — должно пройти, <code>"Лев Толстой"</code> и <code>"Лев"</code> — нет.</>,
        ]} />
      </section>

    </div>
  );
}
