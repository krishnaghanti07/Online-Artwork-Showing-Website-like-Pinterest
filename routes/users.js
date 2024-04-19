const mongoose = require('mongoose') ;
const plm = require("passport-local-mongoose") ;

mongoose.connect("mongodb://127.0.0.1:27017/pinterest") ;

const userSchema = mongoose.Schema({
  username: String ,
  name: String ,
  email: String ,
  password: String ,
  profileImage: String ,
  contact: Number ,
  boards: {
    type: Array ,
    default: []
  } ,
  posts: [  // Each "User" will have the information of "All the Posts" it has created
    { // (Array of "id's")
      type: mongoose.Schema.Types.ObjectId ,
      ref: "post" // refering the "id's" of "Posts" belongs from the "Post-Model"
    }
  ]
}) ;

userSchema.plugin(plm) ; // We're Providing "Passport" , "serialise-user" && "de-Serialise-user"

module.exports = mongoose.model("user" , userSchema) ;