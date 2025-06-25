import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";

import { createAsync, useParams } from "@solidjs/router";
import Breadcrumbs from "~/components/Breadcrumbs";
import { Show, Suspense } from "solid-js";

import { getItem } from "~/lib";
import ItemDetails from "~/components/ItemDetails";

export default function Item() {
  const params = useParams();
  const item = createAsync(() => getItem(params.id));

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Show when={item()}>
          <Breadcrumbs item={item} />
          <ItemDetails item={item} />
        </Show>
      </Suspense>

      <NewItemForm parent_id={params.id} type="comment" />
      <ItemsTable />
    </>
  );
}
