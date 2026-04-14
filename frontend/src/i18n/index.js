import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./translations/en.json";
import hi from "./translations/hi.json";
import te from "./translations/te.json";
import ta from "./translations/ta.json";
import pa from "./translations/pa.json";
import ml from "./translations/ml.json";
import mr from "./translations/mr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
      ta: { translation: ta },
      pa: { translation: pa },
      ml: { translation: ml },
      mr: { translation: mr },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "appLanguage",
    },
  });

export default i18n;
