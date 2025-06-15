import { createStore } from "solid-js/store";
// import { cookieStorage, makePersisted } from "@solid-primitives/storage";

// TODO: remember what this is for
export const [votes, setVotes] = createStore<
  { item_id: number; type: string }[]
>([]);

// export const [authData, setAuthData] = makePersisted(
//   createStore<{ user: any; jwt: string | null }>({ user: null, jwt: null }),
//   {
//     storage: cookieStorage,
//     storageOptions: {},
//     name: "auth",
//   }
// );
