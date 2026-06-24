'use client';

import { useState } from 'react';
import s from './ParamDecoratorDemo.module.scss';

type Highlight = 'path' | 'query' | 'headers' | 'body';

interface Option {
  id: string;
  label: string;
  code: string;
  result: string;
  highlight: Highlight;
  explain: string;
}

const OPTIONS: Option[] = [
  {
    id: 'param',
    label: "@Param('id')",
    code: "@Get(':id')\nfindOne(@Param('id') id: string) {\n  return { id };\n}",
    result: '"42"',
    highlight: 'path',
    explain: 'Динамический сегмент :id из URL-пути.',
  },
  {
    id: 'query-one',
    label: "@Query('genre')",
    code: "@Get()\nfindAll(@Query('genre') genre: string) {\n  return { genre };\n}",
    result: '"action"',
    highlight: 'query',
    explain: 'Конкретный query-параметр по имени.',
  },
  {
    id: 'query-all',
    label: '@Query()',
    code: '@Get()\nfindAll(@Query() query: object) {\n  return query;\n}',
    result: '{ genre: "action", year: "2024" }',
    highlight: 'query',
    explain: 'Все query-параметры одним объектом.',
  },
  {
    id: 'body-one',
    label: "@Body('title')",
    code: "@Post()\ncreate(@Body('title') title: string) {\n  return { title };\n}",
    result: '"Fight Club"',
    highlight: 'body',
    explain: 'Одно конкретное поле из тела запроса.',
  },
  {
    id: 'body-all',
    label: '@Body()',
    code: '@Post()\ncreate(@Body() body: CreateMovieDto) {\n  return body;\n}',
    result: '{ title: "Fight Club", genre: "drama" }',
    highlight: 'body',
    explain: 'Всё тело запроса одним объектом.',
  },
  {
    id: 'headers-one',
    label: "@Headers('user-agent')",
    code: "@Get()\ngetUA(@Headers('user-agent') ua: string) {\n  return { ua };\n}",
    result: '"Mozilla/5.0 (Windows)"',
    highlight: 'headers',
    explain: 'Один заголовок по имени (строка).',
  },
  {
    id: 'headers-all',
    label: '@Headers()',
    code: '@Get()\ngetAll(@Headers() h: object) {\n  return h;\n}',
    result: '{ "content-type": "application/json",\n  "user-agent": "Mozilla/5.0 (Windows)",\n  "x-token": "abc123" }',
    highlight: 'headers',
    explain: 'Все заголовки одним объектом.',
  },
];

const HEADERS = [
  ['content-type', 'application/json'],
  ['user-agent',   'Mozilla/5.0 (Windows)'],
  ['x-token',      'abc123'],
];

const BODY_TEXT = '{\n  "title": "Fight Club",\n  "genre": "drama"\n}';

export function ParamDecoratorDemo() {
  const [selected, setSelected] = useState(OPTIONS[0].id);
  const cur = OPTIONS.find(o => o.id === selected)!;
  const hl = cur.highlight;

  return (
    <div className={s.root}>
      {/* Tabs */}
      <div className={s.tabs}>
        {OPTIONS.map(o => (
          <button
            key={o.id}
            className={`${s.tab} ${selected === o.id ? s.active : ''}`}
            onClick={() => setSelected(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className={s.body}>
        {/* Left: request */}
        <div className={s.reqPanel}>
          <span className={s.panelLabel}>POST /movies/:id?genre=action&year=2024</span>

          <div className={s.reqLine}>
            <span className={s.method}>POST</span>
            <span className={`${s.pathSeg} ${hl === 'path' ? s.lit : ''}`}>/movies/</span>
            <span className={`${s.pathSeg} ${hl === 'path' ? s.lit : ''}`}>42</span>
            <span className={`${s.queryStr} ${hl === 'query' ? s.lit : ''}`}>?genre=action&year=2024</span>
          </div>

          <div className={`${s.reqSection} ${hl === 'headers' ? s.lit : ''}`}>
            <div className={s.sectionLabel}>headers</div>
            {HEADERS.map(([k, v]) => (
              <div key={k} className={s.headerRow}>
                <span className={s.hKey}>{k}:</span>
                <span className={s.hVal}>{v}</span>
              </div>
            ))}
          </div>

          <div className={`${s.reqSection} ${hl === 'body' ? s.lit : ''}`}>
            <div className={s.sectionLabel}>body</div>
            <pre className={s.bodyPre}>{BODY_TEXT}</pre>
          </div>
        </div>

        {/* Right: result */}
        <div className={s.resultPanel}>
          <p className={s.explain}>{cur.explain}</p>
          <pre className={s.codeSnip}>{cur.code}</pre>
          <span className={s.arrow}>→ возвращает:</span>
          <span className={s.resultVal}>{cur.result}</span>
        </div>
      </div>
    </div>
  );
}
