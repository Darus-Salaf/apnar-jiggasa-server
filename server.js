const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()

app.use(cors());
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Root Derectory')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.saov2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(err => {
    console.log(err ? err : 'Database Connected Successfully')

    const postsCollection = client.db("facebook").collection("posts")
    const videosCollection = client.db("facebook").collection("posts")

    // Get all posts for likhito-proshno, nari-ongon & nastikkobad
    app.get('/api/v1/posts/:cat/:subcat', (req, res) => {
        const cat = req.params.cat
        const subcat = req.params.subcat

        postsCollection.find({ cat, subcat })
            .toArray((err, result) => res.send(result))
    })

    // Get all videos corresponding to a specific category and subcategory
    app.get('/api/v1/videos/:cat/:subcat', (req, res) => {
        const cat = req.params.cat
        const subcat = req.params.subcat

        videosCollection.find({ cat, subcat })
            .toArray((err, result) => res.send(result))
    })












})

app.listen(PORT, () => console.log(`Server is Listening on port ${PORT}`))