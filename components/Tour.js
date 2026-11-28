/**
 * Онбординг-тур из 7 шагов (закон Миллера): подсвечивает нужный элемент,
 * одно короткое предложение на шаг, сам переключает роль курьер → диспетчер.
 * Элементы находятся по атрибуту data-tour="...".
 */
"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    role: "courier",
    target: null,
    title: "Welcome to EmptyLess",
    text: "Smart postboxes tell us when they are full. Couriers drive only to full ones. Take a 30-second look?",
  },
  {
    role: "courier",
    target: "courier-verdict",
    title: "What to collect",
    text: "The courier sees one number: how many postboxes are full right now.",
  },
  {
    role: "courier",
    target: "demo",
    title: "Try it",
    text: "Press this button. A postbox fills up and turns red.",
  },
  {
    role: "courier",
    target: "route",
    title: "Get the route",
    text: "One tap builds the shortest road route to full postboxes only.",
  },
  {
    role: "courier",
    target: "role-tabs",
    title: "Two views, one system",
    text: "Tap a red postbox, then press “Mark as collected”. Next, we switch to the Dispatcher.",
  },
  {
    role: "dispatcher",
    target: "dispatch-verdict",
    title: "The dispatcher sees it too",
    text: "Same answer at a glance. This number goes down when the courier collects.",
  },
  {
    role: "dispatcher",
    target: "alerts",
    title: "Every pickup, instantly",
    text: "Full postboxes, low batteries and confirmed pickups appear here live.",
  },
];

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function Tour({ open, onClose, onRoleChange }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const nextRef = useRef(null);

  const s = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  const finish = () => {
    setStep(0);
    setRect(null);
    onClose();
  };

  // Вход в шаг: переключаем роль, прокручиваем к элементу и следим за его позицией
  useEffect(() => {
    if (!open) return;
    onRoleChange(s.role);
    if (!s.target) {
      const t = setTimeout(() => setRect(null), 0);
      return () => clearTimeout(t);
    }

    const find = () => document.querySelector(`[data-tour="${s.target}"]`);
    const isMobile = window.innerWidth < 768;

    const scrollTimer = setTimeout(() => {
      find()?.scrollIntoView({
        behavior: "smooth",
        block: isMobile ? "start" : "center",
      });
    }, 120);

    const measure = () => {
      const el = find();
      if (!el) return setRect(null);
      const r = el.getBoundingClientRect();
      setRect((prev) =>
        prev &&
        Math.abs(prev.top - r.top) < 1 &&
        Math.abs(prev.left - r.left) < 1 &&
        Math.abs(prev.width - r.width) < 1 &&
        Math.abs(prev.height - r.height) < 1
          ? prev
          : {
              top: r.top,
              left: r.left,
              width: r.width,
              height: r.height,
              right: r.right,
              bottom: r.bottom,
            },
      );
    };
    const interval = setInterval(measure, 120);
    const first = setTimeout(measure, 160);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(first);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  // Клавиатура: Esc — закрыть, стрелки — шаги
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight")
        isLast ? finish() : setStep((n) => Math.min(n + 1, STEPS.length - 1));
      if (e.key === "ArrowLeft") setStep((n) => Math.max(n - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isLast]);

  useEffect(() => {
    if (open) nextRef.current?.focus();
  }, [open, step]);

  if (!open) return null;

  // ───────── Позиция карточки ─────────
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cardW = Math.min(360, vw - 32);
  const cardH = 230;
  const gap = 14;
  let cardStyle;

  if (!rect) {
    cardStyle = {
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: cardW,
    };
  } else if (vw < 768) {
    cardStyle = { left: 16, right: 16, bottom: 16 };
  } else if (rect.bottom + gap + cardH < vh) {
    cardStyle = {
      top: rect.bottom + gap,
      left: clamp(rect.left, 16, vw - cardW - 16),
      width: cardW,
    };
  } else if (rect.top - gap - cardH > 0) {
    cardStyle = {
      top: rect.top - gap - cardH,
      left: clamp(rect.left, 16, vw - cardW - 16),
      width: cardW,
    };
  } else if (rect.left - gap - cardW > 0) {
    cardStyle = {
      top: clamp(rect.top, 16, vh - cardH - 16),
      left: rect.left - gap - cardW,
      width: cardW,
    };
  } else {
    cardStyle = {
      left: "50%",
      bottom: 16,
      transform: "translateX(-50%)",
      width: cardW,
    };
  }

  const pad = 8;

  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 1500 }}
      role="dialog"
      aria-modal="true"
      aria-label="MailGrid tour"
    >
      {/* Затемнение с «окном» вокруг нужного элемента */}
      {rect ? (
        <div
          className="absolute rounded-2xl pointer-events-none transition-all duration-300 motion-reduce:transition-none ring-2 ring-emerald-400"
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.62)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900/60" />
      )}

      <div
        className="absolute bg-white rounded-2xl shadow-2xl p-5 border border-slate-200"
        style={cardStyle}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-6 bg-emerald-600" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-500">
            {step + 1} of {STEPS.length}
          </span>
        </div>

        <h2 className="text-xl font-black tracking-tight mt-4">{s.title}</h2>
        <p className="text-base text-slate-600 mt-1.5 leading-snug">{s.text}</p>

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={finish}
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 px-2 py-2 cursor-pointer"
          >
            Skip
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={() => setStep((n) => n - 1)}
                className="text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              ref={nextRef}
              onClick={() => (isLast ? finish() : setStep((n) => n + 1))}
              className="text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl cursor-pointer"
            >
              {isFirst ? "Start tour" : isLast ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
