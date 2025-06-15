import { For, createEffect, createSignal, Show, on } from "solid-js";
import { formatDate } from "../lib/utils";
import { FaRegularComment } from "solid-icons/fa";
import { A, useParams, useLocation, query } from "@solidjs/router";
// import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import VoteButton from "~/components//VoteButton";
import SortButtons from "~/components/SortButtons";
import SearchBox from "~/components/SearchBox";
// import { t } from "~/components/LocaleSelector";
import { createAsync, type RouteDefinition } from "@solidjs/router";
import { db } from "~/lib/db";
// import { getItems } from "~/lib";

// export const route = {
//   preload() {
//     getItems();
//   },
// } satisfies RouteDefinition;

// TODO: have this in the server file?
const getItems = query(async () => {
  "use server";

  const {
    skip = "0",
    take = "100",
    sort = "time",
    order = "desc",
    min_likes = "-5",
    // parent_id,
    // search,
  } = {};

  const baseQuery: any = {
    where: {
      likes: {
        gte: Number(min_likes),
      },
    },
  };

  // if (parent_id) baseQuery.where.parent_id = Number(parent_id)
  //  else baseQuery.where.parent_id = null
  //   if (search)
  //     baseQuery.where.content = { contains: search, mode: "insensitive" }

  const fullQuery = {
    ...baseQuery,
    include: { comments: true },
    skip: Number(skip),
    take: Number(take),
    orderBy: [{ [sort]: order }],
  };

  const items = await db.item.findMany(fullQuery);
  const total = await db.item.count(baseQuery);

  return { skip, take, total, items };
}, "items");

export default ({ type = "items" }: any) => {
  // const [items, setItems] = createSignal<any>([]);

  const data = createAsync(() => getItems(), { deferStream: true });

  // const total = 0;
  // const loading = false;
  const total = () => 3;
  const loading = () => false;
  // const [total, setTotal] = createSignal(0);
  // const [loading, setLoading] = createSignal(false);
  // const [intersectionObserverTargets, setIntersectionObserverTargets] =
  //   createSignal<Element[]>([]);

  const urlParams = useParams();
  const location = useLocation();
  const take = 50;
  let intersecting = false;

  function handleUpdate(i: any) {
    alert("WIP");
    // const itemsCopy = items().slice()
    // const foundIndex = itemsCopy.findIndex(({ id }: any) => id === i.id)
    // // @ts-ignore
    // itemsCopy.splice(foundIndex, 1, i)
    // setItems(itemsCopy)
  }

  // createEffect(
  //   on(
  //     () => location.search,
  //     () => {
  //       setItems([]);
  //       setTotal(0);
  //       fetchItems();
  //     }
  //   )
  // );

  // createIntersectionObserver(intersectionObserverTargets, (entries) => {
  //   intersecting = entries.some((e) => e.isIntersecting);
  //   if (intersecting && !loading() && items().length < total()) fetchItems();
  // });

  // async function fetchItems() {

  //   setLoading(true)

  //   const route = `/items${location.search}`
  //   const params: any = {
  //     skip: items().length,
  //     take,
  //   }
  //   if (urlParams.id) params.parent_id = urlParams.id

  //   const { data } = await axios.get(route, { params })

  //   setItems([...items(), ...data.items])
  //   setTotal(data.total)
  //   setLoading(false)

  //   if (intersecting && !loading() && items().length < total()) fetchItems()
  // }

  // function handleUpdate(i: any) {
  //   const itemsCopy = items().slice();
  //   const foundIndex = itemsCopy.findIndex(({ id }: any) => id === i.id);
  //   // @ts-ignore
  //   itemsCopy.splice(foundIndex, 1, i);
  //   setItems(itemsCopy);
  // }

  return (
    <div class="card bg-base-100 shadow-xl my-4">
      <div class="card-body">
        <h2 class="card-title">
          {/* {t(type === "comments" ? "comments" : "items")} */}({total()})
        </h2>
        <Show when={total()}>
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
        <Show when={loading()}>
          <div class="text-center">
            <span class="loading loading-spinner loading-lg" />
          </div>
        </Show>
        {/* <div ref={(el) => setIntersectionObserverTargets((p) => [...p, el])} /> */}
      </div>
    </div>
  );
};
