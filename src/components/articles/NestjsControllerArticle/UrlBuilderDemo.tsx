'use client';

import { useState } from 'react';
import s from './UrlBuilderDemo.module.scss';

export function UrlBuilderDemo() {
  const [globalPrefix, setGlobalPrefix] = useState('api');
  const [ctrlPrefix, setCtrlPrefix]     = useState('movies');
  const [methodPath, setMethodPath]     = useState(':id');

  const gp = globalPrefix.replace(/^\/+|\/+$/g, '');
  const cp = ctrlPrefix.replace(/^\/+|\/+$/g, '');
  const mp = methodPath.replace(/^\/+|\/+$/g, '');

  const noSegments = !gp && !cp && !mp;

  return (
    <div className={s.root}>
      <div className={s.inputs}>
        <label className={s.inputGroup}>
          <span className={s.inputLabel}>Глобальный префикс</span>
          <span className={s.inputSub}>main.ts → setGlobalPrefix()</span>
          <div className={s.inputWrap}>
            <span className={s.slash}>/</span>
            <input
              className={`${s.input} ${s.global}`}
              value={globalPrefix}
              onChange={e => setGlobalPrefix(e.target.value)}
              placeholder="api"
            />
          </div>
        </label>

        <label className={s.inputGroup}>
          <span className={s.inputLabel}>Префикс контроллера</span>
          <span className={s.inputSub}>@Controller('...')</span>
          <div className={s.inputWrap}>
            <span className={s.slash}>/</span>
            <input
              className={`${s.input} ${s.ctrl}`}
              value={ctrlPrefix}
              onChange={e => setCtrlPrefix(e.target.value)}
              placeholder="movies"
            />
          </div>
        </label>

        <label className={s.inputGroup}>
          <span className={s.inputLabel}>Путь метода</span>
          <span className={s.inputSub}>@Get('...') / @Post('...')</span>
          <div className={s.inputWrap}>
            <span className={s.slash}>/</span>
            <input
              className={`${s.input} ${s.method}`}
              value={methodPath}
              onChange={e => setMethodPath(e.target.value)}
              placeholder=":id"
            />
          </div>
        </label>
      </div>

      <div className={s.result}>
        <span className={s.resultLabel}>Итоговый URL</span>
        <div className={s.url}>
          <span className={s.base}>localhost:3000</span>
          {noSegments && <span className={s.segRoot}>/</span>}
          {gp && <span className={`${s.seg} ${s.segGlobal}`}>/{gp}</span>}
          {cp && <span className={`${s.seg} ${s.segCtrl}`}>/{cp}</span>}
          {mp && <span className={`${s.seg} ${s.segMethod}`}>/{mp}</span>}
        </div>
        <div className={s.legend}>
          {gp && <span className={`${s.badge} ${s.badgeGlobal}`}>setGlobalPrefix</span>}
          {cp && <span className={`${s.badge} ${s.badgeCtrl}`}>@Controller</span>}
          {mp && <span className={`${s.badge} ${s.badgeMethod}`}>@Get / @Post</span>}
        </div>
      </div>
    </div>
  );
}
