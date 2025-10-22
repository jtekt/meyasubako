import { RiEditorTranslate2 } from "solid-icons/ri";
import { onMount } from "solid-js";

import { Locale, setLocale, validLocales } from "~/i18n";

export default () => {
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
    <div class="dropdown dropdown-end">
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
