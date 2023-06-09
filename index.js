const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const corsConfig = {
    origin: '*',
    Credentials: true,
    method: ["GET", "POST", "PUT","PATCH", "DELETE"]
}
// All the middleware
app.use(cors(corsConfig))
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
    // await client.connect();

    const toyCollection = client.db('toyBikroy').collection('toys');
   
    // get all the toys data api
    app.get("/toys", async(req, res)=> {
        const toysData = await toyCollection.find().limit(20).toArray();
        res.send(toysData)
    });

    // data get by _id query api
    app.get("/toys/:toyName", async (req, res)=> {
        const sToyName =req.params.toyName;
        const filter = { toyName: sToyName}
        const result = await toyCollection.find(filter).toArray();
        res.send(result);
    });

    // toy insert data
    app.post("/toys", async(req, res)=> {
        const toyData = req.body;
        const result = await toyCollection.insertOne(toyData)
        res.send(result)
    });

    

    // data get by email query api
    app.get("/myToys", async (req, res)=> {
        const queryEmail = req.query.email;
        const filterMethod = req.query.filter;
        
        
        let filterProcess= filterMethod ? { toyPrice: parseInt(filterMethod)}: {};
       
        const queryByEmail = { sellerEmail: queryEmail}
        const result = await toyCollection.find(queryByEmail).sort(filterProcess).toArray();
        res.send(result);
    });



    // data get by _id query api
    app.get("/toyDetails/:id", async (req, res)=> {
        const id =req.params.id;
        const filter = { _id: new ObjectId(id)}
        const result = await toyCollection.find(filter).toArray();
        res.send(result);
    });

    // data update by _id query api
    app.patch("/updateToy/:id", async (req, res)=> {
        const id =req.params.id;
        const data = req.body;
        const filter = { _id: new ObjectId(id)}

        console.log(data)
        const updateToyData = {
            $set: {
                toyPrice: data.toyPrice,
                availableQuantity: data.availableQuantity,
                toyDetails: data.toyDetails,
            },
          };

        const result = await toyCollection.updateOne(filter, updateToyData);
        res.send(data);
    });

      // data delete by _id query api
      app.delete("/myToys/:id", async (req, res)=> {
        const id =req.params.id;
        const filter = { _id: new ObjectId(id)}
        const result = await toyCollection.deleteOne(filter);
        res.send(result);
    });


    // data get by sub_category query api
    // app.get("/subCategory", async (req, res)=> {
    //     const querySubCategory = req.query.subCategory;
    //     console.log(querySubCategory);

    //     const filter = { toyCategory: querySubCategory}
    //     console.log(filter)
    //     const result = await toyCollection.find(filter).toArray();
    //     res.send(result);
    // });



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