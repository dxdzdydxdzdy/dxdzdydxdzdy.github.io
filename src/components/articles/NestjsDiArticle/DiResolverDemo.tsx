'use client';

import { useState } from 'react';
import s from './DiResolverDemo.module.scss';

type NodeState = 'idle' | 'scanning' | 'waiting' | 'creating' | 'ready';

const NODE_LABELS: Record<NodeState, string> = {
  idle:     '○  ожидание',
  scanning: '⟳  читаю...',
  waiting:  '⏳ жду deps',
  creating: '⚙  создаю...',
  ready:    '✓  готов',
};

interface Step {
  title: string;
  desc: React.ReactNode;
  states: { user: NodeState; auth: NodeState; ctrl: NodeState };
  activeArrow?: 'user-auth' | 'auth-ctrl';
  code: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: 'Запуск приложения',
    desc: <>NestJS читает <code>AppModule</code> и видит три класса в <code>providers</code> и <code>controllers</code>. Начинается построение графа зависимостей.</>,
    states: { user: 'idle', auth: 'idle', ctrl: 'idle' },
    code: (
      <>
        {'@Module({\n  providers:   [UserService, AuthService],\n  controllers: [AuthController],\n})\nexport class AppModule {}'}
      </>
    ),
  },
  {
    title: 'Читаю AuthController',
    desc: <>Контейнер смотрит на конструктор <code>AuthController</code>. Тип первого параметра — <strong>AuthService</strong>. Значит нужен AuthService, ищу его.</>,
    states: { user: 'idle', auth: 'idle', ctrl: 'scanning' },
    activeArrow: 'auth-ctrl',
    code: (
      <>
        {'@Controller(\'auth\')\nexport class AuthController {\n  constructor(\n    private authService: '}
        <span className={s.hl}>AuthService</span>
        {',  '}
        <span className={s.ok}>{'// ← нужен этот'}</span>
        {'\n  ) {}\n}'}
      </>
    ),
  },
  {
    title: 'AuthService ещё не создан — читаю его',
    desc: <>AuthService ещё не создан. Читаю его конструктор: нужен <strong>UserService</strong>. Ищу его.</>,
    states: { user: 'idle', auth: 'scanning', ctrl: 'waiting' },
    activeArrow: 'user-auth',
    code: (
      <>
        {'@Injectable()\nexport class AuthService {\n  constructor(\n    private userService: '}
        <span className={s.hl}>UserService</span>
        {',  '}
        <span className={s.ok}>{'// ← нужен этот'}</span>
        {'\n  ) {}\n}'}
      </>
    ),
  },
  {
    title: 'UserService — зависимостей нет',
    desc: <>Читаю конструктор <code>UserService</code> — пустой, зависимостей нет. <strong>Создаю его первым.</strong> Именно с таких классов и начинается построение.</>,
    states: { user: 'creating', auth: 'waiting', ctrl: 'waiting' },
    code: (
      <>
        {'@Injectable()\nexport class UserService {\n  constructor() {}\n  '}
        <span className={s.ok}>{'// ↑ нет зависимостей — создаю сразу'}</span>
        {'\n}'}
      </>
    ),
  },
  {
    title: 'UserService готов → создаю AuthService',
    desc: <>UserService создан и сохранён в контейнере. Теперь AuthService может получить его через конструктор. <strong>Передаю готовый экземпляр.</strong></>,
    states: { user: 'ready', auth: 'creating', ctrl: 'waiting' },
    activeArrow: 'user-auth',
    code: (
      <>
        <span className={s.dim}>{'// Контейнер делает вот это:'}</span>
        {'\nconst us = registry.get(UserService);'}
        <span className={s.ok}>{' // ✓'}</span>
        {'\nconst as = new AuthService(us);    '}
        <span className={s.ok}>{'// ← передаём'}</span>
        {'\nregistry.set(AuthService, as);'}
      </>
    ),
  },
  {
    title: 'AuthService готов → создаю AuthController',
    desc: <>AuthService создан и сохранён. Теперь AuthController может получить его. <strong>Последний шаг.</strong></>,
    states: { user: 'ready', auth: 'ready', ctrl: 'creating' },
    activeArrow: 'auth-ctrl',
    code: (
      <>
        <span className={s.dim}>{'// И это:'}</span>
        {'\nconst as = registry.get(AuthService);'}
        <span className={s.ok}>{' // ✓'}</span>
        {'\nconst ctrl = new AuthController(as);'}
        <span className={s.ok}>{' // ←'}</span>
        {'\n'}
        <span className={s.ok}>{'// Маршруты GET /auth зарегистрированы ✓'}</span>
      </>
    ),
  },
  {
    title: 'Всё готово!',
    desc: <>Граф разрешён <strong>снизу вверх</strong>: сначала классы без зависимостей, потом те кто от них зависит. Каждый класс создан <strong>один раз</strong> (синглтон).</>,
    states: { user: 'ready', auth: 'ready', ctrl: 'ready' },
    code: (
      <>
        <span className={s.ok}>{'// Приложение принимает запросы!'}</span>
        {'\n// GET /auth/...\n//   → AuthController.method()\n//     → authService.method()\n//       → userService.method()\n//\n'}
        <span className={s.ok}>{'// Всё работает ✓'}</span>
      </>
    ),
  },
];

export function DiResolverDemo() {
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];
  const total = STEPS.length;

  return (
    <div className={s.root}>
      {/* Top bar */}
      <div className={s.topBar}>
        <span>
          <span className={s.stepTitle}>{step.title}</span>
          <span className={s.stepCount}>шаг {idx + 1}/{total}</span>
        </span>
        <div className={s.btns}>
          <button className={s.btn} onClick={() => setIdx(i => i - 1)} disabled={idx === 0}>
            ← назад
          </button>
          <button
            className={`${s.btn} ${idx < total - 1 ? s.primary : ''}`}
            onClick={() => setIdx(i => i + 1)}
            disabled={idx === total - 1}
          >
            {idx === total - 2 ? 'финал →' : 'вперёд →'}
          </button>
        </div>
      </div>

      {/* Graph */}
      <div className={s.graph}>
        <div className={`${s.node} ${s[step.states.user]}`}>
          <div className={s.nodeName}>UserService</div>
          <span className={s.nodeBadge}>{NODE_LABELS[step.states.user]}</span>
        </div>
        <span className={`${s.arrow} ${step.activeArrow === 'user-auth' ? s.active : ''}`}>
          →
        </span>
        <div className={`${s.node} ${s[step.states.auth]}`}>
          <div className={s.nodeName}>AuthService</div>
          <span className={s.nodeBadge}>{NODE_LABELS[step.states.auth]}</span>
        </div>
        <span className={`${s.arrow} ${step.activeArrow === 'auth-ctrl' ? s.active : ''}`}>
          →
        </span>
        <div className={`${s.node} ${s[step.states.ctrl]}`}>
          <div className={s.nodeName}>AuthController</div>
          <span className={s.nodeBadge}>{NODE_LABELS[step.states.ctrl]}</span>
        </div>
      </div>

      {/* Info */}
      <div className={s.info}>
        <div className={s.desc}>{step.desc}</div>
        <div className={s.codeWrap}>
          <pre className={s.code}>{step.code}</pre>
        </div>
      </div>

      {/* Progress dots */}
      <div className={s.dots}>
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`${s.dot} ${i === idx ? s.current : i < idx ? s.done : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
