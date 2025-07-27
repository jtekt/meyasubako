import { loginHandler } from "@moreillon/solidstart-oidc";
import { redirect } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";

export async function GET(event: APIEvent) {
  const href = await loginHandler(event);
  return redirect(href);
}
