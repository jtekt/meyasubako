import * as i18n from "@solid-primitives/i18n";
import { createMemo, createSignal } from "solid-js";
import * as en from "~/i18n/en";
import * as ja from "~/i18n/ja";

import { z } from "zod";

const dictionaries = {
  en: en.dict,
  ja: ja.dict,
};

const locales = ["en", "ja"] as const;

export const validLocales = z.union(locales.map((l) => z.literal(l)));

export type Locale = (typeof locales)[number];
export type RawDictionary = typeof en.dict;
export type Dictionary = i18n.Flatten<RawDictionary>;

export const [locale, setLocale] = createSignal<Locale>("en");

const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));

export const t = i18n.translator(dict);
