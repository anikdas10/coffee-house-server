const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { configDotenv } = require('dotenv');

const app = express();

const port = process.env.PORT || 5000;

// Middlewire

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5lvtm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    app.get('/coffee', async(req, res) => {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });
    // update
    app.get("/coffee/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });
    app.post("/coffee", async(req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.put('/coffee/:id', async(req, res) => {
        const id =req.params.id;
        const filter = {_id:new ObjectId(id)};
        const options = { upsert: true };
        const updateCoffee = req.body;
        const coffee = {
          $set: {
            name:updateCoffee.name,
            quantity:updateCoffee.quantity,
            supplier:updateCoffee.supplier,
            taste:updateCoffee.taste,
            category:updateCoffee.category,
            details:updateCoffee.details,
            photoURL:updateCoffee.photoURL,
          },
        };
        const result = await coffeeCollection.updateOne(filter,coffee,options);
        res.send(result)

    });

    app.delete('/coffee/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);

    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
 
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {

    res.send("Coffee making server is running ");
});


app.listen(port, () => {
    console.log(`Server running on port ${port} `);
});


