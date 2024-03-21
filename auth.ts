import Elysia, { Context } from "elysia"

interface Opts {
  url: string
}

const handleOnRequest = (opts: Opts) => async (ctx: any) => {
  // Keep track of the start time of the request

  const { method, headers } = ctx.request
  const { url } = opts

  if (method === "OPTIONS") return

  const authorization = headers.get("authorization")
  if (!authorization) throw "authorization header not set"

  const response = await fetch(url, { headers: { authorization } })
  const userData = await response.json()
  ctx.store.user = userData
}

export default (opts: Opts) => {
  return new Elysia().onRequest(handleOnRequest(opts))
}
