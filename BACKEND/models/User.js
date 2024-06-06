const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({   // It is the schema for creating the user and the require parameter to be a users
    name:{
        type: String,
        required: true 
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true 
    },
    data:{
        type: Date,
        default: Date.now 
    }
  });
  module.exports = mongoose.model('user',UserSchema);