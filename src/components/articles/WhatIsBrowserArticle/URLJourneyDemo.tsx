'use client';

import { useState } from 'react';
import s from './URLJourneyDemo.module.scss';

type VisualType = 'urlBar' | 'dns' | 'connect' | 'request' | 'response' | 'render';

interface StepData {
  id: string;
  title: string;
  sublabel: string;
  color: string;
  desc: string;
  visualType: VisualType;
}

const STEPS: StepData[] = [
  {
    id: 'enter',
    title: 'Нажал Enter',
    sublabel: 'браузер читает адрес',
    color: '#3d5562',
    desc: 'Ты ввёл адрес сайта в адресную строку и нажал Enter. Адрес сайта называется URL — например, google.com, youtube.com, vk.com. Браузер считал адрес и начинает работу.',
    visualType: 'urlBar',
  },
  {
    id: 'dns',
    title: 'Поиск адреса',
    sublabel: 'google.com → 142.250.185.78',
    color: '#f0c040',
    desc: 'Компьютеры в интернете не знают слово «google.com» — они общаются через числовые адреса. Специальный сервис DNS переводит имя сайта в число. Это как телефонная книга: ты знаешь имя человека, она говорит его номер.',
    visualType: 'dns',
  },
  {
    id: 'connect',
    title: 'Соединение',
    sublabel: 'браузер связывается с сервером',
    color: '#b48eff',
    desc: 'Теперь браузер знает адрес и стучится к серверу. Сервер — это мощный компьютер Google, который хранит сайт и ждёт запросов круглосуточно. Браузер и сервер включают шифрование — поэтому в адресной строке есть замочек 🔒.',
    visualType: 'connect',
  },
  {
    id: 'request',
    title: 'Запрос',
    sublabel: 'браузер просит страницу',
    color: '#4db8ff',
    desc: 'Браузер говорит серверу: «Дай мне главную страницу». Это работает как письмо: браузер указывает что хочет получить, сервер читает и готовит ответ.',
    visualType: 'request',
  },
  {
    id: 'response',
    title: 'Ответ сервера',
    sublabel: 'файлы летят к тебе',
    color: '#00e5a0',
    desc: 'Сервер отвечает и присылает файлы страницы. Их несколько типов: HTML — скелет страницы (заголовки, кнопки, тексты), CSS — внешний вид (цвета, шрифты, отступы), JavaScript — поведение при нажатиях. Плюс картинки, шрифты, иконки.',
    visualType: 'response',
  },
  {
    id: 'render',
    title: 'Рисует страницу',
    sublabel: 'код превращается в изображение',
    color: '#ff9070',
    desc: 'Браузер берёт все полученные файлы и превращает их в то, что ты видишь на экране. Читает HTML, строит структуру, накладывает стили, запускает код — и рисует всё пикселями. Весь путь от нажатия Enter до готовой страницы занимает меньше секунды.',
    visualType: 'render',
  },
];

function VisualUrlBar() {
  return (
    <div className={s.visual}>
      <div className={s.urlBar}>
        <span className={s.urlLock}>🔒</span>
        <span className={s.urlText}>google.com</span>
        <span className={s.urlCursor} />
        <span className={s.urlEnter}>↵ Enter</span>
      </div>
      <div className={s.visualNote}>URL — адрес любого сайта в интернете</div>
    </div>
  );
}

function VisualDns() {
  return (
    <div className={s.visual}>
      <div className={s.dnsRow}>
        <div className={s.dnsBox}>
          <div className={s.dnsVal}>google.com</div>
          <div className={s.dnsHint}>имя сайта</div>
        </div>
        <div className={s.dnsArrow}>
          <div className={s.dnsArrowLine} />
          <div className={s.dnsArrowLabel}>DNS</div>
          <div className={s.dnsArrowTip}>→</div>
        </div>
        <div className={s.dnsBox}>
          <div className={`${s.dnsVal} ${s.dnsIp}`}>142.250.185.78</div>
          <div className={s.dnsHint}>числовой адрес</div>
        </div>
      </div>
    </div>
  );
}

function VisualConnect() {
  return (
    <div className={s.visual}>
      <div className={s.connectRow}>
        <div className={s.connectNode}>
          <div className={s.connectEmoji}>🌐</div>
          <div className={s.connectLabel}>твой браузер</div>
        </div>
        <div className={s.connectWire}>
          <div className={s.connectWireLine} />
          <div className={s.connectWireLock}>🔒</div>
          <div className={s.connectWireLine} />
        </div>
        <div className={s.connectNode}>
          <div className={s.connectEmoji}>🖥</div>
          <div className={s.connectLabel}>сервер Google</div>
        </div>
      </div>
    </div>
  );
}

function VisualRequest() {
  return (
    <div className={s.visual}>
      <div className={s.reqBox}>
        <div className={s.reqLine}>
          <span className={s.reqKey}>Что хочу:</span>
          <span> главную страницу google.com</span>
        </div>
        <div className={s.reqLine}>
          <span className={s.reqKey}>Язык:</span>
          <span> русский</span>
        </div>
        <div className={s.reqLine}>
          <span className={s.reqKey}>Браузер:</span>
          <span> Chrome 125</span>
        </div>
        <div className={s.reqSend}>→ отправлено серверу</div>
      </div>
    </div>
  );
}

function VisualResponse() {
  const files = [
    { label: 'HTML', color: '#ff9070', desc: 'структура' },
    { label: 'CSS', color: '#4db8ff', desc: 'стили' },
    { label: 'JS', color: '#f0c040', desc: 'код' },
    { label: 'IMG', color: '#b48eff', desc: 'картинки' },
  ];
  return (
    <div className={s.visual}>
      <div className={s.filesRow}>
        {files.map(f => (
          <div key={f.label} className={s.fileCard} style={{ '--fc': f.color } as React.CSSProperties}>
            <div className={s.fileExt}>{f.label}</div>
            <div className={s.fileDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualRender() {
  return (
    <div className={s.visual}>
      <div className={s.renderRow}>
        <div className={s.renderCode}>
          <div className={s.renderCodeLine} style={{ color: '#f0c040' }}>&lt;html&gt;</div>
          <div className={s.renderCodeLine} style={{ paddingLeft: 12, color: '#4db8ff' }}>&lt;h1&gt;Google&lt;/h1&gt;</div>
          <div className={s.renderCodeLine} style={{ paddingLeft: 12, color: '#b48eff' }}>color: #4285F4</div>
          <div className={s.renderCodeLine} style={{ color: '#f0c040' }}>&lt;/html&gt;</div>
        </div>
        <div className={s.renderArrow}>→</div>
        <div className={s.renderPage}>
          <div className={s.renderPageLogo}>Google</div>
          <div className={s.renderPageSearch}>🔍 поиск</div>
        </div>
      </div>
    </div>
  );
}

const VISUAL_MAP: Record<VisualType, React.FC> = {
  urlBar: VisualUrlBar,
  dns: VisualDns,
  connect: VisualConnect,
  request: VisualRequest,
  response: VisualResponse,
  render: VisualRender,
};

export function URLJourneyDemo() {
  const [current, setCurrent] = useState(-1);
  const active = current >= 0 ? STEPS[current] : null;

  function goTo(i: number) {
    setCurrent(Math.max(0, Math.min(STEPS.length - 1, i)));
  }

  const Visual = active ? VISUAL_MAP[active.visualType] : null;

  return (
    <div className={s.demo}>
      <div className={s.demoHeader}>
        <span className={s.demoTitle}>// адрес → страница</span>
      </div>

      <div className={s.pipeline}>
        {STEPS.map((step, i) => {
          const state = i < current ? 'done' : i === current ? 'active' : 'pending';
          return (
            <div
              key={step.id}
              className={`${s.step} ${s[state]}`}
              style={{ '--sc': step.color } as React.CSSProperties}
              onClick={() => setCurrent(i)}
            >
              <div className={s.stepNum}>{i + 1}</div>
              <div className={s.stepDot} />
              <div className={s.stepLabel}>{step.title}</div>
            </div>
          );
        })}
      </div>

      {active && Visual ? (
        <div className={s.detail} style={{ '--sc': active.color } as React.CSSProperties}>
          <div className={s.detailMeta}>шаг {current + 1} из {STEPS.length}</div>
          <div className={s.detailTitle}>{active.title}</div>
          <div className={s.detailDesc}>{active.desc}</div>
          <Visual />
          <div className={s.nav}>
            <button
              className={s.navBtn}
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
            >← назад</button>
            <button
              className={s.navBtn}
              onClick={() => goTo(current + 1)}
              disabled={current === STEPS.length - 1}
            >вперёд →</button>
          </div>
        </div>
      ) : (
        <div className={s.hint}>кликни на любой шаг — узнаешь что делает браузер</div>
      )}
    </div>
  );
}
