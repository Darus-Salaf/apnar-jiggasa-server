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

    const postsCollection = client.db("apnarJiggasa").collection("posts")
    const videosCollection = client.db("apnarJiggasa").collection("videos")
    const questionsCollection = client.db("apnarJiggasa").collection("questions")
    const pdfCollection = client.db("apnarJiggasa").collection("pdf")

    /* 
    -----------------
    Posts
    -----------------
    */
    // Get all posts for likhito-proshno, nari-ongon & nastikkobad
    app.get('/api/v1/posts', (req, res) => {

        postsCollection.find()
            .toArray((err, result) => res.send(result))
    })

    // Get all posts for likhito-proshno, nari-ongon & nastikkobad
    app.get('/api/v1/posts/:cat/:subcat', (req, res) => {
        const cat = req.params.cat
        const subcat = req.params.subcat

        postsCollection.find({ cat, subcat })
            .toArray((err, result) => res.send(result))
    })

    // Create a post corresponding to a specific category and subcategory
    app.post('/api/v1/create/post', (req, res) => {
        const post = req.body

        postsCollection.insertOne(post)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Create many post
    app.post('/api/v1/create/posts', (req, res) => {
        const post = req.body

        postsCollection.insertMany(post)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Delete a post 
    app.delete('/api/v1/delete/post/:id', (req, res) => {
        postsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => res.send(result.deletedCount))
    })

    /* 
    -----------------
    Video
    -----------------
    */
    // Get all videos
    app.get('/api/v1/videos', (req, res) => {

        videosCollection.find()
            .toArray((err, result) => res.send(result))
    })

    // Get all videos corresponding to a specific category
    app.get('/api/v1/videos/:cat', (req, res) => {
        const cat = req.params.cat

        videosCollection.find({ cat })
            .toArray((err, result) => res.send(result))
    })

    /*     // Get videos corresponding to a specific Sheikh
        app.get('/api/v1/videos/:sheikh', (req, res) => {
            const sheikh = req.params.sheikh
    
            videosCollection.find({ sheikh })
                .toArray((err, result) => res.send(result))
        }) */

    // Create a video 
    app.post('/api/v1/create/video', (req, res) => {
        const video = req.body

        videosCollection.insertOne(video)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Create many video 
    app.post('/api/v1/create/videos', (req, res) => {
        const video = req.body

        videosCollection.insertMany(video)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Delete a video 
    app.delete('/api/v1/delete/video/:id', (req, res) => {
        videosCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => res.send(result.deletedCount))
    })

    /* 
    -----------------
    Question
    -----------------
    */
    // Create a question 
    app.post('/api/v1/create/question', (req, res) => {
        const question = req.body

        questionsCollection.insertOne(question)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Get temporary question
    app.get('/api/v1/questions/temp', (req, res) => {
        const status = 'temp'

        questionsCollection.find({ status })
            .toArray((err, result) => res.send(result))
    })

    // Get permanent question
    app.get('/api/v1/questions/per', (req, res) => {
        const status = 'per'

        questionsCollection.find({ status })
            .toArray((err, result) => res.send(result))
    })

    // Delete a question 
    app.delete('/api/v1/delete/question/:id', (req, res) => {

        questionsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => res.send(result.deletedCount))
    })

    /* 
    -----------------
    PDF
    -----------------
    */
    // Get all pdfs
    app.get('/api/v1/pdfs', (req, res) => {

        pdfCollection.find()
            .toArray((err, result) => res.send(result))
    })

    // Get all pdfs corresponding to a specific category
    app.get('/api/v1/pdfs/:cat', (req, res) => {
        const cat = req.params.cat

        pdfCollection.find({ cat })
            .toArray((err, result) => res.send(result))
    })

    // Create a PDF 
    app.post('/api/v1/create/pdf', (req, res) => {
        const pdf = req.body

        pdfCollection.insertOne(pdf)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Create many PDF 
    app.post('/api/v1/create/pdfs', (req, res) => {
        const pdf = req.body

        pdfCollection.insertMany(pdf)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Delete a pdf 
    app.delete('/api/v1/delete/pdf/:id', (req, res) => {
        
        pdfCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => res.send(result.deletedCount))
    })


})

app.listen(PORT, () => console.log(`Server is Listening on port ${PORT}`))