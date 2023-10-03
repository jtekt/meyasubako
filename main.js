const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { version } = require("./package.json")
const {
  url: db_url,
  db: db_db,
  connect: db_connect,
  get_connected: db_get_connected,
} = require("./db")
const items_controller = require("./controllers/items")

dotenv.config()

console.log(`Feedback gathering system v${version}`)

const { APP_PORT = 80 } = process.env

db_connect()

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send({
    application: "Feedback gathering system",
    version,
    mongodb: {
      url: db_url,
      db: db_db,
      connected: db_get_connected(),
    },
  })
})

app
  .route("/items")
  .post(items_controller.create_item)
  .get(items_controller.read_all_items)

app
  .route("/items/:item_id")
  .get(items_controller.read_item)
  .delete(items_controller.delete_item)

app.route("/items/:item_id/vote").post(items_controller.vote)

app
  .route("/items/:item_id/items")
  .post(items_controller.create_item)
  .get(items_controller.read_all_items)

app.listen(APP_PORT, () =>
  console.log(`[Express] listening on port ${APP_PORT}`)
)
