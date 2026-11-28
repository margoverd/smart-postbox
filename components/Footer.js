"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B0F17] text-slate-300 py-12 border-t border-slate-800/60 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* 1. Логотип и описание под ним */}
          <div className="flex flex-col items-center md:items-start gap-3 max-w-sm text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shadow-sm shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M4 8.5 12 4l8 4.5v8L12 21l-8-4.5z" />
                  <path d="M4.5 8.7 12 13l7.5-4.3M12 13v7.5M8 6.2l8 4.6" />
                </svg>
              </div>
              <span className="font-black tracking-tight text-xl text-white">
                Empty<span className="text-emerald-500">Less</span>
              </span>
            </div>

            {/* Короткое описание под логотипом */}
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Intelligent IoT routing platform for postal networks, replacing
              blind schedules with real-time fill telemetry.
            </p>
          </div>

          {/* 2. Навигация, почта и «Made with love» */}
          <div className="flex flex-col items-center md:items-end gap-3 pt-2">
            {/* Якорные ссылки */}
            <nav
              aria-label="Footer Navigation"
              className="flex flex-wrap justify-center md:justify-end gap-5 text-sm font-semibold text-slate-300"
            >
              <Link href="#demo" className="hover:text-emerald-400 transition">
                Live Simulation
              </Link>
              <Link
                href="#problem"
                className="hover:text-emerald-400 transition"
              >
                Problem & Solution
              </Link>
              <Link
                href="#how-it-works"
                className="hover:text-emerald-400 transition"
              >
                How It Works
              </Link>
              <Link
                href="#platform"
                className="hover:text-emerald-400 transition"
              >
                Platform
              </Link>
              <Link
                href="/dashboard"
                className="text-emerald-400 hover:text-emerald-300 transition"
              >
                Live Dashboard →
              </Link>
            </nav>

            <a
              href="mailto:emptylessteam@gmail.com"
              className="mt-1 inline-flex items-center gap-2.5 rounded-xl bg-[#101724] hover:bg-[#152032] border border-slate-700/70 hover:border-emerald-500/40 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 shadow-xs"
            >
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Contact Us</span>
            </a>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <span>Made with</span>
              <span className="text-red-500 inline-block animate-pulse">
                ❤️
              </span>
              <span>by the EmptyLess Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
