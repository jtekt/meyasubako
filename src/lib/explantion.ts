import { query } from "@solidjs/router";
import { INPUT_EXPLANATION } from "./config";

export const getItems = query(async () => {
  "use server";
  return INPUT_EXPLANATION;
}, "explanation");
