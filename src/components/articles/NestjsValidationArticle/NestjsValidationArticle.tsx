import { SectionTitle } from '@/components/ui/ArticleSection/ArticleSection';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import { Callout } from '@/components/ui/Callout/Callout';
import { QuizBlock } from '@/components/ui/QuizBlock/QuizBlock';
import { HomeworkBlock } from '@/components/ui/HomeworkBlock/HomeworkBlock';
import { ValidatorPlayground } from './ValidatorPlayground';
import { QUIZ_QUESTIONS } from './quizData';
import s from './NestjsValidationArticle.module.scss';

const DECORATOR_GROUPS = [
  {
    title: 'Строки',
    rows: [
      { name: '@IsString()',       desc: 'Значение должно быть строкой. Отклонит число, boolean, массив.' },
      { name: '@IsNotEmpty()',     desc: 'Строка не должна быть пустой ("") или состоять только из пробелов.' },
      { name: '@Length(min, max)', desc: 'Длина строки от min до max символов. Заменяет пару MinLength + MaxLength.' },
      { name: '@MinLength(n)',     desc: 'Минимальная длина строки — n символов.' },
      { name: '@MaxLength(n)',     desc: 'Максимальная длина строки — n символов.' },
      { name: '@Matches(regex)',   desc: 'Строка должна соответствовать регулярному выражению. Кастомный формат пароля, кода, slug.' },
    ],
  },
  {
    title: 'Числа',
    rows: [
      { name: '@IsNumber()',    desc: 'Любое число, включая дробные (3.14 пройдёт).' },
      { name: '@IsInt()',       desc: 'Только целое число. Дробное 3.14 — ошибка.' },
      { name: '@IsPositive()', desc: 'Число строго больше нуля. Ноль и отрицательные — ошибка.' },
    ],
  },
  {
    title: 'Специальные',
    rows: [
      { name: '@IsBoolean()',          desc: 'Значение должно быть true или false (не строка "true").' },
      { name: '@IsOptional()',         desc: 'Поле необязательно. Если не передано — остальные декораторы пропускаются.' },
      { name: '@IsArray()',            desc: 'Значение должно быть массивом.' },
      { name: '@IsEnum(MyEnum)',       desc: 'Значение должно быть одним из значений enum. С { each: true } — проверяет каждый элемент массива.' },
      { name: '@IsUrl(options)',        desc: 'Валидный URL. Настройки: protocols, require_protocol, host_whitelist, host_blacklist.' },
      { name: '@IsUUID(version)',       desc: 'UUID формата 1, 3, 4, 5 или "all". Полезно для принятия ID из базы данных.' },
    ],
  },
];

export function NestjsValidationArticle() {
  return (
    <div className={s.article}>

      {/* ── 1. Зачем нужна валидация ──────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Зачем нужна валидация</SectionTitle>
        <p className={s.lead}>
          Без валидации клиент может передать что угодно: пустую строку, число вместо
          булева, случайный текст вместо UUID. Это источник ошибок и уязвимостей.
          Валидация через DTO решает проблему <strong>до</strong> попадания данных в сервис.
        </p>
        <div className={s.flow}>
          <span className={s.flowStep}>Client</span>
          <span className={s.flowArrow}>→</span>
          <span className={`${s.flowStep} ${s.accent}`}>ValidationPipe</span>
          <span className={s.flowArrow}>→</span>
          <span className={`${s.flowStep} ${s.ok}`}>Controller (данные чистые)</span>
          <span className={s.flowArrow}>/</span>
          <span className={`${s.flowStep} ${s.bad}`}>400 Bad Request</span>
        </div>
        <p className={s.body}>
          Если данные не прошли валидацию — клиент сразу получает{' '}
          <code>400 Bad Request</code> с массивом ошибок. Контроллер и сервис
          даже не вызываются.
        </p>
      </section>

      {/* ── 2. Установка ─────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Установка и подключение</SectionTitle>
        <p className={s.body}>Две библиотеки:</p>
        <CodeHighlight lang="bash" code={`yarn add class-validator class-transformer

# или npm
npm install class-validator class-transformer`} />
        <p className={s.body}>
          <strong>class-validator</strong> — декораторы для проверки данных.<br />
          <strong>class-transformer</strong> — превращает входящий JSON в экземпляр класса DTO,
          чтобы декораторы могли сработать.
        </p>
        <p className={s.body}>
          Затем подключаем <code>ValidationPipe</code> глобально в <code>main.ts</code>:
        </p>
        <CodeHighlight lang="ts" filename="src/main.ts" code={`import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Одна строка — валидация работает для всех контроллеров
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();`} />
        <Callout variant="info">
          <code>ValidationPipe</code> без параметров уже работает корректно.
          Дополнительные опции: <code>whitelist: true</code> — удаляет поля которых нет в DTO,
          <code>forbidNonWhitelisted: true</code> — бросает ошибку если пришло лишнее поле.
        </Callout>
      </section>

      {/* ── 3. Строки ────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Валидация строк</SectionTitle>
        <CodeHighlight lang="ts" filename="src/task/dto/create-task.dto.ts" code={`import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 40)
  title: string;
}`} />
        <p className={s.body}>
          Три декоратора работают независимо. Если <code>title = ""</code> — придут сразу
          две ошибки: от <code>@IsNotEmpty</code> и от <code>@Length</code>.
          ValidationPipe собирает <em>все</em> нарушения за один проход.
        </p>
        <CodeHighlight lang="ts" code={`// Кастомные сообщения — передаём объект с message
@IsString({ message: 'Название задачи должно быть строкой' })
@IsNotEmpty({ message: 'Название задачи не может быть пустым' })
@Length(2, 40, { message: 'Название должно быть от 2 до 40 символов' })
title: string;

// Результат при нарушении:
// { statusCode: 400, message: ["..."], error: "Bad Request" }`} />
        <p className={s.body}>
          Для паролей используй <code>@Matches</code> — проверяет регулярное выражение:
        </p>
        <CodeHighlight lang="ts" code={`import { IsString, MinLength, Matches } from 'class-validator';

@IsString({ message: 'Пароль должен быть строкой' })
@MinLength(6, { message: 'Минимальная длина — 6 символов' })
@Matches(/^(?=.*[A-Z])(?=.*[0-9]).+$/, {
  message: 'Пароль должен содержать хотя бы одну заглавную букву и цифру',
})
password: string;`} />
      </section>

      {/* ── 4. Числа ─────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Валидация чисел</SectionTitle>
        <CodeHighlight lang="ts" code={`import { IsInt, IsPositive, IsOptional } from 'class-validator';

// Приоритет: необязательный, целое положительное число
@IsOptional()
@IsInt({ message: 'Приоритет должен быть целым числом' })
@IsPositive({ message: 'Приоритет должен быть положительным' })
priority: number;`} />
        <p className={s.body}>
          <code>@IsNumber()</code> пропустит <code>3.14</code>.
          <code>@IsInt()</code> отклонит — только целые.
          Для приоритетов, количества, порядковых номеров — всегда <code>@IsInt</code>.
        </p>
        <Callout variant="warn">
          По умолчанию NestJS принимает JSON, где числа уже числа. Если числа приходят как
          строки (например из form-data) — нужно добавить в <code>ValidationPipe</code>{' '}
          опцию <code>transform: true</code>, чтобы class-transformer преобразовал типы автоматически.
        </Callout>
      </section>

      {/* ── 5. Опциональные и Boolean ────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>@IsOptional и @IsBoolean</SectionTitle>
        <CodeHighlight lang="ts" code={`import { IsBoolean, IsOptional, IsString } from 'class-validator';

// Обязательное булево поле
@IsBoolean({ message: 'Статус должен быть булевым выражением' })
isCompleted: boolean;

// Необязательная строка — если передана, должна быть строкой
@IsOptional()
@IsString({ message: 'Описание должно быть строкой' })
description?: string;`} />
        <p className={s.body}>
          <code>@IsOptional()</code> нужен когда поле в DTO можно не передавать вообще.
          Без него class-validator считает любое описанное поле обязательным — и выбросит ошибку если клиент его не прислал.
          С <code>@IsOptional()</code>: не прислал — ок, прислал — остальные декораторы на этом поле всё равно сработают.
        </p>
      </section>

      {/* ── 6. Массивы и Enum ────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Массивы и Enum</SectionTitle>
        <CodeHighlight lang="ts" code={`import { IsArray, IsEnum, IsOptional } from 'class-validator';

export enum TaskTag {
  WORK  = 'work',
  STUDY = 'study',
  HOME  = 'home',
}

// Необязательный массив тегов — только значения из enum
@IsOptional()
@IsArray({ message: 'Теги должны быть массивом' })
@IsEnum(TaskTag, { each: true, message: 'Недопустимое значение тега' })
tags: TaskTag[];`} />
        <p className={s.body}>
          Ключевой момент — <code>{'{ each: true }'}</code>: применить декоратор к каждому
          элементу массива по отдельности. Без этой опции{' '}
          <code>@IsEnum</code> проверит весь массив как одно значение и пропустит мусор внутри.
        </p>
        <CodeHighlight lang="ts" code={`// Клиент отправляет:
{ "tags": ["work", "study"] }        // ✓ OK
{ "tags": ["work", "coding"] }       // ✗ "Недопустимое значение тега"
{ "tags": "work" }                   // ✗ "Теги должны быть массивом"
{ "tags": ["work", true, 123] }      // ✗ each: true поймает нестроки`} />
      </section>

      {/* ── 7. URL ───────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>@IsUrl — валидация URL</SectionTitle>
        <p className={s.body}>
          <code>@IsUrl</code> принимает два аргумента: объект настроек и объект с{' '}
          <code>message</code>.
        </p>
        <CodeHighlight lang="ts" code={`import { IsUrl } from 'class-validator';

@IsUrl(
  {
    protocols: ['https', 'wss'],   // только эти протоколы
    require_protocol: true,        // протокол обязателен
    require_port: false,           // порт не нужен
    require_valid_protocol: true,  // протокол должен существовать
    host_whitelist: ['google.com', 'yandex.ru'], // разрешённые хосты
    host_blacklist: ['example.com'],             // запрещённые хосты
  },
  { message: 'Некорректный формат URL' },
)
websiteUrl: string;

// "https://google.com"   → ✓
// "http://google.com"    → ✗ (только https/wss)
// "https://youtube.com"  → ✗ (не в whitelist)
// "https://example.com"  → ✗ (в blacklist)`} />
      </section>

      {/* ── 8. UUID ──────────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>@IsUUID — валидация UUID</SectionTitle>
        <CodeHighlight lang="ts" code={`import { IsUUID } from 'class-validator';

@IsUUID('4', { message: 'Некорректный формат id' })
userId: string;

// "a3bb189e-8bf9-4f7d-8d9e-2b0c1a2b3c4d" → ✓ UUID v4
// "1234"                                   → ✗
// "a3bb189e-8bf9-3..."                     → ✗ (версия 3, не 4)`} />
        <p className={s.body}>
          Первый аргумент — версия UUID: <code>'1'</code>, <code>'3'</code>,{' '}
          <code>'4'</code>, <code>'5'</code> или <code>'all'</code>. UUID v4 —
          самый распространённый, он генерируется случайно.
        </p>
      </section>

      {/* ── 9. Справочник ────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Справочник декораторов</SectionTitle>
        <div className={s.decTable}>
          {DECORATOR_GROUPS.map(group => (
            <div key={group.title} className={s.decGroup}>
              <div className={s.decGroupTitle}>{group.title}</div>
              {group.rows.map(row => (
                <div key={row.name} className={s.decRow}>
                  <div className={s.decName}>{row.name}</div>
                  <div className={s.decDesc} dangerouslySetInnerHTML={{ __html:
                    row.desc.replace(/`([^`]+)`/g, '<code>$1</code>')
                  }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. Playground ───────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionTitle>Decorator Tester</SectionTitle>
        <p className={s.body}>
          Выбери декоратор из списка, введи значение и посмотри пройдёт ли валидацию.
          Используй быстрые примеры чтобы проверить граничные случаи.
        </p>
        <ValidatorPlayground />
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
          <>Сгенерируй ресурс <code>nest g res book --no-spec</code>. Создай <code>CreateBookDto</code> с обязательными полями: <code>title: string</code> (<code>@Length(3, 100)</code>) и <code>author: string</code> (<code>@IsNotEmpty</code>). Добавь кастомные сообщения для обоих.</>,
          <>Добавь обязательное поле <code>price: number</code> — целое положительное число (цена в рублях). Используй <code>@IsInt</code> и <code>@IsPositive</code> с сообщениями.</>,
          <>Создай enum <code>BookGenre</code> с вариантами <code>'fiction'</code>, <code>'non-fiction'</code>, <code>'science'</code>, <code>'history'</code>. Добавь в DTO необязательное поле <code>genres: BookGenre[]</code> с декораторами <code>@IsOptional</code>, <code>@IsArray</code> и <code>@IsEnum</code> с <code>each: true</code>.</>,
          <>Добавь необязательное поле <code>isbn: string</code> — строка в формате <code>978-XXXXXXXXXX</code>. Используй <code>@IsOptional</code> и <code>@Matches</code> с подходящим регулярным выражением.</>,
          <>Протестируй в Postman: отправь запрос с <code>price: "дорого"</code>, <code>genres: ["thriller"]</code> и <code>isbn: "12345"</code> одновременно — убедись что в ответе сразу три ошибки.</>,
        ]} />
      </section>

    </div>
  );
}
