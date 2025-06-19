import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";

import { useParams } from "@solidjs/router";
import Breadcrumbs from "~/components/Breadcrumbs";

export default function Item() {
  const params = useParams();

  return (
    <>
      <Breadcrumbs />
      <NewItemForm parent_id={params.id} type="comment" />
      <ItemsTable />
    </>
  );
}
