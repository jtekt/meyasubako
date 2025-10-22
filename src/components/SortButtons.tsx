import { useSearchParams } from "@solidjs/router";
import { FaSolidArrowDown, FaSolidArrowUp } from "solid-icons/fa";

type Props = { sort: string };

export default ({ sort }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  function applySort(order: string) {
    setSearchParams({ ...searchParams, sort, order }, { replace: true });
  }

  function buttonClass(newOrder: string) {
    let out = `btn btn-xs btn-square`;
    const { sort: currentSort = "likes", order: currentOrder = "desc" } =
      searchParams;
    if (currentSort === sort && currentOrder === newOrder)
      out = `${out} btn-primary`;
    else out = `${out} btn-ghost`;
    return out;
  }

  return (
    <span class="mx-2 flex gap-1">
      <button class={buttonClass("desc")} onClick={() => applySort("desc")}>
        <FaSolidArrowUp />
      </button>
      <button class={buttonClass("asc")} onClick={() => applySort("asc")}>
        <FaSolidArrowDown />
      </button>
    </span>
  );
};
