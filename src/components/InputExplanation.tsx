import { createAsync } from "@solidjs/router";

import { locale } from "~/i18n";
import { Show } from "solid-js";
import { getExplanation } from "~/lib/explanation";

export default () => {
  const explanation = createAsync(() => getExplanation());

  return (
    <div>
      <Show when={explanation()}>{explanation()[locale()]}</Show>
    </div>
  );
};
