const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const db_name = 'feedback_gathering_system'
const monku_collection_name = 'monku'
const proposals_collection_name = 'proposals'

const mongodb_options = {
  useUnifiedTopology: true,
}


exports.create_proposal = (req, res) => {

  let monku_id = req.params.monku_id
  if(!monku_id) return res.status(400).send('monku_id not present in request body')

  if(!('content' in req.body)) return res.status(400).send('Content not present in request body')

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')

    let proposal = {
      content: req.body.content,
      monku_id: monku_id,
      likes: 0,
      timestamp: new Date(),
    }

    db.db(db_name).collection(proposals_collection_name)
    .insertOne(proposal, (err, result) => {
      if (err) return res.status(500).send('Error querying DB')

      let filter = {_id: ObjectID(monku_id)}
      let update = {$push: {proposals: ObjectID(result.insertedId)}} // Not sure if ObjectID is needed here

      db.db(db_name).collection(monku_collection_name)
      .updateOne(filter,update, (err, result) => {
        if (err) return res.status(500).send('Error querying DB')
        db.close()
        res.send(result)

      })

    })
  })
}

exports.get_proposals = (req, res) => {

  let monku_id = req.params.monku_id
  if(monku_id) return res.status(400).send('monku_id not present in request body')


  let query = {monku_id: monku_id}
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
}

exports.delete_proposal = (req, res) => {
  // Get id from query parameters
  let proposal_id = req.params.proposal_id
  if(!proposal_id) return res.status(400).send('ID undefined')

  let query = {_id : ObjectID(proposal_id)}

  MongoClient.connect(process.env.MONGODB_URL,mongodb_options, (err, db) => {
    if (err) return res.status(500).send('Error connecting to DB')
    db.db(db_name)
    .collection(proposals_collection_name)
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
