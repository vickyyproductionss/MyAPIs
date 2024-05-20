const Support = require("../models/support");
const { MongoClient } = require('mongodb');

async function handleGetServer(req, res) {
    const uri = process.env.MONGO_URI; // Replace with your MongoDB connection string
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      await client.connect();
      
      const database = client.db('MetamaskGames'); // Replace with your database name
      const collection = database.collection('Support'); // Replace with your collection name
      
      const latestDocument = await collection.find().sort({ _id: -1 }).limit(1).toArray();
  
      if (latestDocument.length > 0) {
        return res.status(200).json({ msg: "success", document: latestDocument[0] });
      } else {
        return res.status(404).json({ msg: "No documents found" });
      }
    } catch (error) {
      console.error("Error retrieving document: ", error);
      return res.status(500).json({ msg: "Server error" });
    } finally {
      // Ensure the client will close when you finish/error
      await client.close();
    }
}

async function handleSetServer(req, res) {
  const uri = process.env.MONGO_URI; // Replace with your MongoDB connection string
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const database = client.db("MetamaskGames"); // Replace with your database name
    const collection = database.collection("Support"); // Replace with your collection name

    const query = req.query;
    const result = await collection.insertOne({
      message: query.serverMessage,
      serverStatus: query.serverStatus,
    });

    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    return res.status(201).json({ msg: "success", id: result.insertedId });
  } catch (error) {
    console.error("Error inserting document: ", error);
    return res.status(500).json({ msg: "Server error" });
  } finally {
    // Ensure the client will close when you finish/error
    await client.close();
  }
}

module.exports = {
  handleGetServer,
  handleSetServer,
};
