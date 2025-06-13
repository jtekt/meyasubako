import * as i18n from "@solid-primitives/i18n";
import { createSignal, createMemo } from "solid-js";
import { RiEditorTranslate2 } from "solid-icons/ri";
import ja from "../locales/ja.json";
import en from "../locales/en.json";

const dictionaries = { en, ja };

export type Locale = "en" | "ja";

export let t: any;

export default () => {
  const initialLocale = (localStorage.getItem("locale") as Locale) || "ja";

  const [locale, setLocale] = createSignal<Locale>(initialLocale);

  const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));

  t = i18n.translator(dict);

  function updateLocale(newLocale: Locale) {
    localStorage.setItem("locale", newLocale);
    setLocale(newLocale);
  }

  return (
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        <RiEditorTranslate2 />
        <span>{locale()}</span>
      </div>
      <ul
        tabindex="0"
        class="p-2 shadow menu dropdown-content z-[1] rounded-box bg-black"
      >
        {Object.keys(dictionaries).map((l) => (
          <li>
            <button
              onClick={() => updateLocale(l as Locale)}
              class="btn btn-ghost btn-circle"
            >
              {l}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
