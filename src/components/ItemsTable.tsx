import { For, ErrorBoundary, Suspense } from "solid-js";
import { formatDate } from "../lib/utils";
import { FaRegularComment, FaRegularThumbsUp } from "solid-icons/fa";
// import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
// import VoteButton from "~/components//VoteButton";
import SortButtons from "~/components/SortButtons";
import SearchBox from "~/components/SearchBox";
import { BsCalendar } from "solid-icons/bs";
import { A, createAsync, useLocation, useParams } from "@solidjs/router";
import { getItems } from "~/lib";
import { clientOnly } from "@solidjs/start";

const VoteButton = clientOnly(() => import("~/components/VoteButton"));

export default () => {
  const location = useLocation();
  const params = useParams();
  const data = createAsync(() =>
    getItems({ parent_id: params.id, searchParams: location.search })
  );

  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <Suspense
        fallback={
          <div class="text-center">
            <span class="loading loading-spinner loading-lg" />
          </div>
        }
      >
        <div class="card bg-base-100 shadow-xl my-4">
          <div class="card-body">
            <SearchBox />
            <table class="table">
              <thead>
                <tr>
                  <th class="flex gap-2 items-center ">
                    <BsCalendar size={16} />
                    <SortButtons sort="time" />
                  </th>
                  <th>{/* TODO: icon */}</th>
                  <th class="flex gap-2 items-center justify-center">
                    <FaRegularThumbsUp size={16} />
                    <SortButtons sort="likes" />
                  </th>
                  <th>
                    <FaRegularComment size={16} />
                  </th>
                </tr>
              </thead>
              <tbody>
                <For each={data()?.items}>
                  {(item) => (
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
                        <VoteButton item={item} type="like" />
                        <span class="basis-10 text-center text-lg">
                          {item.likes}
                        </span>
                        <VoteButton item={item} type="dislike" />
                      </td>
                      <td class="text-center">
                        <A
                          href={`/items/${item.id}`}
                          class="btn flex flex-nowrap btn-outline"
                        >
                          <FaRegularComment size={18} />
                          {/* TODO: why is TS complaining here? */}
                          {item.comments?.length}
                        </A>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
            {/* TODO: Intersection */}
            {/* <Show when={loading()}>
          <div class="text-center">
            <span class="loading loading-spinner loading-lg" />
          </div>
        </Show> */}
            {/* <div ref={(el) => setIntersectionObserverTargets((p) => [...p, el])} /> */}
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};
