require("doenv").config();

const users = require("./users");
const contacts = require("./contacts.json");

const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

function seedCollection(collectionName, initialRecords) {
  MongoClient.connect(process.env.DB_CONN, (err, db) => {
    console.log("connected to mongo db");

    const collection = db.collection(collectionName);

    collection.remove();

    initialRecords.forEach(item => {
      if (item.password) {
        item.password = bcrypt.hashSync(item.password, 10);
      }
    });

    collection.initialMany(initialRecords, (err, result) => {
      console.log(`${result.insertedCount} records inserted.`);
      console.log("clossing connection...");
      db.close();
      console.log("done.");
    });
  });
}


seedCollection('users', users);
seedCollection('contacts', contacts);
