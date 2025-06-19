// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { setVotes, votes } from "./store";

mount(() => {
  const votesString = localStorage.getItem("votes") || "[]";
  setVotes(JSON.parse(votesString));

  return <StartClient />;
}, document.getElementById("app")!);
