const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')

dotenv.config()

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const db_name = 'mendokusai'
const collection_name = 'monku'
const mongodb_options = {
  useUnifiedTopology: true,
}
const app = express()
app.use(bodyParser.json())
app.use(cors())

var app_port = 80
if(process.env.APP_PORT) app_port = process.env.APP_PORT

app.post('/monku', (req, res) => {
  console.log(req.body)
  if(!('content' in req.body)) return res.status(400).send('Content not present in request body')

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')

    let monku = {
      content: req.body.content,
      likes: 0,
    }

    db.db(db_name)
    .collection(collection_name)
    .insertOne(monku, (err, result) => {
      if (err) return res.status(500).send('Error querying DB')
      db.close()
      res.send(result)
    })
  })
})

app.get('/monku', (req, res) => {

  // Get id from query parameters
  let query = {}
  if(('_id' in req.query)) query._id = req.query._id

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')
    db.db(db_name)
    .collection(collection_name)
    .find(query)
    .toArray((err, result) => {
      if (err) return res.status(500).send('Error querying DB')
      db.close()
      res.send(result)
    })
  })
})

app.post('/like', (req, res) => {
  if(!('_id' in req.body)) return res.status(400).send('ID not present in request body')

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')
    let query = {
      _id: ObjectID(req.body._id)
    }
    let action = {
      $inc: {
        likes: 1
      }
    }
    db.db(db_name)
    .collection(collection_name)
    .updateOne(query, action, (err, result) => {
      if (err) return res.status(500).send('Error querying DB')
      db.close()
      res.send(result)
    })
  })

})


app.listen(app_port, () => console.log(`Mendokusai running on port ${app_port}`))
