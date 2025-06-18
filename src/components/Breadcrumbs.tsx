import { For } from "solid-js";
import { A, AccessorWithLatest } from "@solidjs/router";
import { VsHome } from "solid-icons/vs";
import { Prisma } from "~/generated/prisma";
// import { t } from "./LocaleSelector";

type Props = { item: AccessorWithLatest<Prisma.itemSelect> };

export default ({ item }: Props) => {
  const getParentsRecursively = (item: any) => {
    let out: any[] = [];
    if (item.parent)
      out = [...out, item.parent, ...getParentsRecursively(item.parent)];

    return out;
  };

  return (
    <div class="breadcrumbs">
      <ul>
        <li>
          <A href={`/`} class="btn">
            <VsHome size={20} />
            {/* <span>{t("home")}</span> */}
          </A>
        </li>
        <For each={getParentsRecursively(item())}>
          {(parent: any) => (
            <li>
              <A href={`/items/${parent.id}`} class="btn">
                <span class="max-w-[20ch] truncate ... ">{parent.content}</span>
              </A>
            </li>
          )}
        </For>
        <li>
          <span class="btn btn-disabled">
            <span class="max-w-[20ch] truncate ...">{item().content}</span>
          </span>
        </li>
      </ul>
    </div>
  );
};
