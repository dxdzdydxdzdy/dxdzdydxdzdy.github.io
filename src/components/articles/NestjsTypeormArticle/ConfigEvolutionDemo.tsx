'use client';

import { useState } from 'react';
import s from './ConfigEvolutionDemo.module.scss';

interface Tab {
  id: string;
  label: string;
  variant: 'bad' | 'ok' | 'good';
  code: React.ReactNode;
  points: { icon: 'ok' | 'bad' | 'warn'; text: string }[];
}

const TABS: Tab[] = [
  {
    id: 'sync',
    label: 'forRoot — простой',
    variant: 'bad',
    code: (
      <>
        <span className={s.com}>{'// app.module.ts\n'}</span>
        <span className={s.fn}>{'TypeOrmModule'}</span>
        {'.'}
        <span className={s.fn}>{'forRoot'}</span>
        {'({\n'}
        {'  '}
        <span className={s.kw}>type</span>
        {": "}
        <span className={s.str}>{'\'postgres\''}</span>
        {',\n'}
        {'  '}
        <span className={s.kw}>host</span>
        {': '}
        <span className={s.hl}>{'\'localhost\''}</span>
        {'     '}
        <span className={s.com}>{'// 🔴 захардкожено'}</span>
        {'\n  '}
        <span className={s.kw}>port</span>
        {': '}
        <span className={s.hl}>{'5433'}</span>
        {'           '}
        <span className={s.com}>{'// 🔴 захардкожено'}</span>
        {'\n  '}
        <span className={s.kw}>username</span>
        {': '}
        <span className={s.hl}>{'\'root\''}</span>
        {'       '}
        <span className={s.com}>{'// 🔴 захардкожено'}</span>
        {'\n  '}
        <span className={s.kw}>password</span>
        {': '}
        <span className={s.hl}>{'\'123456\''}</span>
        {'     '}
        <span className={s.com}>{'// 🔴 секрет в коде!'}</span>
        {'\n  '}
        <span className={s.kw}>database</span>
        {': '}
        <span className={s.hl}>{'\'nestjs-course\''}</span>
        {',\n  '}
        <span className={s.kw}>autoLoadEntities</span>
        {': '}
        <span className={s.kw}>true</span>
        {',\n  '}
        <span className={s.kw}>synchronize</span>
        {': '}
        <span className={s.kw}>true</span>
        {',\n});'}
      </>
    ),
    points: [
      { icon: 'ok',   text: 'Просто — хорошо для первого знакомства' },
      { icon: 'bad',  text: 'Секреты попадают в git' },
      { icon: 'bad',  text: 'Конфиг нельзя менять без правки кода' },
    ],
  },
  {
    id: 'async',
    label: 'forRootAsync — правильно',
    variant: 'ok',
    code: (
      <>
        <span className={s.fn}>{'TypeOrmModule'}</span>
        {'.'}
        <span className={s.fn}>{'forRootAsync'}</span>
        {'({\n'}
        {'  '}
        <span className={s.hl}>{'imports'}</span>
        {': ['}
        <span className={s.fn}>{'ConfigModule'}</span>
        {'],\n  '}
        <span className={s.hl}>{'inject'}</span>
        {': ['}
        <span className={s.fn}>{'ConfigService'}</span>
        {'],\n  '}
        <span className={s.kw}>{'useFactory'}</span>
        {': ('}
        <span className={s.kw}>config</span>
        {': '}
        <span className={s.fn}>{'ConfigService'}</span>
        {') => ({\n'}
        {'    '}
        <span className={s.kw}>type</span>
        {': '}
        <span className={s.str}>{'\'postgres\''}</span>
        {',\n    '}
        <span className={s.kw}>host</span>
        {':     config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'('}
        <span className={s.str}>{'\'POSTGRES_HOST\''}</span>
        {'),\n    '}
        <span className={s.kw}>port</span>
        {':     config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'<'}
        <span className={s.kw}>number</span>
        {'>('}
        <span className={s.str}>{'\'POSTGRES_PORT\''}</span>
        {'),\n    '}
        <span className={s.kw}>username</span>
        {': config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'('}
        <span className={s.str}>{'\'POSTGRES_USER\''}</span>
        {'),\n    '}
        <span className={s.kw}>password</span>
        {': config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'('}
        <span className={s.str}>{'\'POSTGRES_PASSWORD\''}</span>
        {'),\n    '}
        <span className={s.kw}>database</span>
        {': config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'('}
        <span className={s.str}>{'\'POSTGRES_DB\''}</span>
        {'),\n    '}
        <span className={s.kw}>autoLoadEntities</span>
        {': '}
        <span className={s.kw}>true</span>
        {',\n    '}
        <span className={s.kw}>synchronize</span>
        {': '}
        <span className={s.kw}>true</span>
        {',\n  }),\n});'}
      </>
    ),
    points: [
      { icon: 'ok',   text: 'Секреты в .env, не в коде' },
      { icon: 'ok',   text: 'getOrThrow падает при старте если переменная не задана' },
      { icon: 'warn', text: 'Логика конфига смешана с AppModule' },
    ],
  },
  {
    id: 'file',
    label: 'Отдельный файл — лучший вариант',
    variant: 'good',
    code: (
      <>
        <span className={s.com}>{'// src/config/typeorm.config.ts\n'}</span>
        <span className={s.kw}>{'export function '}</span>
        <span className={s.fn}>{'getTypeOrmConfig'}</span>
        {'(\n  '}
        <span className={s.kw}>config</span>
        {': '}
        <span className={s.fn}>{'ConfigService'}</span>
        {',\n): '}
        <span className={s.fn}>{'TypeOrmModuleOptions'}</span>
        {' {\n  '}
        <span className={s.kw}>return</span>
        {' {\n    '}
        <span className={s.kw}>type</span>
        {': '}
        <span className={s.str}>{'\'postgres\''}</span>
        {',\n    '}
        <span className={s.kw}>host</span>
        {':     config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'('}
        <span className={s.str}>{'\'POSTGRES_HOST\''}</span>
        {'),\n    '}
        <span className={s.kw}>port</span>
        {':     config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'<'}
        <span className={s.kw}>number</span>
        {'>('}
        <span className={s.str}>{'\'POSTGRES_PORT\''}</span>
        {'),\n    '}
        <span className={s.kw}>username</span>
        {': config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'('}
        <span className={s.str}>{'\'POSTGRES_USER\''}</span>
        {'),\n    '}
        <span className={s.kw}>password</span>
        {': config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'('}
        <span className={s.str}>{'\'POSTGRES_PASSWORD\''}</span>
        {'),\n    '}
        <span className={s.kw}>database</span>
        {': config.'}
        <span className={s.fn}>{'getOrThrow'}</span>
        {'('}
        <span className={s.str}>{'\'POSTGRES_DB\''}</span>
        {'),\n    '}
        <span className={s.kw}>autoLoadEntities</span>
        {': '}
        <span className={s.kw}>true</span>
        {', '}
        <span className={s.kw}>synchronize</span>
        {': '}
        <span className={s.kw}>true</span>
        {',\n  };\n}\n\n'}
        <span className={s.com}>{'// app.module.ts — теперь чисто\n'}</span>
        <span className={s.fn}>{'TypeOrmModule'}</span>
        {'.'}
        <span className={s.fn}>{'forRootAsync'}</span>
        {'({\n  imports: ['}
        <span className={s.fn}>{'ConfigModule'}</span>
        {'],\n  inject:  ['}
        <span className={s.fn}>{'ConfigService'}</span>
        {'],\n  useFactory: '}
        <span className={s.hl}>{'getTypeOrmConfig'}</span>
        {',\n});'}
      </>
    ),
    points: [
      { icon: 'ok',   text: 'AppModule остаётся чистым' },
      { icon: 'ok',   text: 'Конфиг переиспользуется для TypeORM CLI' },
      { icon: 'ok',   text: 'Легко тестировать и изменять' },
    ],
  },
];

export function ConfigEvolutionDemo() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find(t => t.id === active)!;

  return (
    <div className={s.root}>
      <div className={s.tabs}>
        {TABS.map((t, i) => (
          <button
            key={t.id}
            className={`${s.tab} ${s[t.variant]} ${active === t.id ? s.active : ''}`}
            onClick={() => setActive(t.id)}
          >
            <span className={s.tabNum}>{i + 1}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.panel}>
        <div className={s.codeWrap}>
          <pre className={s.code}>{tab.code}</pre>
        </div>
        <div className={s.side}>
          <span className={s.sideTitle}>Оценка</span>
          <div className={s.points}>
            {tab.points.map((p, i) => (
              <div key={i} className={s.point}>
                <span className={`${s.icon} ${s[`icon${p.icon.charAt(0).toUpperCase() + p.icon.slice(1)}`]}`}>
                  {p.icon === 'ok' ? '✓' : p.icon === 'bad' ? '✗' : '△'}
                </span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
