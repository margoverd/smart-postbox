"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Gauge,
  CheckCircle2,
  BatteryLow,
  Truck,
  Route,
  Radio,
  ArrowRight,
  Wifi,
  Snowflake,
  Coins,
  Cpu,
  Users,
  Play,
  MapPin,
  Fuel,
  Target,
  Sparkles,
  ShieldX,
  Clock,
  BarChart3,
  Layers,
  Globe,
} from "lucide-react";

/* Брендовые цвета Latvijas Pasts */
const Y = "#FFCC00";
const Y2 = "#FDB913";
const INK = "#1A1F2C";
const STORAGE_KEY = "mg-pitch-slide";

const TONE = {
  rose: { bg: "bg-rose-100", fg: "text-rose-600", bar: "bg-rose-500" },
  amber: { bg: "bg-amber-100", fg: "text-amber-600", bar: "bg-amber-400" },
  emerald: {
    bg: "bg-emerald-100",
    fg: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  slate: { bg: "bg-slate-100", fg: "text-slate-600", bar: "bg-slate-400" },
};

function Kpi({ icon: Icon, value, label, tone = "slate" }) {
  const t = TONE[tone];
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200/70 p-5 flex items-center gap-4 text-slate-900">
      <span
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${t.bg} ${t.fg}`}
      >
        <Icon className="w-7 h-7" strokeWidth={2.2} />
      </span>
      <span>
        <span className={`block text-4xl font-black leading-none ${t.fg}`}>
          {value}
        </span>
        <span className="block text-lg text-slate-500 mt-1.5">{label}</span>
      </span>
    </div>
  );
}

function BoxRow({ name, pct, tone, label }) {
  const t = TONE[tone];
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl px-4 py-3 text-slate-900">
      <span className={`w-3.5 h-3.5 rounded-full ${t.bar}`} />
      <span className="w-52 text-xl font-bold truncate">{name}</span>
      <span className="h-3 flex-1 rounded-full bg-slate-100 overflow-hidden">
        <span
          className={`block h-full rounded-full ${t.bar}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className={`w-16 text-right text-xl font-black ${t.fg}`}>
        {pct}%
      </span>
      <span className={`w-32 text-right text-base font-bold ${t.fg}`}>
        {label}
      </span>
    </div>
  );
}

function Title({ children, dark, eyebrow }) {
  return (
    <div>
      {eyebrow && (
        <div
          className="inline-block rounded-full px-5 py-1.5 text-xl font-extrabold uppercase tracking-wider mb-4"
          style={{ background: dark ? "rgba(255,204,0,0.18)" : INK, color: Y }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className="text-[64px] leading-[1.06] font-black tracking-tight max-w-[1680px]"
        style={{ color: dark ? "#fff" : INK }}
      >
        {children}
      </h2>
    </div>
  );
}

/* ---------- 1. HOOK (0:00 – 0:25 | 25 сек) ---------- */
function Slide1() {
  return (
    <div
      className="h-full grid grid-cols-[1fr_820px] gap-16 items-center px-24"
      style={{ background: INK }}
    >
      <div>
        <span
          className="inline-block rounded-full px-6 py-3 text-2xl font-extrabold mb-10"
          style={{ background: Y, color: INK }}
        >
          RobotHack ’26 · Challenge by Latvijas Pasts
        </span>
        <h1
          className="text-[185px] leading-none font-black tracking-tight"
          style={{ color: Y }}
        >
          EmptyLess
        </h1>
        <p className="text-[36px] leading-snug text-white/90 mt-8 font-medium">
          Каждый день фургоны Latvijas Pasts объезжают{" "}
          <strong className="text-white">547 почтовых ящиков</strong> со
          скоростью <strong className="text-white">15–20 км/ч</strong>, не зная,
          лежит ли внутри хоть одно письмо.
        </p>
        <p className="text-[28px] text-white/60 mt-5">
          Переводим почтовую логистику Латвии со слепого графика на выемку по
          реальному спросу.
        </p>
      </div>
      {/* макет дашборда */}
      <div className="rounded-3xl p-6 space-y-4 bg-slate-100 shadow-2xl rotate-1">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white text-4xl font-black flex items-center justify-center">
            3
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">
              3 pickups to do
            </div>
            <div className="text-lg text-slate-500">
              Riga · Pļavnieki, Purvciems, Āgenskalns
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Kpi icon={AlertTriangle} value="3" label="Full (≥85%)" tone="rose" />
          <Kpi icon={Gauge} value="5" label="Almost full" tone="amber" />
        </div>
        <div
          className="rounded-2xl overflow-hidden h-44 relative"
          style={{ background: "#dfe7ee" }}
        >
          {[
            [18, 30, "rose"],
            [42, 62, "rose"],
            [66, 28, "amber"],
            [78, 66, "emerald"],
            [30, 74, "emerald"],
            [56, 44, "amber"],
          ].map(([x, y, c], i) => (
            <span
              key={i}
              className={`absolute w-6 h-6 rounded-full border-4 border-white shadow ${TONE[c].bar}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          ))}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              points="18,30 42,62 56,44 66,28"
              fill="none"
              stroke={INK}
              strokeWidth="1.2"
              strokeDasharray="3 2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <BoxRow name="Origo / Centrs" pct={96} tone="rose" label="Full" />
        <BoxRow name="Purvciems" pct={78} tone="amber" label="Almost full" />
        <BoxRow name="Āgenskalns" pct={12} tone="emerald" label="Skip" />
      </div>
    </div>
  );
}

/* ---------- 2. PROBLEM > OPPORTUNITY (0:25 – 0:55 | 30 сек) ---------- */
function Slide2() {
  const cards = [
    {
      big: "547",
      unit: "ящиков в сети Латвии",
      text: "164 традиционных и 383 интегрированных ящика. Почтовый трафик упал на 25% за 2 года — курьеры вслепую тратят €11.87/ч (брутто) и топливо по €2.00/л.",
      icon: Truck,
    },
    {
      big: "15–20",
      unit: "км/ч реальная скорость",
      text: "В Риге с учётом остановок у ящиков и пробок (19.2 км/ч в час пик) каждая лишняя остановка сжигает драгоценное время смены и 6.6 л/100 км.",
      icon: Clock,
    },
    {
      big: "83 из 112",
      unit: "убрано вслепую в 2025",
      text: "Из-за падения спроса сеть сокращают, но без телеметрии невозможно отличить «мёртвый» ящик от важного для жителей района.",
      icon: AlertTriangle,
    },
  ];
  return (
    <div className="h-full px-24 py-16 flex flex-col justify-between bg-slate-50">
      <Title eyebrow="02 · Problem → Opportunity">
        Бумажных писем{" "}
        <span className="px-4 rounded-2xl" style={{ background: Y }}>
          −25% за 2 года
        </span>
        , а маршруты всё ещё как в 2010-м
      </Title>
      <div className="grid grid-cols-3 gap-10">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border-2 border-slate-200 p-10 shadow-sm"
          >
            <span
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
              style={{ background: INK, color: Y }}
            >
              <c.icon className="w-10 h-10" strokeWidth={2.2} />
            </span>
            <div
              className="text-[82px] leading-none font-black"
              style={{ color: INK }}
            >
              {c.big}
            </div>
            <div className="text-3xl font-extrabold text-rose-600 mt-3">
              {c.unit}
            </div>
            <p className="text-[26px] leading-snug text-slate-600 mt-6">
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 3. SOLUTION: JTBD + VALUE PROPOSITION + NO-VALUE FORMULA (0:55 – 1:30 | 35 сек) ---------- */
function Slide3() {
  return (
    <div
      className="h-full px-24 py-16 flex flex-col justify-between"
      style={{ background: INK }}
    >
      <Title dark eyebrow="03 · Solution & Product Strategy">
        Решение: <span style={{ color: Y }}>IoT-телеметрия + OSRM</span> для
        диспетчера и курьера
      </Title>

      {/* JTBD + Value Proposition */}
      <div className="grid grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white/10 border border-white/20 p-9">
          <div className="flex items-center gap-4 mb-4">
            <span
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: Y, color: INK }}
            >
              <Target className="w-8 h-8" strokeWidth={2.4} />
            </span>
            <span
              className="text-2xl font-black uppercase tracking-wider"
              style={{ color: Y }}
            >
              Jobs To Be Done (JTBD)
            </span>
          </div>
          <p className="text-[27px] leading-snug text-white font-medium">
            «Когда{" "}
            <strong className="text-amber-300">диспетчер Latvijas Pasts</strong>{" "}
            планирует утренний выезд по Риге и районам, он хочет{" "}
            <strong className="text-amber-300">
              видеть реальную заполненность каждого ящика
            </strong>
            , чтобы{" "}
            <strong className="text-emerald-400">
              исключить пустые остановки на 15–20 км/ч
            </strong>{" "}
            и перенаправить курьеров на растущий поток посылок».
          </p>
        </div>

        <div className="rounded-3xl bg-white/10 border border-white/20 p-9">
          <div className="flex items-center gap-4 mb-4">
            <span
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: Y, color: INK }}
            >
              <Sparkles className="w-8 h-8" strokeWidth={2.4} />
            </span>
            <span
              className="text-2xl font-black uppercase tracking-wider"
              style={{ color: Y }}
            >
              Value Proposition Formula
            </span>
          </div>
          <p className="text-[27px] leading-snug text-white font-medium">
            Мы помогаем{" "}
            <strong className="text-amber-300">
              национальным почтовым операторам
            </strong>{" "}
            сократить{" "}
            <strong className="text-amber-300">
              холостой пробег, топливо (€2/л) и часы курьеров (€11.87/ч)
            </strong>{" "}
            за счёт{" "}
            <strong className="text-emerald-400">
              автономных датчиков (€65/узел) и динамической OSRM-маршрутизации
            </strong>{" "}
            — без замены самих ящиков.
          </p>
        </div>
      </div>

      {/* No-Value Proposition Formula */}
      <div className="rounded-3xl bg-rose-950/60 border-2 border-rose-500/40 p-8 flex items-center gap-8">
        <span className="w-20 h-20 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
          <ShieldX className="w-11 h-11" strokeWidth={2.3} />
        </span>
        <div>
          <div className="text-xl font-black uppercase tracking-wider text-rose-400 mb-1">
            No-Value Proposition (Что мы сознательно НЕ делаем)
          </div>
          <p className="text-[26px] text-white/90 leading-snug">
            Мы <strong>не</strong> ставим дорогие камеры с компьютерным зрением,{" "}
            <strong>не</strong> требуем 5G/Wi-Fi в каждом дворе и{" "}
            <strong>не</strong> заставляем покупать новые «умные» ящики за
            €1,500+ — вместо этого превращаем существующий парк в умную сеть за{" "}
            <strong>15 минут монтажа</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. LIVE DEMO: САЙТ + ИНТЕРАКТИВНЫЙ ДАШБОРД (1:30 – 3:10 | 1 мин 40 сек — ГЛАВНЫЙ БЛОК!) ---------- */
function Slide4({ onOpenDemo }) {
  const steps = [
    {
      tone: "emerald",
      icon: CheckCircle2,
      status: "0–54% · OK",
      t: "Игнорируем пустые",
      d: "Датчик весит + ИК-объём (2.6–3.25 кг/л): ящик не попадает в маршрут",
    },
    {
      tone: "amber",
      icon: Gauge,
      status: "55–84% · Monitor",
      t: "Готовим приоритет",
      d: "Система видит рост в Плявниеках и Пурвциемсе до переполнения",
    },
    {
      tone: "rose",
      icon: Route,
      status: "≥85% · Full",
      t: "OSRM перестраивает путь",
      d: "Мгновенный алерт и оптимальный трек только по полным точкам",
    },
    {
      tone: "emerald",
      icon: Truck,
      status: "Выемка в 1 клик",
      t: "Аналитика сети 24/7",
      d: "Курьер подтверждает забор; диспетчер видит тепловую карту спроса",
    },
  ];
  return (
    <div className="h-full px-24 py-16 flex flex-col justify-between bg-slate-50">
      <Title eyebrow="04 · Live Prototype & Web Platform">
        Живое демо: от 3D-датчика в ящике до маршрута курьера
      </Title>
      <div className="grid grid-cols-4 gap-8">
        {steps.map((s, i) => {
          const t = TONE[s.tone];
          return (
            <div
              key={i}
              className="bg-white rounded-3xl border-2 border-slate-200 p-8 relative"
            >
              <div className="text-xl font-black text-slate-300 absolute top-6 right-8">
                0{i + 1}
              </div>
              <span
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${t.bg} ${t.fg}`}
              >
                <s.icon className="w-9 h-9" strokeWidth={2.2} />
              </span>
              <span
                className={`inline-block mt-5 text-lg font-bold border-2 rounded-full px-4 py-1 ${t.fg} border-current`}
              >
                {s.status}
              </span>
              <div
                className="text-[30px] font-black mt-4"
                style={{ color: INK }}
              >
                {s.t}
              </div>
              <p className="text-[22px] text-slate-600 mt-2 leading-snug">
                {s.d}
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-3xl p-8 flex items-center justify-between"
        style={{ background: INK }}
      >
        <div>
          <div className="text-2xl font-bold text-white/70">
            Покажем прямо сейчас в браузере:
          </div>
          <div className="text-[34px] font-black text-white mt-1">
            1. 3D-симуляция заполнения MX-01 → 2. Сравнение маршрутов OSRM → 3.
            Дашборд Курьера и Диспетчера
          </div>
        </div>
        <button
          onClick={onOpenDemo}
          className="inline-flex items-center gap-4 rounded-2xl px-10 py-6 text-[34px] font-black shadow-xl transition active:scale-[0.98] cursor-pointer shrink-0"
          style={{ background: Y, color: INK }}
        >
          <Play className="w-8 h-8 fill-current" /> Открыть сайт и дашборд{" "}
          <ArrowRight className="w-9 h-9" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

/* ---------- 5. USP & COMPETITIVE EDGE (3:10 – 3:35 | 25 сек) ---------- */
function Slide5() {
  const rows = [
    [
      "Критерий",
      "Фиксированный график (Сейчас)",
      "Умные ящики с нуля",
      "EmptyLess (Наш подход)",
    ],
    [
      "Цена внедрения на 1 точку",
      "€0 (но скрытые убытки)",
      "€1,500 – €2,500 / ящик",
      "€65 (оптовый комплект без НДС)",
    ],
    [
      "Срок развёртывания в Латвии",
      "Уже работает",
      "12–24 мес. + стройработы",
      "15 минут на ящик (Retrofit)",
    ],
    [
      "Точность заполнения",
      "0% (вслепую)",
      "Датчик объёма",
      "Двойной сенсор: Вес + ИК-объём",
    ],
    [
      "Поставщики и надёжность",
      "—",
      "Долгая поставка",
      "100% локальные магазины Латвии",
    ],
  ];
  return (
    <div
      className="h-full px-24 py-16 flex flex-col justify-between"
      style={{ background: INK }}
    >
      <Title dark eyebrow="05 · USP & Alternatives">
        Почему <span style={{ color: Y }}>MailGrid выигрывает</span> у замены
        ящиков и старого графика
      </Title>
      <div className="rounded-3xl overflow-hidden bg-white text-[25px] shadow-2xl">
        {rows.map((r, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1.1fr_1fr_1fr_1.25fr] ${i === 0 ? "font-black text-xl uppercase tracking-wide bg-slate-100 text-slate-600" : "border-t border-slate-200"}`}
          >
            <div className="px-7 py-5 font-bold text-slate-900">{r[0]}</div>
            <div
              className={`px-7 py-5 ${i === 0 ? "" : "text-rose-600 font-semibold"}`}
            >
              {r[1]}
            </div>
            <div
              className={`px-7 py-5 ${i === 0 ? "" : "text-slate-500 font-semibold"}`}
            >
              {r[2]}
            </div>
            <div
              className={`px-7 py-5 ${i === 0 ? "bg-amber-100 text-slate-900" : "bg-emerald-50 text-emerald-800 font-black"}`}
            >
              {r[3]}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-6 text-2xl text-white/75 font-semibold">
        <Snowflake className="w-8 h-8 text-amber-400" /> Работа до −25°C ·{" "}
        <Wifi className="w-8 h-8 text-amber-400" /> NB-IoT / LoRaWAN сквозь
        металл · <Coins className="w-8 h-8 text-amber-400" /> Все комплектующие
        из официальных магазинов Латвии
      </div>
    </div>
  );
}

/* ---------- 6. MARKET & BUSINESS MODEL (3:35 – 4:00 | 25 сек) ---------- */
function Slide6() {
  return (
    <div className="h-full px-24 py-16 flex flex-col justify-between bg-slate-50">
      <Title eyebrow="06 · Market & Unit Economics">
        Математика Латвии:{" "}
        <span className="px-4 rounded-2xl" style={{ background: Y }}>
          €65 за узел
        </span>{" "}
        окупается за 4–6 месяцев
      </Title>
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-9">
          <div className="text-xl font-black text-slate-400 uppercase">
            Рынок Латвии (TAM / SAM)
          </div>
          <div
            className="text-[76px] font-black leading-none mt-3"
            style={{ color: INK }}
          >
            547
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            почтовых ящиков в стране
          </div>
          <p className="text-[23px] text-slate-600 mt-5 leading-snug">
            <strong>164</strong> классических + <strong>383</strong>{" "}
            интегрированных. Приоритет старта — плотные районы Риги:{" "}
            <em>
              Плявниеки, Пурвциемс, Иманта, Агенскалнс, Золитуде и Рижский район
            </em>
            .
          </p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-slate-200 p-9">
          <div className="text-xl font-black text-slate-400 uppercase">
            Реальные затраты парка
          </div>
          <div
            className="text-[76px] font-black leading-none mt-3"
            style={{ color: INK }}
          >
            €2.00<span className="text-4xl">/л</span>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">
            6.6 л/100 км · €11.87/ч курьер
          </div>
          <p className="text-[23px] text-slate-600 mt-5 leading-snug">
            При средней скорости сбора <strong>15–20 км/ч</strong> (в час пик{" "}
            <strong>19.2 км/ч</strong>) исключение пустых точек экономит до 30%
            времени смены и топлива.
          </p>
        </div>

        <div
          className="rounded-3xl p-9 flex flex-col justify-between"
          style={{ background: INK }}
        >
          <div>
            <div className="text-xl font-black uppercase" style={{ color: Y }}>
              B2B / GovTech Модель
            </div>
            <div className="text-[68px] font-black leading-none text-white mt-3">
              €65{" "}
              <span className="text-3xl font-bold text-white/60">без НДС</span>
            </div>
            <div className="text-2xl font-bold mt-2" style={{ color: Y }}>
              + €4/мес SaaS-подписка за узел
            </div>
          </div>
          <p className="text-[22px] text-white/80 leading-snug mt-4">
            Оптовая закупка (НДС возвращается юрлицу) + облачная аналитика
            маршрутов и тепловая карта спроса для управления сетью.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- 7. VALIDATION: ЧТО УЖЕ СДЕЛАНО (4:00 – 4:18 | 18 сек) ---------- */
function Slide7() {
  const items = [
    {
      big: "100% BOM",
      t: "Просчитанная спецификация (Латвия)",
      d: "Подобраны реальные тензодатчики, ИК-сенсоры и контроллеры у официальных поставщиков в Латвии (не AliExpress) — €65 за комплект.",
    },
    {
      big: "3D + OSRM",
      t: "Рабочий веб-прототип и алгоритм",
      d: "Собран интерактивный сайт с 3D-симуляцией ящика MX-01, расчётом реальных маршрутов по Риге (OSRM) и кабинетами Курьера и Диспетчера.",
    },
    {
      big: "2.6–3.25",
      t: "кг/л — калибровка физической модели",
      d: "Учтены плотность корреспонденции, падение писем на 25% за 2 года, реальная скорость трафика (15–20 км/ч) и статистика демонтажа 83 ящиков.",
    },
  ];
  return (
    <div
      className="h-full px-24 py-16 flex flex-col justify-between"
      style={{ background: INK }}
    >
      <Title dark eyebrow="07 · Validation & Progress">
        Что уже готово:{" "}
        <span style={{ color: Y }}>инженерные расчёты + живой продукт</span>
      </Title>
      <div className="grid grid-cols-3 gap-10">
        {items.map((c, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white/10 border border-white/20 p-10"
          >
            <div
              className="text-[68px] leading-none font-black"
              style={{ color: Y }}
            >
              {c.big}
            </div>
            <div className="text-[32px] font-extrabold text-white mt-5">
              {c.t}
            </div>
            <p className="text-[25px] text-white/75 mt-4 leading-snug">{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 8. TEAM (4:18 – 4:32 | 14 сек) ---------- */
function Slide8() {
  const team = [
    {
      name: "Алан",
      role: "Hardware & Unit Economics",
      desc: "Подбор компонентов в Латвии (€65 BOM), расчёт топлива, ставок курьеров и ROI",
    },
    {
      name: "Алиса",
      role: "Market & Network Analytics",
      desc: "Анализ сети Latvijas Pasts (547 ящиков), география Риги и весовые коэффициенты",
    },
    {
      name: "Соня",
      role: "Logistics & Traffic Modeling",
      desc: "Моделирование скоростей движения (15–20 км/ч), городских лимитов и маршрутов",
    },
    {
      name: "Лидер / Dev",
      role: "Full-Stack, 3D & OSRM",
      desc: "Архитектура веб-платформы, 3D-симуляция ящика и дашборды диспетчера/курьера",
    },
  ];
  return (
    <div className="h-full px-24 py-16 flex flex-col justify-between bg-slate-50">
      <Title eyebrow="08 · Team">
        Команда, которая объединила{" "}
        <span className="px-4 rounded-2xl" style={{ background: Y }}>
          данные, железо и код
        </span>
      </Title>
      <div className="grid grid-cols-4 gap-8">
        {team.map((m, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border-2 border-slate-200 p-8 flex flex-col items-center text-center shadow-sm"
          >
            <span
              className="w-24 h-24 rounded-full flex items-center justify-center mb-5 text-4xl font-black"
              style={{ background: INK, color: Y }}
            >
              {m.name[0]}
            </span>
            <div className="text-[34px] font-black" style={{ color: INK }}>
              {m.name}
            </div>
            <div className="text-xl font-extrabold text-emerald-600 mt-1">
              {m.role}
            </div>
            <p className="text-[22px] text-slate-600 mt-4 leading-snug">
              {m.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 9. ASK & PLAN (4:32 – 4:46 | 14 сек) ---------- */
function Slide9() {
  const tl = [
    [
      "Недели 1–2 · Сборка и монтаж",
      "Закупка комплектующих в Латвии (€1,950 на 30 узлов) и установка в Плявниеках, Пурвциемсе и Центре Риги.",
    ],
    [
      "Недели 3–6 · Параллельный тест",
      "Сбор телеметрии 24/7 и сравнение OSRM-маршрутов с контрольной группой по топливу (€2/л) и часам курьеров.",
    ],
    [
      "Недели 7–8 · Отчёт и масштабирование",
      "Расчёт фактической экономии, рекомендации по оптимизации сети из 547 ящиков и контракт на всю страну.",
    ],
  ];
  return (
    <div
      className="h-full px-24 py-16 flex flex-col justify-between"
      style={{ background: INK }}
    >
      <Title dark eyebrow="09 · Ask & Pilot Plan">
        Запрос: <span style={{ color: Y }}>пилот на 30 ящиках в Риге</span> за 8
        недель
      </Title>
      <div className="grid grid-cols-[560px_1fr] gap-12">
        <div
          className="rounded-3xl p-10 flex flex-col justify-center"
          style={{ background: Y, color: INK }}
        >
          <div className="text-2xl font-black uppercase">
            Бюджет пилота (30 шт.)
          </div>
          <div className="text-[120px] leading-none font-black mt-2">
            €1,950
          </div>
          <div className="text-3xl font-extrabold mt-2">
            30 узлов × €65 (без НДС)
          </div>
          <p className="text-[24px] font-semibold mt-6 leading-snug">
            Нужен доступ к 30 ящикам в Риге и тестовый API-обмен с диспетчерской
            службой Latvijas Pasts.
          </p>
        </div>
        <div className="space-y-6">
          {tl.map(([w, d], i) => (
            <div
              key={i}
              className="flex gap-7 rounded-3xl bg-white/10 border border-white/20 p-7 items-center"
            >
              <span
                className="w-16 h-16 rounded-2xl text-3xl font-black flex items-center justify-center shrink-0"
                style={{ background: Y, color: INK }}
              >
                {i + 1}
              </span>
              <div>
                <div className="text-[32px] font-black text-white">{w}</div>
                <p className="text-[23px] text-white/75 leading-snug mt-1">
                  {d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 10. VISION & IMPACT (4:46 – 5:00 | 14 сек) ---------- */
function Slide10({ onOpenDemo }) {
  return (
    <div className="h-full px-24 py-16 flex flex-col justify-between bg-slate-50">
      <Title eyebrow="10 · Vision & Bigger Future">
        От умных почтовых ящиков — к{" "}
        <span className="px-4 rounded-2xl" style={{ background: Y }}>
          единой IoT-сети городской логистики
        </span>
      </Title>
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-9">
          <Globe className="w-14 h-14 text-emerald-600 mb-5" />
          <div className="text-[34px] font-black" style={{ color: INK }}>
            Масштаб Балтии
          </div>
          <p className="text-[24px] text-slate-600 mt-3 leading-snug">
            После 547 ящиков в Латвии платформа масштабируется на почтовые сети
            Литвы и Эстонии по единому стандарту.
          </p>
        </div>
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-9">
          <Layers className="w-14 h-14 text-emerald-600 mb-5" />
          <div className="text-[34px] font-black" style={{ color: INK }}>
            Синергия с посылками
          </div>
          <p className="text-[24px] text-slate-600 mt-3 leading-snug">
            Бумажные письма падают (−25%), а посылки растут: освободившиеся часы
            курьеров направляются на доставку посылок.
          </p>
        </div>
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-9">
          <BarChart3 className="w-14 h-14 text-emerald-600 mb-5" />
          <div className="text-[34px] font-black" style={{ color: INK }}>
            Зелёный стандарт EU
          </div>
          <p className="text-[24px] text-slate-600 mt-3 leading-snug">
            Прозрачная отчётность по снижению пробега и выбросов CO₂ для
            государственных и муниципальных программ.
          </p>
        </div>
      </div>

      <div
        className="rounded-3xl px-12 py-8 flex items-center justify-between"
        style={{ background: INK }}
      >
        <div className="text-[42px] font-black text-white">
          EmptyLess: не возим воздух.{" "}
          <span style={{ color: Y }}>Едем только туда, где нас ждут.</span>
        </div>
        <button
          onClick={onOpenDemo}
          className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-2xl font-black cursor-pointer"
          style={{ background: Y, color: INK }}
        >
          <Play className="w-6 h-6 fill-current" /> Демо
        </button>
      </div>
    </div>
  );
}

const SLIDES = [
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
];

export default function PitchDeck({ onOpenDemo }) {
  const [i, setI] = useState(0);
  const [scale, setScale] = useState(1);
  const last = SLIDES.length - 1;

  useEffect(() => {
    try {
      const saved = parseInt(sessionStorage.getItem(STORAGE_KEY) ?? "", 10);
      if (saved >= 0 && saved <= last) setI(saved);
    } catch {}
  }, [last]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, String(i));
    } catch {}
  }, [i]);

  useEffect(() => {
    const fit = () =>
      setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const next = useCallback(() => setI((v) => Math.min(v + 1, last)), [last]);
  const prev = useCallback(() => setI((v) => Math.max(v - 1, 0)), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key.toLowerCase() === "d") onOpenDemo?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onOpenDemo]);

  const Current = SLIDES[i];

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
      <div
        className="relative shrink-0 overflow-hidden"
        style={{ width: 1920, height: 1080, transform: `scale(${scale})` }}
      >
        <Current onOpenDemo={onOpenDemo} />
        <div className="absolute bottom-6 right-8 rounded-full px-5 py-2 text-2xl font-black bg-black/40 text-white/90 backdrop-blur">
          {i + 1} / {SLIDES.length}
        </div>
      </div>
    </div>
  );
}
