//jshint esversion:6


import express, { request } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

mongoose.connect(process.env.mongo_server, {
  user: process.env.mongo_login, 
  pass: process.env.mongo_password
});

// schema of each document in the collection
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// create collection if it does not exist
const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "This is hard coded post as a starting content so that the blog does not look too empty!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", async function(req, res){
  let posts = [];
  try {
    posts = await Post.find({}); // get all posts
  }catch(err) {
    console.log("Error loading posts: "+ err);
  }

  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save();
  }
  catch(err) {
    console.log("Error saving post: "+err);
  }

  return res.redirect("/");

});

app.get("/posts/:postID", async function(req, res){
  let post = undefined;

  try {
    post = await Post.findOne({_id: req.params.postID});
  }catch(err){
    console.log("Error loading post from database: "+err);
  }

  return res.render("post", {
    title: post.title,
    content: post.content
  });

});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
