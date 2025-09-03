import { useSubmission } from "@solidjs/router";
import { registerItem } from "~/lib/items";

import { FaSolidPlus, FaSolidCircleXmark, FaSolidCheck } from "solid-icons/fa";
import { t } from "~/i18n";
import { Show, For } from "solid-js";
import { INPUT_EXPLANATION_EN, INPUT_EXPLANATION_JA } from "~/lib/config";
import InputExplanation from "./InputExplanation";

type Props = {
  type?: "comment" | "item";
  parent_id?: number | string | null;
};

export default ({ parent_id, type = "item" }: Props) => {
  const submission = useSubmission(registerItem);

  // Helper to get flagged category names
  const getFlaggedCategories = () => {
    if (!submission.result?.categories) return [];
    return Object.keys(submission.result.categories) as Array<
      keyof typeof submission.result.categories
    >;
  };

  return (
    <div class="card bg-base-100 shadow-xl my-4">
      <div class="card-body">
        <h2 class="card-title">
          {t(type === "comment" ? "newComment" : "newItem")}
        </h2>

        <Show when={type === "item"}>
          <InputExplanation />
        </Show>

        {/* Error Display with flagged categories */}
        <Show when={submission.result?.error}>
          <div class="alert alert-error mb-4">
            <FaSolidCircleXmark size={24} />
            <div>
              <div class="font-bold">{t("contentModerated")}</div>
              <Show when={getFlaggedCategories().length > 0}>
                <div class="text-sm mt-2">
                  <div class="mb-1">{t("flaggedCategories")}:</div>
                  <ul class="list-disc list-inside ml-2">
                    <For each={getFlaggedCategories()}>
                      {(category) => <li>{t(`moderation.${category}`)}</li>}
                    </For>
                  </ul>
                </div>
              </Show>
            </div>
          </div>
        </Show>

        {/* Success Display */}
        <Show when={submission.result && !submission.result.error}>
          <div class="alert alert-success mb-4">
            <FaSolidCheck size={24} />
            <span>{t(type === "comment" ? "commentAdded" : "itemAdded")}</span>
          </div>
        </Show>

        <form action={registerItem} method="post" class="flex gap-2 my-2">
          <input type="hidden" name="parent_id" value={parent_id || ""} />
          <div class="form-control w-full">
            <textarea
              name="content"
              class="textarea textarea-bordered w-full"
              classList={{
                "textarea-error": submission.result?.error,
              }}
              rows="1"
              placeholder={t("content")}
              required
            />
            <Show when={submission.result?.error}>
              <label class="label">
                <span class="label-text-alt text-error">
                  {t("pleaseReviseContent")}
                </span>
              </label>
            </Show>
          </div>
          <button
            class="btn btn-primary"
            type="submit"
            disabled={submission.pending}
          >
            <Show when={submission.pending}>
              <span class="loading loading-spinner" />
            </Show>
            <Show when={!submission.pending}>
              <FaSolidPlus size={24} />
            </Show>
          </button>
        </form>
      </div>
    </div>
  );
};
