const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.86h0qhu.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("TheGrandBonjour");
    const homePageImgCollection = database.collection("HomePageImg");
    const testimonialCollection = database.collection("Testimonials");

    // Get Home page images
    app.get("/homeImg", async (req, res) => {
      const cursor = homePageImgCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get testimonials data
    app.get("/testimonials", async(req, res) => {
        const cursor = testimonialCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hotel server running");
});

app.listen(port, () => {
  console.log(`Hotel server is running on port: ${port}`);
});