const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    studentName:{
      type:String,
      required:true,
      trim:true
    },

    courseName:{
      type:String,
      required:true,
      trim:true
    },

    message:{
      type:String,
      required:true,
      trim:true
    },

    rating:{
      type:Number,
      required:true,
      min:1,
      max:5
    },

    status:{
      type: String,
      enum: ['Pending', 'Reviewed'],
      default: 'Pending'
    }
});

const Feed = mongoose.model('Feedback', feedbackSchema);
module.exports = Feed;