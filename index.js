const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database.1n8y8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db(`${process.env.DB_NAME}`).collection("events");
    console.log("Connected to database");

    app.get('/events', (req, res) => {
        eventCollection.find({})
            .toArray((err, events) => {
                res.send(events);
            })
    })

    app.post('/addEvent', (req, res) => {
        eventCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })
});

app.listen(port)