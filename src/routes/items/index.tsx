import { createAsync, RouteDefinition, useSearchParams } from "@solidjs/router";
import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";
import { getItems } from "~/lib";

export const route = {
  preload: (e) => getItems(null, e.location.search),
} satisfies RouteDefinition;

export default function Items() {
  const [searchParams] = useSearchParams();

  // TODO: is there really no better way to deal with this?
  const data = createAsync((e) =>
    getItems(null, `?${new URLSearchParams(searchParams).toString()}`)
  );

  return (
    <div>
      <NewItemForm />
      {/* TODO: pass data or data() ? */}
      <ItemsTable data={data} />
    </div>
  );
}
