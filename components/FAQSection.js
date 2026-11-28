"use client";

import { useState } from "react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question:
        "Can the sensors detect vandalism, fire, or water damage inside the box?",
      answer:
        "In short, no. A local microcontroller checks sensor states upon activation to spot faults, and LoRa heartbeats can monitor uptime. To deter vandalism, we plan to use security screws, solid mounting, silicone sealing, and nearby cameras where available.",
    },
    {
      question:
        "How hard is it to integrate EmptyLess with Latvijas Pasts' legacy IT systems?",
      answer:
        "We do not know the exact details of Latvijas Pasts' IT stack yet. We already have a backend structure ready and plan to launch as a standalone app first, then discuss deeper system integration.",
    },
    {
      question:
        "What are the main technical or operational risks of the project, and how are we addressing them?",
      answer:
        "The biggest risk is vandalism, since any serviceable electronics enclosure remains a physical target. We address this with security screws, sturdy mounting, and cameras, while handling temperature swings through proper component selection and extra protection.",
    },
    {
      question: "How will the project become self-sustaining?",
      answer:
        "Through proven, measurable savings in fuel, time, and fleet wear. Once cost efficiency is clear for postal operations, similar tech can scale to comparable logistics or private households.",
    },
    {
      question:
        "What happens if a postbox has only 1 letter for a week? Won't that violate postal delivery SLAs?",
      answer:
        "Tracking fill levels does not mean ignoring low-volume boxes. EmptyLess prioritizes overflowing boxes while keeping regular pickups on track so delivery rules and SLAs are still met.",
    },
    {
      question: "What is the main milestone we plan to show in 6 to 12 months?",
      answer:
        "A reliable, integration-ready system with a working app and backend that handles outdoor heat, cold, and weather. It will measure weight and distance, estimate fill levels, send telemetry to the app, and optimize pickup routes.",
    },
    {
      question:
        "How does the sensor distinguish between a truly full box and a single flat envelope blocking the beam?",
      answer:
        "Our algorithm compares current and previous weight readings. If the top sensor triggers a full alert with an unusually small weight change, the app flags a likely stuck or flat item.",
    },
  ];

  // SEO Microdata Schema.org (FAQPage)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50">
      {/* Внедрение SEO-скрипта Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-headline text-sm font-bold uppercase tracking-wider text-[#0b9b70] mb-2 block">
            FAQ
          </span>
          <h2 className="font-headline font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mb-4">
            Common Questions
          </h2>
          <p className="font-body text-slate-600 text-base sm:text-lg">
            Everything you need to know about EmptyLess, installation, and
            network performance.
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* Кликабельная шапка на всю ширину */}
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left font-headline font-bold text-lg text-slate-900 hover:text-[#0b9b70] transition-colors cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isOpen
                        ? "bg-[#0b9b70]/10 text-[#0b9b70]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`font-mono text-xl font-bold transition-transform duration-300 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </span>
                </button>

                {/* Плавный контейнер с ограниченной высотой */}
                <div
                  className={`grid transition-[grid-template-rows,padding] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr] pb-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-body text-slate-600 text-sm sm:text-base leading-relaxed px-6 pt-2 border-t border-slate-100">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
