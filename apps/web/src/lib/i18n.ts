import en from "@/messages/en.json";
import hi from "@/messages/hi.json";

const catalogs = { en, hi } as const;

export type Locale = keyof typeof catalogs;

export function getMessages(locale: string) {
  const l = locale === "hi" ? "hi" : "en";
  return catalogs[l];
}
