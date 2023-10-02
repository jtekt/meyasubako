import { Elysia } from "elysia"
import { createItem, readItems, readItem, vote } from "./controllers/items"
const app = new Elysia()
// TODO: cors

app.post("/items", createItem)
app.get("/items", readItems)
app.get("/items/:id", readItem)

app.post("/items/:id/likes", vote(1))
app.post("/items/:id/like", vote(1))
app.post("/items/:id/dislikes", vote(-1))
app.post("/items/:id/dislike", vote(-1))

app.listen(3001, () => {
  console.log(`Elysia listening on port ${app.server?.port}`)
})
