import { IoSend } from "solid-icons/io";
import { action, useSubmission } from "@solidjs/router";
import { db } from "~/lib/db";

const registerItem = action(async (formData: FormData) => {
  "use server";
  const content = formData.get("content") as string;
  // TODO: not very clean
  const parent_id = (formData.get("parent_id") || undefined) as
    | string
    | undefined;

  if (!content) throw new Error("Missing content");
  return db.item.create({ data: { parent_id: Number(parent_id), content } });

  // TODO: redirect
}, "registerItem");

type Props = {
  type?: "item" | "comment";
  parent_id?: number;
};

export default ({ parent_id, type = "item" }: Props) => {
  const submission = useSubmission(registerItem);

  return (
    <div class="card bg-base-100 shadow-xl my-4">
      <div class="card-body">
        <h2 class="card-title">
          {/* {t(type === "comment" ? "newComment" : "newItem")} */}
        </h2>

        <form action={registerItem} method="post" class="flex gap-2 my-2">
          {/* TODO: Not very clean */}
          <input type="hidden" name="parent_id" value={parent_id || ""} />
          <div class="form-control w-full">
            <textarea
              name="content"
              class="textarea textarea-bordered w-full"
              rows="1"
            />
          </div>
          <button
            class="btn btn-primary"
            type="submit"
            disabled={submission.pending}
          >
            <IoSend size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};
