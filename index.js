const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// midaleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.COFFEE_STORE_DB}:${process.env.COFFEE_STORE_PASS}@cluster0.aqrtdqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeCollection = client.db('coffeeStoreDB').collection('coffee')

    app.post('/coffee', async (req, res) => {
        const coffee = req.body;
        console.log(coffee);
        const result = await coffeCollection.insertOne(coffee)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send('Coffee store server is running');
})
app.listen(port, () => {
    console.log(`Running coffee store server on this ${port}`)
})

