import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";

import { createAsync, useParams, useSearchParams } from "@solidjs/router";
import { getItems, getItem } from "~/lib";

export default function Item() {
  const params = useParams();
  const [search] = useSearchParams();

  const item = createAsync(() => getItem());
  const data = createAsync(() =>
    getItems({ parent_id: Number(params.id), search })
  );

  return (
    <main>
      <NewItemForm parent_id={item()?.id} type="comment" />
      <ItemsTable data={data} />
    </main>
  );
}
