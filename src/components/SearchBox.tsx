import { useSearchParams } from "@solidjs/router";
import { createSignal } from "solid-js";
import { FiSearch } from "solid-icons/fi";
// import { t } from "./LocaleSelector";

export default () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = createSignal(searchParams.search || "");

  function handleFormSubmit(event: any) {
    event.preventDefault();
    setSearchParams({ ...searchParams, search: search() });
  }

  return (
    <form onsubmit={handleFormSubmit} class="flex gap-2 my-2">
      <div class="form-control w-full">
        <input
          type="text"
          onInput={(event: any) => {
            setSearch(event?.target?.value);
          }}
          value={search()}
          // placeholder={t("search")}
          class="input input-bordered w-full"
        />
      </div>
      <button class="btn" type="submit">
        <FiSearch size={24} />
      </button>
    </form>
  );
};
