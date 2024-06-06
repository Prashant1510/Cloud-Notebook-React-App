const mongoose = require('mongoose');
const NotesSchema = new mongoose.Schema({    //It is the schema for creating notes and require parameters
    user:{
        type: mongoose.Schema.Types.ObjectId,
        reff: 'user'
    },
    title:{
        type: String,
        required: true 
    },
    description:{
        type: String,
        required: true,
    },
    tag:{
        type: String,
        default: "General"
    },
    data:{
        type: Date,
        default: Date.now 
    }
  });
  module.exports = mongoose.model('notes',NotesSchema);