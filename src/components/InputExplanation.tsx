import { createAsync } from "@solidjs/router";

import { locale } from "~/i18n";
import { Show } from "solid-js";
import { getExplanationQuery } from "~/lib/explanation";

export default () => {
  const getExplanation = createAsync(() => getExplanationQuery());

  const getTransaltedExplanation = () => {
    const explanation = getExplanation();
    if (!explanation) return null;
    return explanation[locale()];
  };

  return (
    <div>
      <Show when={getTransaltedExplanation()}>
        {getTransaltedExplanation()}
      </Show>
    </div>
  );
};
