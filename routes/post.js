const mongoose = require('mongoose') ;

// mongoose.connect("mongodb://127.0.0.1:27017/pinterest") ;  (we've connect only Once)

const postSchema = mongoose.Schema({
  user: { // Each post will have information about it's "User" , who created this "post"
    type: mongoose.Schema.Types.ObjectId , // Every "Post" will have a "user-id" , who creates it
    ref: "user"  // This "id" belongs to which model
  } ,
  title: String ,
  description: String ,
  image: String 
}) ;

module.exports = mongoose.model("post" , postSchema) ;