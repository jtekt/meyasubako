import { createMiddleware } from "@solidjs/start/middleware";
import { requireLogin } from "@moreillon/solidstart-oidc";
import { type FetchEvent } from "@solidjs/start/server";
import { redirect } from "@solidjs/router";

export default createMiddleware({
  async onRequest(event: FetchEvent) {
    const url = await requireLogin(event);
    if (url) return redirect(url);
  },
});
