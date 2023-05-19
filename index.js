const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// All the middleware
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uhsxkqi.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollection = client.db('toyBikroy').collection('toys');
   

    // toy insert data
    app.post("/toys", async(req, res)=> {
        const toyData = req.body;
        console.log(toyData);
        const result = await toyCollection.insertOne(toyData)
        res.send(result)
    });

    // get all the toys data api
    app.get("/toys", async(req, res)=> {
        const toysData = await toyCollection.find().toArray();
        res.send(toysData)
    })

    // data get by email query api
    app.get("/myToys", async (req, res)=> {
        const queryEmail = req.query.email;
        console.log(queryEmail)
        const filter = { sellerEmail: queryEmail}
        const result = await toyCollection.find(filter).toArray();
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



app.get("/", (req, res)=>{
    res.send('ToyBikroy server connected');
})

app.listen(port, ()=> {
    console.log(`ToyBikroy server connected on ${port}`);
})