'use client';

import { useState } from 'react';
import s from './URLAnatomyDemo.module.scss';

interface SegmentData {
  id: string;
  text: string;
  label: string;
  color: string;
  title: string;
  desc: string;
  examples: Array<{ code: string; note: string }>;
  optNote?: string;
}

const SEGMENTS: SegmentData[] = [
  {
    id: 'protocol',
    text: 'https://',
    label: 'протокол',
    color: '#00e5a0',
    title: 'Протокол',
    desc: 'Язык, на котором браузер и сервер общаются. https — зашифрованный: всё что ты вводишь на сайте (пароли, данные карты) нельзя перехватить. http — открытый текст, устарел. Замочек 🔒 в адресной строке — это и есть https.',
    examples: [
      { code: 'https://', note: 'зашифрованный — перехватить данные нельзя' },
      { code: 'http://', note: 'открытый текст — небезопасен' },
    ],
  },
  {
    id: 'domain',
    text: 'youtube.com',
    label: 'домен',
    color: '#4db8ff',
    title: 'Домен',
    desc: 'Адрес сервера в понятном для людей виде. Перед отправкой запроса DNS-сервер переведёт его в числовой адрес — IP. Без DNS каждый адрес нужно было бы знать в виде цифр: 142.250.185.78.',
    examples: [
      { code: 'youtube.com', note: 'человекочитаемый адрес' },
      { code: '142.250.185.78', note: 'то же самое — числовой IP' },
      { code: 'api.github.com', note: 'поддомен api. относится к github.com' },
    ],
  },
  {
    id: 'port',
    text: ':443',
    label: 'порт',
    color: '#f0c040',
    title: 'Порт',
    desc: 'Конкретная «дверь» на сервере из тысяч возможных. Для https стандартный — 443, для http — 80. Браузер добавляет стандартный порт сам и скрывает его — поэтому в обычных адресах ты его не видишь.',
    examples: [
      { code: ':443', note: 'https — браузер добавляет и скрывает автоматически' },
      { code: ':80', note: 'http — тоже скрыт' },
      { code: ':3000', note: 'локальный сервер разработчика — виден' },
      { code: ':8080', note: 'альтернативный порт' },
    ],
    optNote: 'Обычно скрыт браузером — 443 для https добавляется автоматически',
  },
  {
    id: 'path',
    text: '/watch',
    label: 'путь',
    color: '#b48eff',
    title: 'Путь',
    desc: 'Адрес конкретной страницы или файла на сервере. Работает как путь к файлу в папках — слэши разделяют уровни вложенности. Если путь не указан, сервер отдаёт главную страницу.',
    examples: [
      { code: '/', note: 'главная страница' },
      { code: '/watch', note: 'страница просмотра видео на YouTube' },
      { code: '/courses/html', note: 'раздел courses, страница html' },
      { code: '/images/logo.png', note: 'файл картинки на сервере' },
    ],
  },
  {
    id: 'params',
    text: '?v=dQw4w9WgXcQ',
    label: 'параметры',
    color: '#ff9070',
    title: 'Параметры',
    desc: 'Дополнительная информация для сервера. Начинаются после ?, разделяются &, каждый в формате ключ=значение. Сервер читает их и решает что показать — нужное видео, результаты поиска, страницу с фильтром.',
    examples: [
      { code: '?v=dQw4w9WgXcQ', note: 'ID видео — сервер найдёт именно его' },
      { code: '?q=котики&safe=on', note: 'поиск с безопасным фильтром' },
      { code: '?page=2&sort=price', note: 'вторая страница, сортировка по цене' },
    ],
    optNote: 'Необязательный — без него сервер отдаёт страницу по умолчанию',
  },
  {
    id: 'anchor',
    text: '#comments',
    label: 'якорь',
    color: '#ff5f6a',
    title: 'Якорь',
    desc: 'Указывает на элемент на странице — браузер прокрутит к нему. Например, #comments прокрутит к блоку с id="comments". Серверу якорь не отправляется вообще — это команда только для браузера.',
    examples: [
      { code: '#comments', note: 'прокрутить к комментариям' },
      { code: '#section-3', note: 'к третьей секции статьи' },
      { code: '#top', note: 'вернуться в начало страницы' },
    ],
    optNote: 'Серверу не отправляется — работает только в браузере',
  },
];

export function URLAnatomyDemo() {
  const [selected, setSelected] = useState(-1);

  function toggle(i: number) {
    setSelected(prev => (prev === i ? -1 : i));
  }

  const active = selected >= 0 ? SEGMENTS[selected] : null;

  return (
    <div className={s.demo}>
      <div className={s.demoHeader}>
        <span className={s.demoTitle}>// анатомия-url</span>
      </div>

      {/* Fake browser address bar */}
      <div className={s.urlSection}>
        <div className={s.urlBar}>
          <span className={s.urlLock}>🔒</span>
          <div className={s.urlTokens}>
            {SEGMENTS.map((seg, i) => (
              <button
                key={seg.id}
                className={`${s.token} ${selected === i ? s.tokenActive : ''}`}
                style={{ '--tc': seg.color } as React.CSSProperties}
                onClick={() => toggle(i)}
                title={seg.label}
              >
                {seg.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={s.legend}>
        {SEGMENTS.map((seg, i) => (
          <button
            key={seg.id}
            className={`${s.legendItem} ${selected === i ? s.legendActive : ''}`}
            style={{ '--tc': seg.color } as React.CSSProperties}
            onClick={() => toggle(i)}
          >
            <span className={s.legendDot} />
            <span className={s.legendLabel}>{seg.label}</span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {active ? (
        <div className={s.detail} style={{ '--tc': active.color } as React.CSSProperties}>
          <div className={s.detailTop}>
            <code className={s.detailCode}>{active.text}</code>
            <span className={s.detailTitle}>{active.title}</span>
          </div>
          <p className={s.detailDesc}>{active.desc}</p>
          <div className={s.exList}>
            {active.examples.map(ex => (
              <div key={ex.code} className={s.exRow}>
                <code className={s.exCode}>{ex.code}</code>
                <span className={s.exNote}>{ex.note}</span>
              </div>
            ))}
          </div>
          {active.optNote && (
            <div className={s.optNote}>// {active.optNote}</div>
          )}
        </div>
      ) : (
        <div className={s.hint}>кликни на любую часть URL — узнаешь что она означает</div>
      )}
    </div>
  );
}
