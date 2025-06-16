import { Show, createSignal } from "solid-js";
import { IoSend } from "solid-icons/io";
import { action, useNavigate } from "@solidjs/router";
// import { t } from "./LocaleSelector";
import { db } from "~/lib/db";

const registerItem = action(async (formData: FormData) => {
  "use server";
  // TODO: parent id
  const content = formData.get("content") as string;
  // console.log({ content });
  if (!content) throw new Error("Missing content");
  return db.item.create({ data: { content } });
}, "registerItem");

type Props = {
  type?: "item" | "comment";
  parent_id?: number;
};

export default ({ parent_id, type = "item" }: Props) => {
  // TODO: figure out how to have environment variables

  // const [content, setContent] = createSignal("");
  // const navigate = useNavigate();

  // TODO: might be better to use form action directly
  async function handleFormSubmit() {
    // await registerItem({ content: content() });
    // event.preventDefault();
    // if (!confirm("登録しますか？")) return;
    // const { data } = await axios.post("/items", {
    //   content: content(),
    //   parent_id,
    // });
    // const { id } = data;
    // navigate(`/items/${id}`);
  }

  return (
    <div class="card bg-base-100 shadow-xl my-4">
      <div class="card-body">
        <h2 class="card-title">
          {/* {t(type === "comment" ? "newComment" : "newItem")} */}
        </h2>

        {/* <Show when={type === "item" && VITE_DESCRIPTION}>
          <p>{VITE_DESCRIPTION}</p>
        </Show> */}

        <form action={registerItem} method="post" class="flex gap-2 my-2">
          <div class="form-control w-full">
            <textarea
              name="content"
              class="textarea textarea-bordered w-full"
              rows="1"
              // placeholder={t(type === "comment" ? "newComment" : "newItem")}
              // onInput={(event: any) => {
              //   setContent(event?.target?.value);
              // }}
            />
            {/* <Show when={!VITE_LOGIN_URL}>
              <label class="label">
                <span class="label-text-alt">{type}は匿名で登録されます</span>
              </label>
            </Show> */}
          </div>
          <button class="btn btn-primary" type="submit">
            <IoSend size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};
