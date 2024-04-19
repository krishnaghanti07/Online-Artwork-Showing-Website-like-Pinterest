var express = require('express');
var router = express.Router();
const userModel = require("./users") ;
const postModel = require("./post") ;
const passport = require('passport');
const localStratagy = require('passport-local') ;
const upload = require('./multer') ;

passport.use(new localStratagy(userModel.authenticate())) ;

router.get('/', function(req, res, next) {
  res.render('index' , {nav: false});
});

router.get('/register', function(req, res, next) {
  res.render("register" , {nav: false}) ;
});

router.get('/profile', isLoggedIn , async function(req, res, next) {
  const user = 
  await userModel
        .findOne({username: req.session.passport.user}) // to find the particular "user" , who is "logged-in" now
        .populate("posts") // all the posts will come out as real data
  res.render("profile" , {user , nav: true}) ; // Passing the "User's Data"
});

router.get('/show/posts', isLoggedIn , async function(req, res, next) {
  const user = 
  await userModel
        .findOne({username: req.session.passport.user}) // to find the particular "user" , who is "logged-in" now
        .populate("posts") // all the posts will come out as real data
  res.render("show" , {user , nav: true}) ; // Passing the "User's Data"
});

router.get('/feed', isLoggedIn , async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user}); // to find the particular "user" , who is "logged-in" now
  // postModel.find().limit(25) ;  // Limiting that maximum 25 posts will be shown (if there is too many posts) //(Pagination)
  const posts = await postModel.find() 
  .populate("user")

  res.render("feed" , {user , posts , nav: true}) ; // Passing the "User's Data" and "Post's data"
});

router.get('/add', isLoggedIn , async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user}); // to find the particular "user" , who is "logged-in" now
  res.render("add" , {user , nav: true}) ; // Passing the "User's Data"
});

router.post('/createpost', isLoggedIn , upload.single("postimage") , async function(req, res, next) {  // used to upload the "image"
  const user = await userModel.findOne({username: req.session.passport.user}); // to find the particular "user" , who is "logged-in" now
  // res.render("add" , {user , nav: true}) ; // Passing the "User's Data"
  const post = await postModel.create({  // to create the "Post"
    user: user._id , // passing the "user-id" to the "User"  //(Posts getting know about who is it's user)
    title: req.body.title ,
    description: req.body.description ,
    image: req.file.filename ,
  }) ;

  user.posts.push(post._id); // pushing post's id into the "User-Model"  //(user getting know about the posts created by himself)
  await user.save() ;
  res.redirect("/profile") ;
});

router.post('/fileupload', isLoggedIn , upload.single("image") , async function(req, res, next) { // First checking "is-Loggedin" or not , then- upload the image , next- start the "route" / "callback"
  const user = await userModel.findOne({username: req.session.passport.user}); // to find the particular "user" , who is "logged-in" now
  user.profileImage = req.file.filename ; // the name of the "Uploaded-File" save in the "Profile-Image" of the "Logged-in-user"
  await user.save() ; //Saving the "user-data" Manually
  res.redirect("/profile");  // Redirected to the "Profile" route after  saving successfully
});

router.post('/register', function(req, res, next) {
  const data = new userModel({
    // user.js : inputs of form in register.ejs
    username: req.body.username ,
    email: req.body.email ,
    contact: req.body.contact ,
    name: req.body.fullname
  })

  userModel.register(data , req.body.password) // gives us a "Promises"
  .then(function() {
    passport.authenticate("local") (req , res , function() {
      res.redirect("/profile") ;
    })
  })
});

router.post('/login', passport.authenticate("local" , {
  failureRedirect: "/" ,
  successRedirect: "/profile" ,
}) , function(req, res, next) {
});

router.get("/logout" , function(req , res , next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}) ;

function isLoggedIn (req , res , next) {
  if (req.isAuthenticated()) {
    return next() ;
  }
  res.redirect("/") ;
}

module.exports = router;
