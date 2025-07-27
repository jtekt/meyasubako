import { createSignal, Show } from "solid-js";
import { FaRegularThumbsUp, FaRegularThumbsDown } from "solid-icons/fa";
import { votes, setVotes } from "../store";
import { useAction } from "@solidjs/router";
import { registerVote } from "~/lib/items";
import { Prisma } from "~/generated/prisma";

type Vote = "like" | "dislike";

type Props = {
  type: Vote;
  item: Prisma.itemModel;
};

export default ({ type, item }: Props) => {
  const voteAction = useAction(registerVote);

  const [loading, setLoading] = createSignal(false);

  const findVote = () => votes.find((vote: any) => vote.item_id === item.id);
  const buttonHasBeenClicked = () => findVote()?.type === type;
  const getClass = () => (buttonHasBeenClicked() ? "btn btn-primary" : "btn");

  async function vote() {
    setLoading(true);
    await voteAction(item.id, type);
    setVotes([...votes, { item_id: item.id, type }]);
    localStorage.setItem("votes", JSON.stringify(votes));
    setLoading(false);
  }

  async function cancelVote() {
    setLoading(true);

    const cancelMap: { [key in Vote]: Vote } = {
      like: "dislike",
      dislike: "like",
    };
    await voteAction(item.id, cancelMap[type]);
    const newVotes = votes.slice().filter(({ item_id }) => item_id !== item.id);
    setVotes(newVotes);
    localStorage.setItem("votes", JSON.stringify(votes));
    setLoading(false);
  }

  function handleClick() {
    if (buttonHasBeenClicked()) cancelVote();
    else vote();
  }

  return (
    <button
      class={getClass()}
      onClick={handleClick}
      disabled={loading() || (!!findVote() && !buttonHasBeenClicked())}
    >
      <Show when={loading()}>
        <span class="loading loading-spinner" />
      </Show>
      <Show when={!loading()}>
        <Show when={type === "like"}>
          <FaRegularThumbsUp size={24} />
        </Show>
        <Show when={type === "dislike"}>
          <FaRegularThumbsDown size={24} />
        </Show>
      </Show>
    </button>
  );
};
