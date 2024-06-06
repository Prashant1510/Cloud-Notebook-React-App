const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/"  //to establish a connection between a client application and a MongoDB database.

const connectToMongo = () =>{
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(mongoURI);
        console.log("Connected to Mongo Successfully!");
      } catch (error) {
        console.log(error);
      }
}
module.exports = connectToMongo