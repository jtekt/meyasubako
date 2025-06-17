import { createAsync, useSearchParams } from "@solidjs/router";
import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";
import { getItems } from "~/lib";

export default function Items() {
  const [search] = useSearchParams();
  const data = createAsync(() => getItems({ search }));

  return (
    <div>
      <NewItemForm />
      {/* TODO: pass data or data() ? */}
      <ItemsTable data={data} />
    </div>
  );
}
