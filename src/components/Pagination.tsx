import { useSearchParams } from "@solidjs/router";
import { FaSolidArrowLeft, FaSolidArrowRight } from "solid-icons/fa";
// import { createSignal } from "solid-js";
// import { t } from "./LocaleSelector";

type Props = {
  total?: number;
  pageSize?: number;
};
export default ({ total, pageSize }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getPaginationOptions = () => ({
    page: Number(searchParams.page || "1"),
  });

  const getPageCount = () => Math.ceil((total || 0) / (pageSize || 10));
  const canPrevious = () => getPaginationOptions().page > 1;
  const canNext = () => getPaginationOptions().page < getPageCount();

  function changePage(direction: number) {
    const { page } = getPaginationOptions();
    setSearchParams({ ...searchParams, page: page + direction });
  }

  return (
    <div class="flex justify-center">
      <div class="my-6 flex justify-center gap-8 items-center">
        <button
          class="btn"
          onclick={() => changePage(-1)}
          disabled={!canPrevious()}
        >
          <FaSolidArrowLeft />
        </button>

        <div>
          {getPaginationOptions().page}/{getPageCount()}
        </div>
        <button class="btn" onclick={() => changePage(1)} disabled={!canNext()}>
          <FaSolidArrowRight />
        </button>
      </div>
    </div>
  );
};
