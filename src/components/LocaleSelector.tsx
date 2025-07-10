import * as i18n from "@solid-primitives/i18n";
import { RiEditorTranslate2 } from "solid-icons/ri";
import { createResource, createSignal, onMount } from "solid-js";
import type * as en from "~/i18n/en";
import { z } from "zod";

const locales = ["en", "ja"] as const;

const validLocales = z.union(locales.map((l) => z.literal(l)));

export type Locale = (typeof locales)[number];
export type RawDictionary = typeof en.dict;
export type Dictionary = i18n.Flatten<RawDictionary>;

export async function fetchDictionary(locale: Locale): Promise<Dictionary> {
  const dict: RawDictionary = (await import(`../i18n/${locale}.ts`)).dict;
  return i18n.flatten(dict); // flatten the dictionary to make all nested keys available top-level
}

// TODO: not sure if this is the right approach
export let t: any;

export default () => {
  const [locale, setLocale] = createSignal<Locale>("en");

  const [dict] = createResource(locale, fetchDictionary);

  t = i18n.translator(dict);

  function setAndSaveLocale(newLocale: Locale) {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  }

  onMount(() => {
    const storedLocale = localStorage.getItem("locale");
    if (!storedLocale) return;
    const newLocale = validLocales.parse(storedLocale);
    setLocale(newLocale);
  });

  return (
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        <RiEditorTranslate2 size={24} />
        {/* <span>{locale()}</span> */}
      </div>
      <ul
        tabindex="0"
        class="p-2 shadow menu dropdown-content z-[1] rounded-box bg-black"
      >
        <li>
          <button onClick={() => setAndSaveLocale("en")}>English</button>
        </li>
        <li>
          <button onClick={() => setAndSaveLocale("ja")}>日本語</button>
        </li>
      </ul>
    </div>
  );
};
