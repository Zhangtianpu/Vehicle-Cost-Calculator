import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function FAQPage() {
  const { t } = useLanguageStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: t.faq.q1,
      answer: t.faq.a1,
    },
    {
      question: t.faq.q2,
      answer: t.faq.a2,
    },
    {
      question: t.faq.q3,
      answer: t.faq.a3,
    },
    {
      question: t.faq.q4,
      answer: t.faq.a4,
    },
    {
      question: t.faq.q5,
      answer: t.faq.a5,
    },
    {
      question: t.faq.q6,
      answer: t.faq.a6,
    },
    {
      question: t.faq.q7,
      answer: t.faq.a7,
    },
    {
      question: t.faq.q8,
      answer: t.faq.a8,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <HelpCircle className="w-8 h-8 text-emerald-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t.faq.title}</h1>
          <p className="text-slate-500">{t.faq.subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-emerald-50 rounded-xl p-6 border border-emerald-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">{t.faq.moreHelp}</h2>
        <p className="text-slate-600 text-sm">
          {t.faq.moreHelpDesc}
        </p>
      </div>
    </div>
  );
}