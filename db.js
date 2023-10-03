const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const {
  MONGODB_URL = "mongodb://mongo",
  MONGODB_DB = "feedback_gathering_system",
} = process.env

const options = { useUnifiedTopology: true, useNewUrlParser: true }

const connect = () => {
  const connection_string = `${MONGODB_URL}/${MONGODB_DB}`
  console.log(`[MongoDB] Attempting connection to ${connection_string}`)
  mongoose
    .connect(connection_string, options)
    .then(() => {
      console.log("[Mongoose] Initial connection successful")
    })
    .catch((error) => {
      console.log("[Mongoose] Initial connection failed")
      setTimeout(connect, 5000)
    })
}

exports.connect = connect
exports.url = MONGODB_URL
exports.db = MONGODB_DB
exports.get_connected = () => mongoose.connection.readyState
