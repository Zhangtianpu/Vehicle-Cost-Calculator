import { create } from "zustand";
import type { Locale, TranslationKey } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

interface LanguageState {
  locale: Locale;
  t: TranslationKey;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: "zh",
  t: translations.zh,
  setLocale: (locale) =>
    set({
      locale,
      t: translations[locale],
    }),
}));
