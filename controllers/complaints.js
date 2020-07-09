const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const db_name = 'mendokusai'
const monku_collection_name = 'monku'

const mongodb_options = {
  useUnifiedTopology: true,
}


exports.create_complaint = (req, res) => {
  if(!('content' in req.body)) return res.status(400).send('Content not present in request body')

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')

    let monku = {
      content: req.body.content,
      likes: 0,
      proposals: [],
      timestamp: new Date(),
    }

    db.db(db_name)
    .collection(monku_collection_name)
    .insertOne(monku, (err, result) => {
      if (err) return res.status(500).send('Error querying DB')
      db.close()
      res.send(result)
    })
  })
}

exports.get_complaint = (req, res) => {

  // Get id from query parameters
  let monku_id = req.params.monku_id
  let query = {}
  if(monku_id) query._id = ObjectID(monku_id)

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
}

exports.delete_complaint = (req, res) => {

  // Get id from query parameters
  let monku_id = req.params.monku_id
  if(!monku_id) return res.status(400).send('ID undefined')

  let query = {_id : ObjectID(monku_id)}

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')
    db.db(db_name)
    .collection(monku_collection_name)
    .deleteOne(query, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).send('Error querying DB')
      }
      db.close()
      res.send(result)
    })
  })
}
