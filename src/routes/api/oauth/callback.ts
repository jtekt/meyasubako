import { callbackHandler } from "@moreillon/solidstart-oidc";
import { redirect } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";

export async function GET(event: APIEvent) {
  await callbackHandler(event);
  return redirect("/");
}
