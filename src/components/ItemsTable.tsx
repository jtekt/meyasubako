import { For, createEffect, createSignal, Show, on } from "solid-js";
import { formatDate } from "../lib/utils";
import { FaRegularComment } from "solid-icons/fa";
// import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import VoteButton from "~/components//VoteButton";
import SortButtons from "~/components/SortButtons";
import SearchBox from "~/components/SearchBox";
// import { t } from "~/components/LocaleSelector";
import { A, AccessorWithLatest } from "@solidjs/router";
import { Prisma } from "~/../generated/prisma";

type Props = {
  // type?: "items" | "comments";
  data: AccessorWithLatest<{
    total: number;
    items: Prisma.itemSelect[];
  }>;
};

export default ({ data }: Props) => {
  function handleUpdate() {
    console.log("WIP");
  }
  return (
    <div class="card bg-base-100 shadow-xl my-4">
      <div class="card-body">
        <h2 class="card-title">
          {/* {t(type === "comments" ? "comments" : "items")} */}(
          {data()?.total})
        </h2>
        <Show when={data()?.total}>
          <div>
            Search
            {/* <SearchBox /> */}
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>
                  Date
                  {/* {t("date")} */}
                  {/* <SortButtons sort="time" /> */}
                </th>
                <th>
                  Content
                  {/* {t("content")} */}
                </th>
                <th>
                  Likes
                  {/* {t("likes")} */}
                  {/* <SortButtons sort="likes" /> */}
                </th>
                <th>
                  Comments
                  {/* {t("comments")} */}
                </th>
              </tr>
            </thead>
            <tbody>
              <For each={data()?.items || []}>
                {(item: any) => (
                  <tr>
                    <td class="text-gray-500">{formatDate(item.time)}</td>
                    <td class="w-full">
                      <A
                        class="w-full"
                        href={`/items/${item.id}`}
                        style="display: block; white-space: pre-line;"
                      >
                        {item.content}
                      </A>
                    </td>
                    <td class="flex items-center gap-2 ">
                      <VoteButton
                        item={item}
                        onUpdate={handleUpdate}
                        type="like"
                      />
                      <span class="basis-10 text-center text-lg">
                        {item.likes}
                      </span>
                      <VoteButton
                        item={item}
                        onUpdate={handleUpdate}
                        type="dislike"
                      />
                    </td>
                    <td class="text-center">
                      <A
                        href={`/items/${item.id}`}
                        class="btn flex flex-nowrap btn-outline"
                      >
                        <FaRegularComment size={18} />
                        {/* {item.comments.length} */}
                      </A>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
        {/* <Show when={loading()}>
          <div class="text-center">
            <span class="loading loading-spinner loading-lg" />
          </div>
        </Show> */}
        {/* <div ref={(el) => setIntersectionObserverTargets((p) => [...p, el])} /> */}
      </div>
    </div>
  );
};
