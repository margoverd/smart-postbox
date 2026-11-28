"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import dynamic from "next/dynamic";
import { INITIAL_BOXES, getBoxStatus } from "@/data/initialBoxes";
import {
  Route,
  RotateCcw,
  MapPin,
  Fuel,
  CloudRain,
  Clock,
  Shuffle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const HeroLeafletMap = dynamic(() => import("./HeroLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
  ),
});

/* ───────── Допущения расчёта (одно место правды) ───────── */
const FUEL_L_PER_KM = 0.1; // 10 L / 100 km
const FUEL_PRICE = 1.65; // € за литр дизеля
const CO2_PER_KM = 0.23; // кг CO₂ на км
const LABOR_PER_HOUR = 14; // € / час работы курьера (Латвия)
const AVG_SPEED_KMH = 30; // средняя городская скорость
const MIN_PER_STOP = 2; // минут на остановку
const WORK_DAYS = 260; // рабочих дней в году

const TIP_TRADITIONAL =
  "Based on €1.65/L diesel, 10 L/100 km average consumption and €14/hr courier labor cost in Latvia. The van visits every box, every day (≈30 km/h city speed, 2 min per stop).";
const TIP_SMART =
  "Same assumptions, but the van visits only boxes that are full (>80%). Cost = fuel + driver time.";

/* ───────── Плавная смена чисел ───────── */
function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 600,
  className = "",
}) {
  const safe = Number.isFinite(value) ? value : 0;
  const [display, setDisplay] = useState(safe);
  const fromRef = useRef(safe);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === safe) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const total = reduced ? 0 : duration;
    const start = performance.now();

    const tick = (now) => {
      const t = total === 0 ? 1 : Math.min(1, (now - start) / total);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = from + (safe - from) * eased;
      fromRef.current = current;
      setDisplay(current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [safe, duration]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ───────── Иконка (i) с подсказкой ───────── */
function InfoTip({ label, text, tone = "slate" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const pointerRef = useRef("");
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span
      ref={wrapRef}
      className="inline-flex"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onPointerDown={(e) => (pointerRef.current = e.pointerType)}
        onClick={() => {
          if (pointerRef.current === "mouse") return;
          setOpen((o) => !o);
        }}
        className={`ml-1.5 -my-0.5 p-0.5 rounded-full transition-colors cursor-pointer ${
          tone === "emerald"
            ? "text-emerald-600/70 hover:text-emerald-700"
            : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      <span
        id={id}
        role="tooltip"
        className={`absolute left-0 right-0 top-full mt-2 z-30 rounded-lg bg-slate-900 px-3 py-2.5 text-[11px] font-medium normal-case tracking-normal leading-snug text-white shadow-xl transition-all duration-200 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        {text}
      </span>
    </span>
  );
}

function MetricCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-200/70 text-center transition-all duration-300">
      <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
        <Icon className="w-3 h-3 text-slate-400" /> {label}
      </div>
      <div className="text-sm font-black text-emerald-600 mt-1">{value}</div>
      <div className="text-[10px] text-rose-500 font-medium mt-0.5">{sub}</div>
    </div>
  );
}

function randomizeBoxes(list) {
  const fullShare = 0.15 + Math.random() * 0.2;
  const mediumShare = 0.15 + Math.random() * 0.1;

  const next = list.map((b) => {
    const r = Math.random();
    if (r < fullShare) return { ...b, weight: b.max };
    if (r < fullShare + mediumShare)
      return {
        ...b,
        weight: Math.round(b.max * (0.76 + Math.random() * 0.03)),
      };
    return { ...b, weight: Math.round(b.max * (0.03 + Math.random() * 0.35)) };
  });

  const missing = 3 - next.filter((b) => getBoxStatus(b) === "full").length;
  if (missing > 0) {
    const candidates = next
      .map((b, i) => ({ b, i }))
      .filter(({ b }) => getBoxStatus(b) !== "full")
      .sort(() => Math.random() - 0.5)
      .slice(0, missing);
    candidates.forEach(
      ({ i }) => (next[i] = { ...next[i], weight: next[i].max }),
    );
  }
  return next;
}

const pctDrop = (from, to) =>
  from > 0 ? Math.max(0, Math.round(((from - to) / from) * 100)) : 0;

export default function InteractiveMailGridPreview() {
  const initialBoxes = useMemo(() => INITIAL_BOXES.slice(0, 30), []);

  // Начальное состояние детерминировано для SSR/prerender, а рандомный день
  // запускается в useEffect уже на клиенте.
  const [boxes, setBoxes] = useState(initialBoxes);
  const [routeBuilt, setRouteBuilt] = useState(false);
  const [dist, setDist] = useState({ base: 38.7, smart: 13.1 });
  const [fleetRoutes, setFleetRoutes] = useState(50);
  const [spin, setSpin] = useState(0);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  useEffect(() => {
    setBoxes(randomizeBoxes(initialBoxes));
    setRouteBuilt(true);
  }, [initialBoxes]);

  const fullBoxes = useMemo(
    () =>
      boxes
        .filter((b) => getBoxStatus(b) === "full")
        .sort((a, b) => a.lng - b.lng),
    [boxes],
  );

  const handleDistances = useCallback((base, smart) => {
    if (!Number.isFinite(base) || !Number.isFinite(smart)) return;
    setDist((prev) =>
      prev.base === base && prev.smart === smart ? prev : { base, smart },
    );
  }, []);

  const handleToggleRoute = () => {
    if (routeBuilt) {
      setRouteBuilt(false);
      setBoxes(initialBoxes);
    } else {
      setRouteBuilt(true);
    }
  };

  const handleRandomDay = () => {
    setSpin((s) => s + 1);
    setBoxes((prev) => randomizeBoxes(prev));
    setRouteBuilt(true);
  };

  const baseStops = boxes.length;
  const smartStops = fullBoxes.length;

  const baseMin = (dist.base / AVG_SPEED_KMH) * 60 + baseStops * MIN_PER_STOP;
  const smartMin =
    (dist.smart / AVG_SPEED_KMH) * 60 + smartStops * MIN_PER_STOP;

  const baseFuel = dist.base * FUEL_L_PER_KM * FUEL_PRICE;
  const smartFuel = dist.smart * FUEL_L_PER_KM * FUEL_PRICE;

  const baseCost = baseFuel + (baseMin / 60) * LABOR_PER_HOUR;
  const smartCost = smartFuel + (smartMin / 60) * LABOR_PER_HOUR;

  const baseCo2 = dist.base * CO2_PER_KM;
  const smartCo2 = dist.smart * CO2_PER_KM;

  const savedMin = Math.max(0, Math.round(baseMin - smartMin));
  const savedCost = Math.max(0, baseCost - smartCost);
  const savedCo2 = Math.max(0, baseCo2 - smartCo2);

  const routeDays = fleetRoutes * WORK_DAYS;
  const annualSavings = Math.round(savedCost * routeDays);
  const annualCo2Tons = (savedCo2 * routeDays) / 1000;
  const annualHours = Math.round((savedMin / 60) * routeDays);
  const sliderFill = ((fleetRoutes - 10) / 490) * 100;

  const emptyPct = boxes.length
    ? Math.round(
        (boxes.filter((b) => getBoxStatus(b) === "normal").length /
          boxes.length) *
          100,
      )
    : 0;

  return (
    <div className="lg:col-span-12 w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-xl shadow-slate-900/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 flex flex-col">
            <HeroLeafletMap
              boxes={boxes}
              routePoints={fullBoxes}
              routeActive={routeBuilt}
              onDistancesCalculated={handleDistances}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide uppercase">
                  Live Simulation
                </div>
                <h3 className="text-4xl font-black tracking-tight text-slate-900">
                  <AnimatedNumber value={emptyPct} suffix="%" /> of your stops
                  are completely empty!
                </h3>
                <p className="text-sm text-slate-500">
                  Blind daily routes waste up to two-thirds of fleet mileage.
                  Switch to demand-driven pickup in one click.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Traditional Route
                    <InfoTip
                      label="How the traditional route cost is calculated"
                      text={TIP_TRADITIONAL}
                    />
                  </div>
                  <div className="my-2">
                    <AnimatedNumber
                      value={baseCost}
                      decimals={2}
                      prefix="€"
                      className="text-2xl md:text-3xl font-black text-slate-700"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Fixed schedule (All boxes)
                  </div>
                </div>

                <div className="relative bg-emerald-50/70 rounded-xl p-4 border border-emerald-200/80 flex flex-col justify-between">
                  {routeBuilt && (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap z-10">
                      <AnimatedNumber
                        value={pctDrop(baseCost, smartCost)}
                        suffix="% CHEAPER"
                      />
                    </span>
                  )}
                  <div className="flex items-center text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Emptyless
                    <InfoTip
                      label="How the Emptyless route cost is calculated"
                      text={TIP_SMART}
                      tone="emerald"
                    />
                  </div>
                  <div className="my-2">
                    {routeBuilt ? (
                      <AnimatedNumber
                        value={smartCost}
                        decimals={2}
                        prefix="€"
                        className="text-2xl md:text-3xl font-black text-emerald-700"
                      />
                    ) : (
                      <span className="text-2xl md:text-3xl font-black text-emerald-700">
                        €—
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-emerald-700/80 font-medium">
                    Demand-driven ({fullBoxes.length} stops)
                  </div>
                </div>
              </div>

              {/* Collapsible Route Breakdown Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsBreakdownOpen((prev) => !prev)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>
                    {isBreakdownOpen
                      ? "Hide route breakdown"
                      : "View route breakdown"}
                  </span>
                  {isBreakdownOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>

              {/* Collapsible 4 Metric Cards Grid */}
              <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                  isBreakdownOpen
                    ? "grid-rows-[1fr] opacity-100 py-1"
                    : "grid-rows-[0fr] opacity-0 py-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <MetricCard
                      icon={MapPin}
                      label="Distance"
                      value={
                        <AnimatedNumber
                          value={routeBuilt ? dist.smart : dist.base}
                          decimals={1}
                          suffix=" km"
                        />
                      }
                      sub={`Was: ${
                        routeBuilt ? dist.base.toFixed(1) : dist.base.toFixed(1)
                      } km`}
                    />

                    <MetricCard
                      icon={Fuel}
                      label="Fuel Cost"
                      value={
                        <AnimatedNumber
                          value={routeBuilt ? smartFuel : baseFuel}
                          decimals={2}
                          prefix="€"
                        />
                      }
                      sub={`Was: €${
                        routeBuilt ? baseFuel.toFixed(2) : baseFuel.toFixed(2)
                      }`}
                    />

                    <MetricCard
                      icon={CloudRain}
                      label="CO₂"
                      value={
                        <AnimatedNumber
                          value={routeBuilt ? smartCo2 : baseCo2}
                          decimals={1}
                          suffix=" kg"
                        />
                      }
                      sub={`Was: ${
                        routeBuilt ? baseCo2.toFixed(1) : baseCo2.toFixed(1)
                      } kg`}
                    />

                    <MetricCard
                      icon={Clock}
                      label="Route Time"
                      value={
                        <AnimatedNumber
                          value={
                            routeBuilt
                              ? Math.round(smartMin)
                              : Math.round(baseMin)
                          }
                          suffix=" min"
                        />
                      }
                      sub={`Was: ${Math.round(baseMin)} min`}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="fleet-scale"
                    className="text-xs font-bold text-slate-700"
                  >
                    Scale to your fleet:{" "}
                    <span className="text-emerald-700 tabular-nums">
                      {fleetRoutes}
                    </span>{" "}
                    daily routes
                  </label>
                </div>

                <input
                  id="fleet-scale"
                  type="range"
                  min={10}
                  max={500}
                  step={5}
                  value={fleetRoutes}
                  onChange={(e) => setFleetRoutes(Number(e.target.value))}
                  aria-valuetext={`${fleetRoutes} daily routes`}
                  style={{
                    background: `linear-gradient(to right, #059669 ${sliderFill}%, #e2e8f0 ${sliderFill}%)`,
                  }}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-emerald-600 [&::-moz-range-thumb]:shadow-md
                    focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
                />
                <div className="flex justify-between text-[10px] font-medium text-slate-400 -mt-1">
                  <span>10</span>
                  <span>500</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="col-span-full sm:col-span-1 rounded-lg bg-emerald-50/70 border border-emerald-200/70 px-3 py-2.5">
                    <div className="text-xl sm:text-2xl font-bold tabular-nums text-emerald-700 leading-none">
                      <AnimatedNumber
                        value={annualSavings}
                        prefix="€"
                        duration={450}
                      />
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-800/80 mt-1.5 leading-tight">
                      Annual savings
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:contents gap-2">
                    <div className="rounded-lg bg-slate-50 border border-slate-200/70 px-3 py-2.5">
                      <div className="text-xl sm:text-2xl font-bold tabular-nums text-slate-800 leading-none">
                        <AnimatedNumber
                          value={annualCo2Tons}
                          decimals={1}
                          suffix=" t"
                          duration={450}
                        />
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-1.5 leading-tight">
                        Annual CO₂ reduction
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200/70 px-3 py-2.5">
                      <div className="text-xl sm:text-2xl font-bold tabular-nums text-slate-800 leading-none">
                        <AnimatedNumber
                          value={annualHours}
                          suffix=" h"
                          duration={450}
                        />
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mt-1.5 leading-tight">
                        Driver hours saved
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-medium leading-snug">
                  = this route&apos;s savings (€{savedCost.toFixed(2)}) ×{" "}
                  {fleetRoutes} routes × {WORK_DAYS} working days
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-col gap-2.5">
              <button
                onClick={handleToggleRoute}
                className={`w-full h-12 flex items-center justify-center gap-2 font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md active:scale-[0.99] ${
                  routeBuilt
                    ? "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-slate-900/5"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 animate-pulse"
                }`}
              >
                {routeBuilt ? (
                  <>
                    <RotateCcw className="w-4 h-4" /> Reset Simulation
                  </>
                ) : (
                  <>
                    <Route className="w-4 h-4" /> Build Smart Route
                  </>
                )}
              </button>

              <button
                onClick={handleRandomDay}
                className={`w-full h-12 px-5 flex items-center justify-center gap-2 font-bold text-sm rounded-xl transition-all cursor-pointer active:scale-[0.99] border ${
                  routeBuilt
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-md shadow-emerald-600/25"
                    : "bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300"
                }`}
              >
                <Shuffle
                  className="w-4 h-4 transition-transform duration-500 ease-out"
                  style={{ transform: `rotate(${spin * 180}deg)` }}
                />
                Simulate Random Day
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
