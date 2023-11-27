import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import metricsMiddleware from "elysia-prometheus-metrics"
import { createItem, readItems, readItem, vote } from "./controllers/items"

const { ELYSIA_PORT = 80 } = process.env

const app = new Elysia()
app.use(cors())
app.use(metricsMiddleware())
app.post("/items", createItem)
app.get("/items", readItems)
app.get("/items/:id", readItem)

app.post("/items/:id/likes", vote(1))
app.post("/items/:id/like", vote(1))
app.post("/items/:id/dislikes", vote(-1))
app.post("/items/:id/dislike", vote(-1))

app.listen(ELYSIA_PORT, () => {
  console.log(`Elysia listening on port ${app.server?.port}`)
})
