import {
  createAsync,
  query,
  RouteDefinition,
  useSearchParams,
} from "@solidjs/router";

const testQuery = query(async (search: string) => {
  "use server";
  // console.log(search);
  const usp = new URLSearchParams(search);
  console.log(usp.get("item"));
  return search;
}, "test");

export const route = {
  preload: (e) => testQuery(e.location.search),
} satisfies RouteDefinition;

export default function Items() {
  // Runs only once if argument does not change
  const [searchParans] = useSearchParams();
  const data = createAsync(() =>
    testQuery(`?${new URLSearchParams(searchParans).toString()}`)
  );

  return <div>{data()}</div>;
}
