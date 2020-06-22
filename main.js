const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')

dotenv.config()

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const db_name = 'mendokusai'
const monku_collection_name = 'monku'
const proposals_collection_name = 'proposals'

const mongodb_options = {
  useUnifiedTopology: true,
}

const app = express()
app.use(bodyParser.json())
app.use(cors())

var app_port = 80
if(process.env.APP_PORT) app_port = process.env.APP_PORT

app.get('/', (req,res) => {
  res.send(`Monku API, Maxime MOREILLON <br> MonboDB URL: ${process.env.MONGODB_URL}`)
})
app.post('/monku', (req, res) => {
  if(!('content' in req.body)) return res.status(400).send('Content not present in request body')

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')

    let monku = {
      content: req.body.content,
      likes: 0,
      proposals: [],
    }

    db.db(db_name)
    .collection(monku_collection_name)
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
  if(('_id' in req.query)) query._id = ObjectID(req.query._id)

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')
    db.db(db_name)
    .collection(monku_collection_name)
    .aggregate([
      { $match: query },
      { $lookup: {
         from: 'proposals',
         localField: 'proposals',
         foreignField: '_id',
         as: 'proposals'
       }
     },
    ])
    .toArray((err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).send('Error querying DB')
      }
      db.close()
      res.send(result)
    })
  })
})



app.post('/proposal', (req, res) => {
  if(!('monku_id' in req.body)) return res.status(400).send('monku_id not present in request body')
  if(!('content' in req.body)) return res.status(400).send('Content not present in request body')

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')

    let proposal = {
      content: req.body.content,
      monku_id: req.body.monku_id,
      likes: 0,
    }

    db.db(db_name).collection(proposals_collection_name)
    .insertOne(proposal, (err, result) => {
      if (err) return res.status(500).send('Error querying DB')

      let filter = {_id: ObjectID(req.body.monku_id)}
      let update = {$push: {proposals: ObjectID(result.insertedId)}} // Not sure if ObjectID is needed here

      db.db(db_name).collection(monku_collection_name)
      .updateOne(filter,update, (err, result) => {
        if (err) return res.status(500).send('Error querying DB')
        db.close()
        res.send(result)

      })

    })
  })
})

app.get('/proposal', (req, res) => {

  // Get id from query parameters
  if(!('monku_id' in req.query)) return res.status(400).send('monku_id not present in request body')

  let query = {monku_id: req.query.monku_id}
  if(('_id' in req.query)) query._id = ObjectID(req.query._id)

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')
    db.db(db_name)
    .collection(proposals_collection_name)
    .find(query)
    .toArray((err, result) => {
      if (err) return res.status(500).send('Error querying DB')
      db.close()
      res.send(result)
    })
  })
})

app.post('/vote', (req, res) => {

  if(!('_id' in req.body)) return res.status(400).send('ID not present in request body')
  if(!('vote' in req.body)) return res.status(400).send('Vote not present in request body')
  if(!('collection' in req.body)) return res.status(400).send('Collection not present in request body')

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')

    let filter = {
      _id: ObjectID(req.body._id)
    }

    let update = {
      $inc: {
        likes: req.body.vote
      }
    }

    let options = {returnOriginal:false}


    db.db(db_name).collection(req.body.collection)
    .findOneAndUpdate(filter, update, options, (err, result) => {
      if (err) return res.status(500).send('Error querying DB')
      db.close()
      res.send(result)
    })
  })
})

app.listen(app_port, () => console.log(`Mendokusai running on port ${app_port}`))
