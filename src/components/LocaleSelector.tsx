import * as i18n from "@solid-primitives/i18n";
import { createResource, createSignal } from "solid-js";
import type * as en from "~/i18n/en";

// import type * as ja from "./ja.js";
// import { createSignal } from "solid-js/types/server/reactive.js";
// import { createResource } from "solid-js/types/server/rendering.js";

export type Locale = "en" | "ja";
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

  // function updateLocale(newLocale: Locale) {
  //   localStorage.setItem("locale", newLocale);
  //   setLocale(newLocale);
  // }

  return (
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        {/* <RiEditorTranslate2 /> */}
        <span>{locale()}</span>
      </div>
      <ul
        tabindex="0"
        class="p-2 shadow menu dropdown-content z-[1] rounded-box bg-black"
      >
        <li>
          <button onClick={() => setLocale("en")}>EN</button>
        </li>
        <li>
          <button onClick={() => setLocale("ja")}>JA</button>
        </li>
      </ul>
    </div>
  );
};
