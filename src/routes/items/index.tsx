import { createAsync, useSearchParams } from "@solidjs/router";
import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";
import { getItems } from "~/lib";

export default function Items() {
  const [search] = useSearchParams();
  console.log(search);
  const data = createAsync(() => getItems({ search }));

  return (
    <main>
      <NewItemForm />
      <ItemsTable data={data} />
    </main>
  );
}
