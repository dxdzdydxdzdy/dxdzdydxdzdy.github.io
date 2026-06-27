'use client';

import { useState } from 'react';
import s from './RepoMethodsDemo.module.scss';

type Tab = {
  label: string;
  code: React.ReactNode;
  sql: React.ReactNode;
  returns: string;
  note: React.ReactNode;
};

const TABS: Tab[] = [
  {
    label: 'find()',
    code: (
      <>
        <span className={s.kw}>async</span>{' '}
        <span className={s.fn}>findAll</span>
        {'(): Promise<MovieEntity[]> {\n'}
        {'  return '}<span className={s.kw}>await</span>
        {' this.movieRepository\n'}
        {'    .'}<span className={s.fn}>find</span>{'({\n'}
        {'      '}<span className={s.hl}>order</span>
        {': { createdAt: '}
        <span className={s.str}>'desc'</span>
        {' },\n'}
        {'      '}<span className={s.hl}>where</span>
        {': { isAvailable: '}
        <span className={s.kw}>true</span>
        {' },\n'}
        {'      '}<span className={s.hl}>take</span>
        {':  '}
        <span className={s.str}>10</span>
        {',  '}
        <span className={s.dim}>// LIMIT</span>
        {'\n'}
        {'      '}<span className={s.hl}>skip</span>
        {':  '}
        <span className={s.str}>0</span>
        {',   '}
        <span className={s.dim}>// OFFSET</span>
        {'\n'}
        {'    })\n}'}
      </>
    ),
    sql: (
      <>
        <span className={s.kw}>SELECT</span>
        {' * '}
        <span className={s.kw}>FROM</span>
        {' movies\n'}
        <span className={s.kw}>WHERE</span>
        {' is_available = '}
        <span className={s.val}>true</span>
        {'\n'}
        <span className={s.kw}>ORDER BY</span>
        {' created_at '}
        <span className={s.kw}>DESC</span>
        {'\n'}
        <span className={s.kw}>LIMIT</span>
        {' '}
        <span className={s.val}>10</span>
        {' '}
        <span className={s.kw}>OFFSET</span>
        {' '}
        <span className={s.val}>0</span>
      </>
    ),
    returns: 'MovieEntity[]',
    note: (
      <>
        <code>find()</code> без аргументов вернёт все строки таблицы без фильтрации.
        Опции <code>take</code> и <code>skip</code> — основа пагинации.
      </>
    ),
  },
  {
    label: 'findOne()',
    code: (
      <>
        <span className={s.kw}>async</span>{' '}
        <span className={s.fn}>findById</span>
        {'(id: string): Promise<MovieEntity> {\n'}
        {'  const movie = '}<span className={s.kw}>await</span>
        {'\n    this.movieRepository\n'}
        {'      .'}<span className={s.fn}>findOne</span>
        {'({ where: { id } })\n\n'}
        {'  '}<span className={s.kw}>if</span>
        {' (!movie)\n    throw new '}
        <span className={s.fn}>NotFoundException</span>
        {'('}
        <span className={s.str}>'Не найден'</span>
        {')\n\n'}
        {'  return movie\n}'}
      </>
    ),
    sql: (
      <>
        <span className={s.kw}>SELECT</span>
        {' * '}
        <span className={s.kw}>FROM</span>
        {' movies\n'}
        <span className={s.kw}>WHERE</span>
        {' id = '}
        <span className={s.val}>'a3f9b2...'</span>
        {'\n'}
        <span className={s.kw}>LIMIT</span>
        {' '}
        <span className={s.val}>1</span>
      </>
    ),
    returns: 'MovieEntity | null',
    note: (
      <>
        <code>findOne()</code> возвращает <code>null</code> если запись не найдена — не ошибку.
        Проверяем вручную и бросаем <code>NotFoundException</code> с кодом 404.
      </>
    ),
  },
  {
    label: 'create() + save()',
    code: (
      <>
        <span className={s.kw}>async</span>{' '}
        <span className={s.fn}>create</span>
        {'(dto: MovieDto) {\n'}
        {'  '}<span className={s.dim}>// объект в памяти — SQL нет</span>
        {'\n'}
        {'  const movie = this.movieRepository\n'}
        {'    .'}<span className={s.fn}>create</span>
        {'(dto)\n\n'}
        {'  '}<span className={s.dim}>// INSERT в базу</span>
        {'\n'}
        {'  return '}<span className={s.kw}>await</span>
        {'\n    this.movieRepository\n'}
        {'      .'}<span className={s.fn}>save</span>
        {'(movie)\n}'}
      </>
    ),
    sql: (
      <>
        <span className={s.dim}>{'// .create(dto) — только JS-объект:\n// new MovieEntity() + dto\n\n'}</span>
        <span className={s.kw}>INSERT INTO</span>
        {' movies\n  (title, release_year, ...)\n'}
        <span className={s.kw}>VALUES</span>
        {'\n  ('}
        <span className={s.val}>'Fight Club'</span>
        {', '}
        <span className={s.val}>1999</span>
        {', ...)\n'}
        <span className={s.kw}>RETURNING</span>
        {' *'}
      </>
    ),
    returns: 'MovieEntity (с id, createdAt...)',
    note: (
      <>
        <code>create()</code> — только формирует объект, в базу не пишет.
        <code>save()</code> — смотрит: есть id? Делает UPDATE. Нет id? Делает INSERT.
        Для новой записи id ещё нет — выполняется INSERT.
      </>
    ),
  },
  {
    label: 'save() update',
    code: (
      <>
        <span className={s.kw}>async</span>{' '}
        <span className={s.fn}>update</span>
        {'(id: string, dto: MovieDto) {\n'}
        {'  const movie = '}<span className={s.kw}>await</span>
        {'\n    this.'}<span className={s.fn}>findById</span>
        {'(id)\n\n'}
        {'  '}<span className={s.fn}>Object.assign</span>
        {'(movie, dto)\n\n'}
        {'  '}<span className={s.kw}>await</span>
        {' this.movieRepository\n'}
        {'    .'}<span className={s.fn}>save</span>
        {'(movie)\n\n'}
        {'  return '}
        <span className={s.kw}>true</span>
        {'\n}'}
      </>
    ),
    sql: (
      <>
        <span className={s.dim}>{'// сначала — поиск записи:\n'}</span>
        <span className={s.kw}>SELECT</span>
        {' * '}
        <span className={s.kw}>FROM</span>
        {' movies '}
        <span className={s.kw}>WHERE</span>
        {' id = '}
        <span className={s.val}>'...'</span>
        {'\n\n'}
        <span className={s.dim}>{'// потом — обновление:\n'}</span>
        <span className={s.kw}>UPDATE</span>
        {' movies\n'}
        <span className={s.kw}>SET</span>
        {' title = '}
        <span className={s.val}>'Seven'</span>
        {', ...\n'}
        <span className={s.kw}>WHERE</span>
        {' id = '}
        <span className={s.val}>'a3f9b2...'</span>
      </>
    ),
    returns: 'MovieEntity (обновлённый)',
    note: (
      <>
        <code>Object.assign(movie, dto)</code> копирует все поля из dto в уже найденный объект.
        TypeORM видит что у объекта есть <code>id</code> — значит запись уже существует — делает UPDATE.
      </>
    ),
  },
  {
    label: 'remove()',
    code: (
      <>
        <span className={s.kw}>async</span>{' '}
        <span className={s.fn}>delete</span>
        {'(id: string): Promise<string> {\n'}
        {'  const movie = '}<span className={s.kw}>await</span>
        {'\n    this.'}<span className={s.fn}>findById</span>
        {'(id)\n\n'}
        {'  '}<span className={s.kw}>await</span>
        {' this.movieRepository\n'}
        {'    .'}<span className={s.fn}>remove</span>
        {'(movie)\n\n'}
        {'  return movie.id\n}'}
      </>
    ),
    sql: (
      <>
        <span className={s.kw}>DELETE FROM</span>
        {' movies\n'}
        <span className={s.kw}>WHERE</span>
        {' id = '}
        <span className={s.val}>'a3f9b2...'</span>
      </>
    ),
    returns: 'string (id удалённой записи)',
    note: (
      <>
        <code>remove()</code> принимает сущность, не id. Поэтому сначала находим запись через{' '}
        <code>findById()</code> — заодно обрабатываем 404 если не существует.
        После <code>remove()</code> поле <code>id</code> в объекте обнуляется.
      </>
    ),
  },
];

export function RepoMethodsDemo() {
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
          <span className={s.panelLabel}>сервис</span>
          <div className={s.codeBlock}>{tab.code}</div>
        </div>

        <div className={s.infoPanel}>
          <span className={s.panelLabel}>SQL под капотом</span>
          <div className={s.sqlBlock}>{tab.sql}</div>
          <div className={s.returnRow}>
            <span className={s.returnLabel}>возвращает</span>
            <span className={s.returnType}>{tab.returns}</span>
          </div>
          <p className={s.note}>{tab.note}</p>
        </div>
      </div>
    </div>
  );
}
