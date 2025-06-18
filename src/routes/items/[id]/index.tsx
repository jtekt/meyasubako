import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";

import {
  createAsync,
  RouteDefinition,
  useLocation,
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
  const location = useLocation();

  const item = createAsync(() => getItem(Number(params.id)));
  const data = createAsync(() => getItems(Number(params.id), location.search));

  return (
    <Show when={item()}>
      <Breadcrumbs item={item} />
      <NewItemForm parent_id={item()?.id} type="comment" />
      <ItemsTable data={data} />
    </Show>
  );
}
