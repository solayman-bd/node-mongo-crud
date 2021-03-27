const express = require("express");
const app = express();
const ObjectID = require("mongodb").ObjectID;

app.use(express.json());
app.use(express.urlencoded());

const password = "FUiv3ey9Fxv9D5-";
const userName = "node-mongo-crud";

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://node-mongo-crud:FUiv3ey9Fxv9D5-@cluster0.jzyej.mongodb.net/node-mongo-crud?retryWrites=true&w=majority";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("node-mongo-crud").collection("products");

  // app.get("/products", (req, res) => {
  //   collection.find({}).limit(4).toArray((err, document) => {
  //     res.send(document);
  //   });
  // });
  app.get("/products", (req, res) => {
    collection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product);
    collection
      .insertOne(product)
      .then((result) => console.log("data added successfully"));
    res.redirect("/");
  });
  app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({ _id: ObjectID(req.params.id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
  app.patch("/update/:id", (req, res) => {
    collection
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
  app.get("/products/:id", (req, res) => {
    collection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });
});

app.listen(3000);
