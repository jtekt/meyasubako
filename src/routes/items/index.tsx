import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";

export default function Items() {
  return (
    <>
      <NewItemForm />
      <ItemsTable />
    </>
  );
}
