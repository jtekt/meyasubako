import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";

import {
  createAsync,
  RouteDefinition,
  useParams,
  useSearchParams,
} from "@solidjs/router";
import { getItems, getItem } from "~/lib";
import Breadcrumbs from "~/components/Breadcrumbs";
import { Show } from "solid-js";

export const route = {
  preload: (e) => getItems(Number(e.params.id), e.location.search),
} satisfies RouteDefinition;

export default function Item() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const item = createAsync(() => getItem(Number(params.id)));
  const data = createAsync(() =>
    getItems(
      Number(params.id),
      `?${new URLSearchParams(searchParams).toString()}`
    )
  );

  return (
    <Show when={item()}>
      <Breadcrumbs item={item} />
      <NewItemForm parent_id={item()?.id} type="comment" />
      <ItemsTable data={data} />
    </Show>
  );
}
