const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://65c38d057f27343158794388--moonlit-marzipan-acf997.netlify.app",
      "https://moonlit-marzipan-acf997.netlify.app",
    ],
  })
);
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
    // await client.connect();
    const database = client.db("TheGrandBonjour");
    const homePageImgCollection = database.collection("HomePageImg");
    const testimonialCollection = database.collection("Testimonials");
    const roomsCollection = database.collection("Rooms");
    const bookedRoomsCollection = database.collection("bookedRooms");
    const reviewsCollection = database.collection("reviews");

    // Get Home page images
    app.get("/homeImg", async (req, res) => {
      const cursor = homePageImgCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get testimonials data
    app.get("/testimonials", async (req, res) => {
      const cursor = testimonialCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get the rooms data
    app.get("/rooms", async (req, res) => {
      const cursor = roomsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get specific room data
    app.get("/roomDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.findOne(query);
      res.send(result);
    });

    // post Booked rooms data
    app.post("/bookedRoom", async (req, res) => {
      const bookedRoom = req.body;
      const result = await bookedRoomsCollection.insertOne(bookedRoom);
      res.send(result);
    });

    // read booked room data
    app.get("/bookedRoom", async (req, res) => {
      const cursor = bookedRoomsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read single booked room
    app.get("/bookedRoom/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookedRoomsCollection.findOne(query);
      res.send(result);
    });

    // delete single booked data
    app.delete("/bookedRoom/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookedRoomsCollection.deleteOne(query);
      res.send(result);
    });

    // post client reviews
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await reviewsCollection.insertOne(reviews);
      res.send(result);
    });

    // Read reviews data
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
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
