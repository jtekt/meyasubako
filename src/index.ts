import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import metricsMiddleware from "elysia-prometheus-metrics"
import authMiddleware from "../auth"
import { createItem, readItems, readItem, vote } from "./controllers/items"

const { ELYSIA_PORT = 80, IDENTIFICATION_URL } = process.env

const app = new Elysia().use(cors()).use(metricsMiddleware())

if (IDENTIFICATION_URL) {
  console.log(`Authentication enabled, URL: ${IDENTIFICATION_URL}`)
  app.use(authMiddleware({ url: IDENTIFICATION_URL }))
}

app
  .group("/items", (app) =>
    app
      .post("/", createItem)
      .get("/", readItems)
      .get("/:id", readItem)
      .post("/:id/likes", vote(1))
      .post("/:id/like", vote(1))
      .post("/:id/dislikes", vote(-1))
      .post("/:id/dislike", vote(-1))
  )

  .listen(ELYSIA_PORT, () => {
    console.log(`Elysia listening on port ${ELYSIA_PORT}`)
  })
