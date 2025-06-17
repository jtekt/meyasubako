import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";

import { createAsync, useParams, useSearchParams } from "@solidjs/router";
import { getItems, getItem } from "~/lib";
import Breadcrumbs from "~/components/Breadcrumbs";
import { Show } from "solid-js";

export default function Item() {
  const params = useParams();
  const [search] = useSearchParams();

  const item = createAsync(() => getItem(Number(params.id)));
  const data = createAsync(() =>
    getItems({ parent_id: Number(params.id), search })
  );

  return (
    <Show when={item()}>
      <Breadcrumbs item={item} />
      <NewItemForm parent_id={item()?.id} type="comment" />
      <ItemsTable data={data} />
    </Show>
  );
}
