import {
  createAsync,
  RouteDefinition,
  useLocation,
  useSearchParams,
} from "@solidjs/router";
import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";
import { getItems } from "~/lib";

export const route = {
  preload: ({ location }) => getItems(null, location.search),
} satisfies RouteDefinition;

export default function Items() {
  const location = useLocation();
  const data = createAsync((e) => getItems(null, location.search));

  return (
    <div>
      <NewItemForm />
      {/* TODO: pass data or data() ? */}
      <ItemsTable data={data} />
    </div>
  );
}
