'use client';

import { useState } from 'react';
import s from './ModuleFlowDemo.module.scss';

type Tab = 'broken' | 'normal' | 'global';

interface Scenario {
  movie: React.ReactNode;
  user: React.ReactNode;
  ok: boolean;
  statusText: React.ReactNode;
}

const TABS: { id: Tab; label: string; kind: 'err' | 'ok' }[] = [
  { id: 'broken', label: '❌ нет exports',    kind: 'err' },
  { id: 'normal', label: '✅ обычный импорт', kind: 'ok'  },
  { id: 'global', label: '🌐 @Global()',      kind: 'ok'  },
];

const SCENARIOS: Record<Tab, Scenario> = {
  broken: {
    movie: (
      <>
        {'@Module({\n  controllers: [MovieController],\n  providers: [MovieService],\n  '}
        <span className={s.dim}>{'// exports нет — закрыто снаружи'}</span>
        {'\n})\nexport class MovieModule {}'}
      </>
    ),
    user: (
      <>
        {'@Module({\n  imports: [MovieModule],\n  providers: [UserService],\n})\nexport class UserModule {}\n\n'}
        {'@Injectable()\nexport class UserService {\n  constructor(\n    private movieService: '}
        <span className={s.highlight}>MovieService</span>
        {', '}
        <span className={s.highlight}>{'// ← ОШИБКА'}</span>
        {'\n  ) {}\n}'}
      </>
    ),
    ok: false,
    statusText: (
      'Nest cannot inject MovieService into UserService. ' +
      'Please make sure that MovieService is exported from MovieModule.'
    ),
  },

  normal: {
    movie: (
      <>
        {'@Module({\n  controllers: [MovieController],\n  providers: [MovieService],\n  '}
        <span className={s.ok}>{'exports: [MovieService],  // ← открываем доступ'}</span>
        {'\n})\nexport class MovieModule {}'}
      </>
    ),
    user: (
      <>
        {'@Module({\n  '}
        <span className={s.ok}>{'imports: [MovieModule],   // ← берём модуль'}</span>
        {'\n  providers: [UserService],\n})\nexport class UserModule {}\n\n'}
        {'@Injectable()\nexport class UserService {\n  constructor(\n    private movieService: MovieService,  '}
        <span className={s.ok}>{'// ✓ работает'}</span>
        {'\n  ) {}\n}'}
      </>
    ),
    ok: true,
    statusText: (
      <>
        <strong>MovieService доступен в UserService через конструктор.</strong>{' '}
        <code>exports</code> открыл сервис, <code>imports</code> подключил модуль.
      </>
    ),
  },

  global: {
    movie: (
      <>
        <span className={s.ok}>{'@Global()          // ← весь модуль глобальный'}</span>
        {'\n@Module({\n  controllers: [MovieController],\n  providers: [MovieService],\n  '}
        <span className={s.ok}>{'exports: [MovieService],  // exports всё равно нужен'}</span>
        {'\n})\nexport class MovieModule {}'}
      </>
    ),
    user: (
      <>
        {'@Module({\n  '}
        <span className={s.dim}>{'// imports: [MovieModule] — не нужен'}</span>
        {'\n  providers: [UserService],\n})\nexport class UserModule {}\n\n'}
        {'@Injectable()\nexport class UserService {\n  constructor(\n    private movieService: MovieService,  '}
        <span className={s.ok}>{'// ✓ работает'}</span>
        {'\n  ) {}\n}'}
      </>
    ),
    ok: true,
    statusText: (
      <>
        <strong>@Global() + один раз в AppModule</strong> — и{' '}
        <code>movieService</code> доступен везде без явного <code>imports</code>.
        Остальные модули ничего не пишут.
      </>
    ),
  },
};

export function ModuleFlowDemo() {
  const [tab, setTab] = useState<Tab>('broken');
  const sc = SCENARIOS[tab];

  return (
    <div className={s.root}>
      <div className={s.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${s.tab} ${s[t.kind]} ${tab === t.id ? s.active : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.body}>
        <div className={s.panel}>
          <div className={s.panelLabel}>movie.module.ts</div>
          <div className={s.codeScroll}><pre className={s.code}>{sc.movie}</pre></div>
        </div>
        <div className={s.panel}>
          <div className={s.panelLabel}>user.module.ts + user.service.ts</div>
          <div className={s.codeScroll}><pre className={s.code}>{sc.user}</pre></div>
        </div>
      </div>

      <div className={`${s.status} ${sc.ok ? s.statusOk : s.statusErr}`}>
        <span className={s.statusIcon}>{sc.ok ? '✓' : '✕'}</span>
        <span className={s.statusText}>{sc.statusText}</span>
      </div>
    </div>
  );
}
