'use client';

import { useState } from 'react';
import { CodeHighlight } from '@/components/ui/CodeHighlight/CodeHighlight';
import s from './CustomValidatorDemo.module.scss';

// ── Примеры декораторов ───────────────────────────────────────────────────────

const EXAMPLES = [
  {
    id: 'startsWith',
    title: '@StartsWith(prefix)',
    desc: 'Параметризованный декоратор — значение должно начинаться с указанного префикса.',
    code: `export default function StartsWith(
  prefix: string,
  validationOptions?: ValidationOptions
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'startsWith',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string'
            && value.startsWith(prefix);
        },
        defaultMessage() {
          return \`Название должно начинаться с "\${prefix}"\`;
        }
      }
    });
  };
}`,
    inputs: [
      { key: 'value', label: 'title', placeholder: 'task-...' },
      { key: 'prefix', label: 'prefix', placeholder: 'task-', isParam: true },
    ],
    validate: (vals: Record<string, string>) => {
      const v = vals['value'] ?? '';
      const p = vals['prefix'] ?? 'task-';
      if (!v.startsWith(p)) return `Название должно начинаться с "${p}"`;
      return null;
    },
  },
  {
    id: 'isSlug',
    title: '@IsSlug()',
    desc: 'Декоратор без параметров через ValidatorConstraint-класс — строка в формате slug (строчные буквы, цифры, дефисы).',
    code: `@ValidatorConstraint({ name: 'isSlug', async: false })
export class IsSlugConstraint
  implements ValidatorConstraintInterface {

  validate(value: any) {
    return typeof value === 'string'
      && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  }

  defaultMessage() {
    return 'Должен быть slug: строчные буквы, цифры и дефисы';
  }
}

export function IsSlug(options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsSlugConstraint,
    });
  };
}`,
    inputs: [
      { key: 'value', label: 'slug', placeholder: 'my-article-slug' },
    ],
    validate: (vals: Record<string, string>) => {
      const v = vals['value'] ?? '';
      return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)
        ? null
        : 'Должен быть slug: строчные буквы, цифры и дефисы';
    },
  },
  {
    id: 'matchesField',
    title: '@MatchesField(field)',
    desc: 'Кросс-полевая валидация — значение должно совпадать с другим полем объекта. Типичный пример: подтверждение пароля.',
    code: `export function MatchesField(
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
          // args.object — весь объект запроса
          const [field] = args.constraints;
          const related = (args.object as any)[field];
          return value === related;
        },
        defaultMessage(args: ValidationArguments) {
          const [field] = args.constraints;
          return \`Значение должно совпадать с полем "\${field}"\`;
        }
      }
    });
  };
}`,
    inputs: [
      { key: 'password',        label: 'password',        placeholder: 'секретный пароль' },
      { key: 'confirmPassword', label: 'confirmPassword', placeholder: 'повтори пароль' },
    ],
    validate: (vals: Record<string, string>) => {
      const a = vals['password'] ?? '';
      const b = vals['confirmPassword'] ?? '';
      return a === b ? null : 'Значение должно совпадать с полем "password"';
    },
  },
] as const;

type ExampleId = typeof EXAMPLES[number]['id'];

// ── Компонент ─────────────────────────────────────────────────────────────────

export function CustomValidatorDemo() {
  const [activeId, setActiveId] = useState<ExampleId>('startsWith');
  const [vals, setVals]         = useState<Record<string, string>>({});
  const [result, setResult]     = useState<{ ok: boolean; msg: string } | null>(null);

  const ex = EXAMPLES.find(e => e.id === activeId)!;

  function switchTab(id: ExampleId) {
    setActiveId(id);
    setVals({});
    setResult(null);
  }

  function setVal(key: string, value: string) {
    const next = { ...vals, [key]: value };
    setVals(next);
    setResult(null);
  }

  function run() {
    const err = ex.validate(vals);
    setResult(err ? { ok: false, msg: err } : { ok: true, msg: 'Валидация пройдена' });
  }

  return (
    <div className={s.root}>
      <div className={s.topBar}>
        <span className={s.label}>// custom validator demo</span>
      </div>

      {/* Tabs */}
      <div className={s.tabs}>
        {EXAMPLES.map(e => (
          <button
            key={e.id}
            className={[s.tab, activeId === e.id ? s.tabActive : ''].join(' ')}
            onClick={() => switchTab(e.id as ExampleId)}
          >
            {e.title}
          </button>
        ))}
      </div>

      <div className={s.body}>
        {/* Code */}
        <div className={s.codePane}>
          <CodeHighlight lang="ts" code={ex.code} />
        </div>

        {/* Try it */}
        <div className={s.tryPane}>
          <div className={s.tryLabel}>// try it</div>
          <p className={s.tryDesc}>{ex.desc}</p>

          <div className={s.fields}>
            {ex.inputs.map(inp => (
              <label key={inp.key} className={s.field}>
                <span className={s.fieldLabel}>
                  {inp.label}
                  {'isParam' in inp && inp.isParam && (
                    <span className={s.paramBadge}>параметр</span>
                  )}
                </span>
                <input
                  className={s.input}
                  value={vals[inp.key] ?? ''}
                  placeholder={inp.placeholder}
                  onChange={e => setVal(inp.key, e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && run()}
                />
              </label>
            ))}
          </div>

          <button className={s.runBtn} onClick={run}>Проверить</button>

          {result && (
            <div className={[s.result, result.ok ? s.ok : s.err].join(' ')}>
              <span className={s.icon}>{result.ok ? '✓' : '✗'}</span>
              {result.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
