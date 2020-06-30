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


const complaints_controller = require('./controllers/complaints.js')
const proposals_controller = require('./controllers/proposals.js')
const votes_controller = require('./controllers/votes.js')

const app_port = process.env.APP_PORT || 80

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req,res) => {
  res.send(`
    Monku API, Maxime MOREILLON<br>
    MonboDB URL: ${process.env.MONGODB_URL}
    `)
})

// Complaints
app.route('/monku')
  .post(complaints_controller.create_complaint)
  .get(complaints_controller.get_complaint)

app.route('/monku/:monku_id')
  .get(complaints_controller.get_complaint)
  .delete(complaints_controller.delete_complaint)

app.route('/monku/:monku_id/vote')
  .post(votes_controller.vote)

// Proposals
app.route('/monku/:monku_id/proposals')
  .post(proposals_controller.create_proposal)
  .get(proposals_controller.get_proposals)

app.route('/monku/:monku_id/proposals/:proposal_id')
  .delete(proposals_controller.delete_proposal)

app.route('/monku/:monku_id/proposals/:proposal_id/vote')
  .post(votes_controller.vote)

// Simplified routes to interact directly with proposals
app.route('/proposals/:proposal_id')
  .delete(proposals_controller.delete_proposal)

app.route('/proposals/:proposal_id/vote')
  .post(votes_controller.vote)

app.listen(app_port, () => console.log(`Mendokusai running on port ${app_port}`))
