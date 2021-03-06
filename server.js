const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

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
    const adminCollection = client.db("apnarJiggasa").collection("admins")
    const moderatorCollection = client.db("apnarJiggasa").collection("moderators")
    const reportCollection = client.db("apnarJiggasa").collection("reports")
    const duaCollection = client.db("apnarJiggasa").collection("dua")
    const duaNameCollection = client.db("apnarJiggasa").collection("duaname")

    /* 
    -----------------
    Posts
    -----------------
    */
    // Get all posts for likhito-proshno, nari-ongon & nastikkobad
    app.get('/backend/api/v1/posts', (req, res) => {

        postsCollection.find()
            .toArray((err, result) => res.send(result))
    })

    // Get all posts for likhito-proshno, nari-ongon & nastikkobad
    app.get('/backend/api/v1/posts/:cat/:subcat', (req, res) => {
        const cat = req.params.cat
        const subcat = req.params.subcat

        postsCollection.find({ cat, subcat })
            .toArray((err, result) => res.send(result))
    })

    // Create a post corresponding to a specific category and subcategory
    app.post('/backend/api/v1/create/post', (req, res) => {
        const post = req.body

        postsCollection.insertOne(post)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Create many post
    app.post('/backend/api/v1/create/posts', (req, res) => {
        const post = req.body

        postsCollection.insertMany(post)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })
    // Update a post
    app.post('/backend/api/v1/update/post', (req, res) => {
        const id = req.body.id
        const topic = req.body.topic
        const answer = req.body.answer
        postsCollection.updateOne({ _id: ObjectId(id) }, { $set: { topic, answer } })
            .then((err, result) => err ? res.send(err.message) : res.send(result))
    })

    // Delete a post 
    app.delete('/backend/api/v1/delete/post/:id', (req, res) => {
        postsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => res.send(result))
    })

    /* 
    -----------------
    Video
    -----------------
    */
    // Get all videos
    app.get('/backend/api/v1/videos', (req, res) => {

        videosCollection.find()
            .toArray((err, result) => res.send(result))
    })

    // Get all videos corresponding to a specific category
    app.get('/backend/api/v1/videos/:cat', (req, res) => {
        const cat = req.params.cat

        videosCollection.find({ cat })
            .toArray((err, result) => res.send(result))
    })

    /*     // Get videos corresponding to a specific Sheikh
        app.get('/backend/api/v1/videos/:sheikh', (req, res) => {
            const sheikh = req.params.sheikh
    
            videosCollection.find({ sheikh })
                .toArray((err, result) => res.send(result))
        }) */

    // Create a video 
    app.post('/backend/api/v1/create/video', (req, res) => {
        const video = req.body

        videosCollection.insertOne(video)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Create many video 
    app.post('/backend/api/v1/create/videos', (req, res) => {
        const video = req.body

        videosCollection.insertMany(video)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Delete a video 
    app.delete('/backend/api/v1/delete/video/:id', (req, res) => {
        videosCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => res.send(result))
    })

    /* 
    -----------------
    Question
    -----------------
    */
    // Create a question 
    app.post('/backend/api/v1/create/question', (req, res) => {
        const question = req.body

        questionsCollection.insertOne(question)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Get all question 
    app.get('/backend/api/v1/questions', (req, res) => {
        questionsCollection.find()
            .toArray((err, result) => res.send(result))
    })

    // // Get temporary question
    // app.get('/backend/api/v1/questions/temp', (req, res) => {
    //     const status = 'temp'

    //     questionsCollection.find({ status })
    //         .toArray((err, result) => res.send(result))
    // })

    // Get all permanent questions
    app.get('/backend/api/v1/questions/per', (req, res) => {
        const status = 'per'

        questionsCollection.find({ status })
            .toArray((err, result) => res.send(result))
    })
    // Get a single permanent question
    app.get('/backend/api/v1/questions/per/:id', (req, res) => {

        questionsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, result) => res.send(result))
    })

    // Update a question to permanent
    app.post('/backend/api/v1/update/question', (req, res) => {
        const id = req.body.id
        const answer = req.body.answer

        questionsCollection.updateOne({ _id: ObjectId(id) }, { $set: { status: 'per', answer } })
            .then((err, result) => err ? res.send(err.message) : res.send(result))
    })

    // Post a comment to a permanent question
    app.post('/backend/api/v1/comment', (req, res) => {
        let id = req.body.id
        let comment = req.body.comment

        questionsCollection.findOneAndUpdate({ _id: ObjectId(id) }, {
            $push: { comments: comment }
        })
            .then(result => res.sendStatus(200))
            .catch(err => res.send(err.message))

    })

    // Delete a question 
    app.delete('/backend/api/v1/delete/question/:id', (req, res) => {

        questionsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => res.send(result))
    })

    /* 
    -----------------
    PDF
    -----------------
    */
    // Get all pdfs
    app.get('/backend/api/v1/pdfs', (req, res) => {

        pdfCollection.find()
            .toArray((err, result) => res.send(result))
    })

    // Get all pdfs corresponding to a specific category
    app.get('/backend/api/v1/pdfs/:cat', (req, res) => {
        const cat = req.params.cat

        pdfCollection.find({ cat })
            .toArray((err, result) => res.send(result))
    })

    // Create a PDF 
    app.post('/backend/api/v1/create/pdf', (req, res) => {
        const pdf = req.body

        pdfCollection.insertOne(pdf)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Create many PDF 
    app.post('/backend/api/v1/create/pdfs', (req, res) => {
        const pdf = req.body

        pdfCollection.insertMany(pdf)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Delete a pdf 
    app.delete('/backend/api/v1/delete/pdf/:id', (req, res) => {

        pdfCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => res.send(result))
    })

    /* 
    -----------------
    Auth
    -----------------
    */

    // Login for Admin
    app.post('/backend/api/v1/admin/login', (req, res) => {

        let email = req.body.email
        let password = req.body.password
        let code = req.body.code

        adminCollection.find({ email, password, code })

            .toArray((err, result) => {
                if (err) {
                    res.send(err)
                } else if (result.length) {
                    const token = jwt.sign({
                        email,
                        password,
                        code
                    }, process.env.JWT_SECRET)
                    res.status(200).json({
                        "access_token": token
                    })
                } else res.status(401).json({
                    "error": "Authentication failed!"
                })
            })
    })

    // Login for Moderator
    app.post('/backend/api/v1/moderator/login', (req, res) => {

        let email = req.body.email
        let password = req.body.password

        moderatorCollection.find({ email, password })

            .toArray((err, result) => {
                if (err) {
                    res.send(err)
                } else if (result.length) {
                    const token = jwt.sign({
                        email,
                        password
                    }, process.env.JWT_SECRET)
                    res.status(200).json({
                        "access_token": token,
                        "hash": process.env.JWT_SECRET
                    })
                } else res.status(401).json({
                    "error": "Authentication failed!"
                })
            })
    })

    // Increase a post number by moderator
    app.get('/backend/api/v1/moderator/:id/post/:title', (req, res) => {
        let title = req.params.title
        let id = req.params.id

        moderatorCollection.findOneAndUpdate({ email: id }, {
            $push: { post: title }
        })
            .then(result => res.sendStatus(200))
            .catch(err => res.send(err.message))

    })
    // Get a specific moderator's data
    app.get('/backend/api/v1/moderator/:id', (req, res) => {
        let id = req.params.id

        moderatorCollection.find({ email: id })
            .toArray((err, result) => {
                res.status(200).json({
                    email: result[0].email,
                    posts: result[0].post
                })
            })
    })
    // Get all moderator's data
    app.get('/backend/api/v1/moderators', (req, res) => {
        moderatorCollection.find()
            .toArray((err, result) => res.send(result))
    })

    /* 
    -----------------
    Report
    -----------------
    */
    // Create a Comment Report 
    app.post('/backend/api/v1/report/comment', (req, res) => {
        const report = {
            id: req.body.id,
            comment: req.body.comment
        }

        reportCollection.insertOne(report)
            .then((err, result) => err ? res.send(err) : res.send(result.insertedCount))
    })

    // Get all the Comment Reports
    app.get('/backend/api/v1/report/comments', (req, res) => {
        reportCollection.find()
            .toArray((err, result) => res.send(result))
    })

    // Delete a Comment Report
    app.delete('/backend/api/v1/delete/report/:id', (req, res) => {
        reportCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => res.send(result))
    })

    /* 
    -----------------
    Dua
    -----------------
    */

    // Get all dua
    app.get('/backend/api/v1/dua', (req, res) => {
        duaCollection.find()
            .toArray((err, result) => res.send(result))
    })
    // Get all dua name
    app.get('/backend/api/v1/duaname', (req, res) => {
        duaNameCollection.find()
            .toArray((err, result) => res.send(result))
    })

})

app.listen(PORT, () => console.log(`Server is Listening on port ${PORT}`))