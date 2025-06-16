// import { createAsync, type RouteDefinition } from "@solidjs/router";
import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";
// import { getItems } from "~/lib";

// export const route = {
//   preload() {
//     getItems();
//   },
// } satisfies RouteDefinition;

export default function Home() {
  // const items = createAsync(() => getItems(), { deferStream: true });
  return (
    <main>
      {/* <p> {JSON.stringify(items())}</p> */}
      <NewItemForm />
      <ItemsTable />
    </main>
  );
}
