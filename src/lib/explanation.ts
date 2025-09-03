import { query } from "@solidjs/router";
import { INPUT_EXPLANATION_EN, INPUT_EXPLANATION_JA } from "./config";

export const getExplanationQuery = query(async () => {
  "use server";
  return {
    ja: INPUT_EXPLANATION_JA,
    en: INPUT_EXPLANATION_EN,
  };
}, "explanation");
