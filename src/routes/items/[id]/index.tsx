import ItemsTable from "~/components/ItemsTable";
import NewItemForm from "~/components/NewItemForm";

import { createAsync, useParams } from "@solidjs/router";
import Breadcrumbs from "~/components/Breadcrumbs";
import { FaRegularCalendar, FaRegularUser } from "solid-icons/fa";
import { Show } from "solid-js";
import VoteButton from "~/components/VoteButton";
import { formatDate } from "~/lib/utils";
import { getItem } from "~/lib";

export default function Item() {
  const params = useParams();
  const item = createAsync(() => getItem(params.id));

  return (
    <>
      <Breadcrumbs />

      <Show when={item()}>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            {/* Metadata */}
            <div class="flex gap-6">
              <div class="flex gap-2 items-center">
                <FaRegularCalendar />
                <span>{formatDate(item().time)}</span>
              </div>
              <Show when={item().user}>
                <div class="flex gap-2 items-center">
                  <FaRegularUser />
                  <span>{item().user.display_name}</span>
                </div>
              </Show>
            </div>

            <h2 class="card-title my-4" style="white-space: pre-line;">
              {item().content}
            </h2>
            <div class="card-actions flex items-center">
              <VoteButton item={item()} type="like" />
              <span>{item().likes}</span>
              <VoteButton item={item()} type="dislike" />
            </div>
          </div>
        </div>
      </Show>

      <NewItemForm parent_id={params.id} type="comment" />
      <ItemsTable />
    </>
  );
}
