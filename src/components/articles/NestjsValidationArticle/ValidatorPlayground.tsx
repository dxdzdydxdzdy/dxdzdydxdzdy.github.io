'use client';

import { useState } from 'react';
import s from './ValidatorPlayground.module.scss';

interface ValidatorDef {
  id: string;
  category: string;
  decorator: string;
  description: string;
  note?: string;
  placeholder: string;
  examples: { label: string; value: string }[];
  validate: (raw: string) => string | null; // null = valid, string = error
}

const UUID4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const URL_RE   = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;

const VALIDATORS: ValidatorDef[] = [
  // ── Строки ─────────────────────────────────────────────────────────────────
  {
    id: 'IsString',
    category: 'Строки',
    decorator: '@IsString()',
    description: 'Значение должно быть строкой.',
    note: 'В JSON число 123 или true — не строка. Если клиент передаёт число там где ожидается строка — @IsString поймает это.',
    placeholder: 'any text или 123 или true',
    examples: [
      { label: '✓', value: 'Learn NestJS' },
      { label: '✗ число', value: '123' },
      { label: '✗ bool', value: 'true' },
    ],
    validate: (raw) => {
      const n = Number(raw);
      if (!isNaN(n) && raw.trim() !== '') return 'title must be a string';
      if (raw === 'true' || raw === 'false') return 'title must be a string';
      if (raw.startsWith('[') || raw.startsWith('{')) return 'title must be a string';
      return null;
    },
  },
  {
    id: 'IsNotEmpty',
    category: 'Строки',
    decorator: '@IsNotEmpty()',
    description: 'Строка не должна быть пустой или состоять только из пробелов.',
    placeholder: 'пустая строка или текст',
    examples: [
      { label: '✓', value: 'Hello' },
      { label: '✗ пусто', value: '' },
      { label: '✗ пробелы', value: '   ' },
    ],
    validate: (raw) => raw.trim() === '' ? 'title should not be empty' : null,
  },
  {
    id: 'Length',
    category: 'Строки',
    decorator: '@Length(2, 40)',
    description: 'Длина строки должна быть от 2 до 40 символов.',
    placeholder: 'введи строку',
    examples: [
      { label: '✓', value: 'Learn NestJS' },
      { label: '✗ короткая', value: 'x' },
      { label: '✗ длинная', value: 'a'.repeat(41) },
    ],
    validate: (raw) => {
      if (raw.length < 2) return `title must be longer than or equal to 2 characters`;
      if (raw.length > 40) return `title must be shorter than or equal to 40 characters`;
      return null;
    },
  },
  {
    id: 'MinLength',
    category: 'Строки',
    decorator: '@MinLength(6)',
    description: 'Минимальная длина строки — 6 символов.',
    placeholder: 'password',
    examples: [
      { label: '✓', value: 'Secret1' },
      { label: '✗ мало', value: '12345' },
    ],
    validate: (raw) => raw.length < 6 ? 'title must be longer than or equal to 6 characters' : null,
  },
  {
    id: 'Matches',
    category: 'Строки',
    decorator: '@Matches(/^(?=.*[A-Z])(?=.*[0-9]).+$/)',
    description: 'Строка должна соответствовать регулярному выражению. В примере — хотя бы одна заглавная буква и цифра.',
    placeholder: 'пароль, напр. Secret1',
    examples: [
      { label: '✓', value: 'Secret1' },
      { label: '✗ нет заглавной', value: 'secret123' },
      { label: '✗ нет цифры', value: 'SecretPass' },
    ],
    validate: (raw) =>
      /^(?=.*[A-Z])(?=.*[0-9]).+$/.test(raw) ? null : 'Пароль должен содержать хотя бы одну заглавную букву и цифру',
  },

  // ── Числа ──────────────────────────────────────────────────────────────────
  {
    id: 'IsNumber',
    category: 'Числа',
    decorator: '@IsNumber()',
    description: 'Значение должно быть числом (включая дробные).',
    placeholder: '42 или 3.14 или "hello"',
    examples: [
      { label: '✓ целое', value: '42' },
      { label: '✓ дробное', value: '3.14' },
      { label: '✗ строка', value: 'hello' },
    ],
    validate: (raw) => {
      const n = Number(raw);
      return isNaN(n) || raw.trim() === '' ? 'priority must be a number conforming to the specified constraints' : null;
    },
  },
  {
    id: 'IsInt',
    category: 'Числа',
    decorator: '@IsInt()',
    description: 'Значение должно быть целым числом (без дробной части).',
    placeholder: '5 или 3.14',
    examples: [
      { label: '✓', value: '5' },
      { label: '✗ дробное', value: '3.14' },
      { label: '✗ строка', value: 'five' },
    ],
    validate: (raw) => {
      const n = Number(raw);
      return isNaN(n) || !Number.isInteger(n) ? 'priority must be an integer number' : null;
    },
  },
  {
    id: 'IsPositive',
    category: 'Числа',
    decorator: '@IsPositive()',
    description: 'Число должно быть строго положительным (> 0).',
    placeholder: '3 или -2 или 0',
    examples: [
      { label: '✓', value: '3' },
      { label: '✗ ноль', value: '0' },
      { label: '✗ отрицательное', value: '-2' },
    ],
    validate: (raw) => {
      const n = Number(raw);
      return isNaN(n) || n <= 0 ? 'priority must be a positive number' : null;
    },
  },

  // ── Специальные ────────────────────────────────────────────────────────────
  {
    id: 'IsBoolean',
    category: 'Специальные',
    decorator: '@IsBoolean()',
    description: 'Значение должно быть булевым (true или false).',
    placeholder: 'true или false или "yes"',
    examples: [
      { label: '✓ true', value: 'true' },
      { label: '✓ false', value: 'false' },
      { label: '✗ строка', value: 'yes' },
    ],
    validate: (raw) =>
      raw === 'true' || raw === 'false' ? null : 'isCompleted must be a boolean value',
  },
  {
    id: 'IsOptional',
    category: 'Специальные',
    decorator: '@IsOptional()',
    description: 'Поле необязательное. Если не передано — остальные декораторы пропускаются. Если передано — работают все остальные правила.',
    note: 'Важно: @IsOptional не отменяет другие декораторы — он лишь разрешает отсутствие поля.',
    placeholder: '(пусто — пропустит валидацию)',
    examples: [
      { label: '✓ не передано', value: '' },
      { label: '✓ передано', value: 'any value' },
    ],
    validate: () => null,
  },
  {
    id: 'IsArray',
    category: 'Специальные',
    decorator: '@IsArray()',
    description: 'Значение должно быть массивом.',
    placeholder: '["work","study"] или "hello"',
    examples: [
      { label: '✓', value: '["work","study"]' },
      { label: '✗ строка', value: 'work' },
      { label: '✗ объект', value: '{"a":1}' },
    ],
    validate: (raw) => {
      try {
        const v = JSON.parse(raw);
        return Array.isArray(v) ? null : 'tags must be an array';
      } catch {
        return 'tags must be an array';
      }
    },
  },
  {
    id: 'IsEnum',
    category: 'Специальные',
    decorator: '@IsEnum(TaskTag)',
    description: 'Значение должно быть одним из значений enum: "work", "study", "home".',
    placeholder: 'work / study / home / other',
    examples: [
      { label: '✓', value: 'work' },
      { label: '✓', value: 'study' },
      { label: '✗', value: 'coding' },
    ],
    validate: (raw) =>
      ['work', 'study', 'home'].includes(raw) ? null : 'Недопустимое значение тега',
  },
  {
    id: 'IsUrl',
    category: 'Специальные',
    decorator: '@IsUrl({ protocols: ["https"] })',
    description: 'Значение должно быть корректным URL с указанным протоколом.',
    placeholder: 'https://google.com или просто google',
    examples: [
      { label: '✓', value: 'https://google.com' },
      { label: '✗ без протокола', value: 'google.com' },
      { label: '✗ http', value: 'http://google.com' },
    ],
    validate: (raw) => {
      if (!raw.startsWith('https://')) return 'Некорректный формат URL';
      return URL_RE.test(raw) ? null : 'Некорректный формат URL';
    },
  },
  {
    id: 'IsUUID',
    category: 'Специальные',
    decorator: '@IsUUID("4")',
    description: 'Значение должно быть UUID версии 4 (формат xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx).',
    placeholder: 'UUID v4 или произвольная строка',
    examples: [
      { label: '✓', value: 'a3bb189e-8bf9-4f7d-8d9e-2b0c1a2b3c4d' },
      { label: '✗', value: '1234' },
    ],
    validate: (raw) => UUID4_RE.test(raw) ? null : 'некорректный формат id',
  },
];

const CATEGORIES = [...new Set(VALIDATORS.map(v => v.category))];

export function ValidatorPlayground() {
  const [activeId, setActiveId] = useState(VALIDATORS[0].id);
  const [input, setInput]       = useState('');
  const [result, setResult]     = useState<{ ok: boolean; msg: string } | null>(null);

  const active = VALIDATORS.find(v => v.id === activeId)!;

  function run(value = input) {
    const err = active.validate(value);
    setResult(err ? { ok: false, msg: err } : { ok: true, msg: 'Валидация пройдена' });
  }

  function pick(id: string) {
    setActiveId(id);
    setInput('');
    setResult(null);
  }

  function useExample(value: string) {
    setInput(value);
    const err = active.validate(value);
    setResult(err ? { ok: false, msg: err } : { ok: true, msg: 'Валидация пройдена' });
  }

  return (
    <div className={s.root}>
      <div className={s.topBar}>
        <span className={s.label}>// decorator tester</span>
        <span className={s.hint}>выбери декоратор → введи значение → проверь</span>
      </div>

      <div className={s.body}>
        {/* Sidebar */}
        <nav className={s.sidebar}>
          {CATEGORIES.map(cat => (
            <div key={cat} className={s.catGroup}>
              <div className={s.catLabel}>{cat}</div>
              {VALIDATORS.filter(v => v.category === cat).map(v => (
                <button
                  key={v.id}
                  className={[s.item, activeId === v.id ? s.itemActive : ''].join(' ')}
                  onClick={() => pick(v.id)}
                >
                  {v.decorator}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Main panel */}
        <div className={s.panel}>
          <div className={s.decoratorName}>{active.decorator}</div>
          <p className={s.desc}>{active.description}</p>
          {active.note && <div className={s.note}>{active.note}</div>}

          {/* Examples */}
          <div className={s.examplesRow}>
            {active.examples.map((ex, i) => (
              <button key={i} className={s.exBtn} onClick={() => useExample(ex.value)}>
                <span className={s.exLabel}>{ex.label}</span>
                <code className={s.exVal}>{ex.value === '' ? '(пусто)' : ex.value.length > 24 ? ex.value.slice(0, 24) + '…' : ex.value}</code>
              </button>
            ))}
          </div>

          {/* Input */}
          <div className={s.inputRow}>
            <input
              className={s.input}
              value={input}
              placeholder={active.placeholder}
              onChange={e => { setInput(e.target.value); setResult(null); }}
              onKeyDown={e => e.key === 'Enter' && run()}
            />
            <button className={s.checkBtn} onClick={() => run()}>Проверить</button>
          </div>

          {/* Result */}
          {result && (
            <div className={[s.result, result.ok ? s.ok : s.err].join(' ')}>
              <span className={s.resultIcon}>{result.ok ? '✓' : '✗'}</span>
              <span className={s.resultMsg}>{result.msg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
