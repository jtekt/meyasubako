import { AccessorWithLatest } from "@solidjs/router";
import { FaRegularCalendar } from "solid-icons/fa";
import VoteButton from "./VoteButton";
import { formatDate } from "~/lib/utils";

// TODO: typinh
type Props = { item: AccessorWithLatest<any> };

export default ({ item }: Props) => {
  return (
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex gap-2 items-center">
          <FaRegularCalendar />
          <span>{formatDate(item().time)}</span>
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
  );
};
