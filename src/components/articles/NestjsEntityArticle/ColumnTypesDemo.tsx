'use client';

import { useState } from 'react';
import s from './ColumnTypesDemo.module.scss';

type Opt = { key: string; desc: string };
type Tab = { label: string; field: string; lines: React.ReactNode; opts: Opt[] };

const TABS: Tab[] = [
  {
    label: 'varchar',
    field: 'title',
    lines: (
      <>
        <span className={s.hl}>@Column</span>{'({\n'}
        {'  '}<span className={s.str}>'type'</span>{': '}
        <span className={s.str}>'varchar'</span>{',\n'}
        {'  '}<span className={s.str}>'length'</span>{': '}
        <span className={s.num}>128</span>{',\n'}
        {'  '}<span className={s.str}>'default'</span>{': '}
        <span className={s.str}>'Movie title'</span>{'\n'}
        {'}) '}<span className={s.kw}>title</span>{'!: string'}
      </>
    ),
    opts: [
      { key: "type: 'varchar'",       desc: 'Строка ограниченной длины. Стандартный тип для имён, заголовков, слагов.' },
      { key: 'length: 128',           desc: 'Максимальное число символов. Попытка сохранить больше — ошибка Postgres.' },
      { key: "default: 'Movie title'", desc: 'Значение при INSERT, если поле не передано. Применяется на уровне БД.' },
    ],
  },
  {
    label: 'text',
    field: 'description',
    lines: (
      <>
        <span className={s.hl}>@Column</span>{'({\n'}
        {'  '}<span className={s.str}>'type'</span>{': '}
        <span className={s.str}>'text'</span>{',\n'}
        {'  '}<span className={s.str}>'nullable'</span>{': '}
        <span className={s.kw}>true</span>{'\n'}
        {'}) '}<span className={s.kw}>description</span>{'!: string'}
      </>
    ),
    opts: [
      { key: "type: 'text'",   desc: 'Длинный текст без ограничения символов. Для описаний, статей, биографий.' },
      { key: 'nullable: true', desc: 'Колонка принимает NULL. По умолчанию false — поле обязательное. Необязательные поля ставим nullable: true.' },
    ],
  },
  {
    label: 'int',
    field: 'releaseYear',
    lines: (
      <>
        <span className={s.hl}>@Column</span>{'({\n'}
        {'  '}<span className={s.str}>'name'</span>{': '}
        <span className={s.str}>'release_year'</span>{',\n'}
        {'  '}<span className={s.str}>'type'</span>{': '}
        <span className={s.str}>'int'</span>{',\n'}
        {'  '}<span className={s.str}>'unsigned'</span>{': '}
        <span className={s.kw}>true</span>{'\n'}
        {'}) '}<span className={s.kw}>releaseYear</span>{'!: number'}
      </>
    ),
    opts: [
      { key: "type: 'int'",           desc: 'Целое число. Для годов, счётчиков, ID (когда не UUID).' },
      { key: 'unsigned: true',        desc: 'Только положительные числа. Год не может быть отрицательным — unsigned это явно закрепляет.' },
      { key: "name: 'release_year'",  desc: 'Имя колонки в Postgres. В TypeScript пишем camelCase, в БД храним snake_case.' },
    ],
  },
  {
    label: 'decimal',
    field: 'rating',
    lines: (
      <>
        <span className={s.hl}>@Column</span>{'({\n'}
        {'  '}<span className={s.str}>'type'</span>{': '}
        <span className={s.str}>'decimal'</span>{',\n'}
        {'  '}<span className={s.str}>'precision'</span>{': '}
        <span className={s.num}>3</span>{',\n'}
        {'  '}<span className={s.str}>'scale'</span>{': '}
        <span className={s.num}>1</span>{',\n'}
        {'  '}<span className={s.str}>'default'</span>{': '}
        <span className={s.num}>0.0</span>{'\n'}
        {'}) '}<span className={s.kw}>rating</span>{'!: number'}
      </>
    ),
    opts: [
      { key: "type: 'decimal'", desc: 'Число с фиксированной точностью. Для рейтингов, цен, любых дробных значений.' },
      { key: 'precision: 3',   desc: 'Всего цифр в числе включая дробную часть. precision: 3 → максимум 99.9.' },
      { key: 'scale: 1',       desc: 'Цифр после запятой. scale: 1 → одна десятичная: 8.5, 9.3, 10.0.' },
      { key: 'default: 0.0',   desc: 'Новый фильм получает рейтинг 0.0 — нет оценок, нет значения.' },
    ],
  },
  {
    label: 'boolean',
    field: 'isAvailable',
    lines: (
      <>
        <span className={s.hl}>@Column</span>{'({\n'}
        {'  '}<span className={s.str}>'name'</span>{': '}
        <span className={s.str}>'is_available'</span>{',\n'}
        {'  '}<span className={s.str}>'type'</span>{': '}
        <span className={s.str}>'boolean'</span>{',\n'}
        {'  '}<span className={s.str}>'default'</span>{': '}
        <span className={s.kw}>false</span>{'\n'}
        {'}) '}<span className={s.kw}>isAvailable</span>{'!: boolean'}
      </>
    ),
    opts: [
      { key: "type: 'boolean'",        desc: 'Флаг true/false. В Postgres хранится как тип bool.' },
      { key: 'default: false',         desc: 'Новый фильм недоступен по умолчанию — пока не опубликован вручную.' },
      { key: "name: 'is_available'",   desc: 'camelCase → snake_case в БД. Это соглашение, не требование TypeORM.' },
    ],
  },
  {
    label: 'enum',
    field: 'genre',
    lines: (
      <>
        <span className={s.hl}>@Column</span>{'({\n'}
        {'  '}<span className={s.str}>'type'</span>{': '}
        <span className={s.str}>'enum'</span>{',\n'}
        {'  '}<span className={s.str}>'enum'</span>{': '}
        <span className={s.kw}>Genre</span>{',\n'}
        {'  '}<span className={s.str}>'default'</span>{': '}
        <span className={s.kw}>Genre</span>{'.DRAMA\n'}
        {'}) '}<span className={s.kw}>genre</span>{'!: Genre'}
      </>
    ),
    opts: [
      { key: "type: 'enum'",      desc: 'Ограниченный список строк. Postgres создаёт отдельный тип-перечисление в схеме.' },
      { key: 'enum: Genre',       desc: 'TypeScript enum с допустимыми значениями. Попытка сохранить что-то другое — ошибка БД.' },
      { key: 'default: Genre.DRAMA', desc: 'Если жанр не передан при создании, подставляется drama.' },
    ],
  },
];

export function ColumnTypesDemo() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <div className={s.root}>
      <div className={s.tabs}>
        {TABS.map((t, i) => (
          <button
            key={t.label}
            className={`${s.tab}${i === active ? ` ${s.active}` : ''}`}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.body}>
        <div className={s.codePanel}>
          <span className={s.panelLabel}>декоратор</span>
          <div className={s.codeBlock}>{tab.lines}</div>
        </div>

        <div className={s.optPanel}>
          <span className={s.panelLabel}>параметры</span>
          <div className={s.optList}>
            {tab.opts.map(o => (
              <div key={o.key} className={s.optItem}>
                <div className={s.optKey}>{o.key}</div>
                <div className={s.optDesc}>{o.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
