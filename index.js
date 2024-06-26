const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const userCollection = client.db('coffeeStoreDB').collection('users')
        app.get('/coffee', async (req, res) => {
            const result = await coffeCollection.find().toArray();
            res.send(result)
        })
        app.post('/coffee', async (req, res) => {
            const coffee = req.body;
            console.log(coffee);
            const result = await coffeCollection.insertOne(coffee)
            res.send(result)
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const qury = {
                _id: new ObjectId(id)
            }
            const result = await coffeCollection.findOne(qury);
            res.send(result)
        })
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const updateCoffee = req.body;
            const options = { upsert: true };
            const filter = {
                _id: new ObjectId(id)
            };
            const coffee = {
                $set: {
                    coffeeName: updateCoffee.coffeeName,
                    coffeeChef: updateCoffee.coffeeChef,
                    coffeeSupplier: updateCoffee.coffeeSupplier,
                    coffeeTaste: updateCoffee.coffeeTaste,
                    coffeeCategory: updateCoffee.coffeeCategory,
                    coffeeDetails: updateCoffee.coffeeDetails,
                    coffeePhoto: updateCoffee.coffeePhoto,
                    coffeePrice: updateCoffee.coffeePrice
                }
            };
            const result = await coffeCollection.updateOne(filter, coffee, options);
            res.send(result)
        })
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const qury = {
                _id: new ObjectId(id)
            }
            const result = await coffeCollection.deleteOne(qury);
            res.send(result)
        })
        // user collection in the coffe store
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        app.patch('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email}
            const updateDoc = {
                $set: {
                    lastLoggedAt: user.lastLoggedAt,
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result)
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const qury = {
                _id: new ObjectId(id),
            };
            const result = await userCollection.deleteOne(qury);
            res.send(result);
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

