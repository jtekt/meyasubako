import { useSubmission } from "@solidjs/router";
import { registerItem } from "~/lib/items";
import { FaSolidPlus } from "solid-icons/fa";
import { t } from "~/i18n";
import { Show } from "solid-js";

type Props = {
  type?: "comment" | "item";
  parent_id?: number | string | null;
};

export default ({ parent_id, type = "item" }: Props) => {
  // Hydration mismatch here
  const submission = useSubmission(registerItem);

  return (
    <div class="card bg-base-100 shadow-xl my-4">
      <div class="card-body">
        <h2 class="card-title">
          {t(type === "comment" ? "newComment" : "newItem")}
        </h2>
        <Show when={submission.error}>
          <div role="alert" class="alert alert-error shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <span>{submission.error.message}</span>
            </div>
          </div>
        </Show>

        <form action={registerItem} method="post" class="flex gap-2 my-2">
          {/* TODO: hidden field not very clean */}
          <input type="hidden" name="parent_id" value={parent_id || ""} />
          <div class="form-control w-full">
            <textarea
              name="content"
              class="textarea textarea-bordered w-full"
              rows="1"
              placeholder={t("content")}
            />
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
