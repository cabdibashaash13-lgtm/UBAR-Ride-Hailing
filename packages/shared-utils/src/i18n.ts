import en from "./locales/en.json";
import so from "./locales/so.json";

export type Language = "en" | "so";

const translations: Record<Language, Record<string, unknown>> = { en, so };

export function t(key: string, lang: Language = "en"): string {
  const keys = key.split(".");
  let value: unknown = translations[lang];

  for (const k of keys) {
    if (value && typeof value === "object" && k in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}

export function tWithParams(
  key: string,
  params: Record<string, string | number>,
  lang: Language = "en"
): string {
  let text = t(key, lang);
  for (const [paramKey, paramValue] of Object.entries(params)) {
    text = text.replace(`{${paramKey}}`, String(paramValue));
  }
  return text;
}

export { en, so };
