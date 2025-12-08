//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { application } = require("express");
const mongoose = require("mongoose");
require("dotenv").config();


const db_password = process.env.DB_PASSWORD;


const app = express();
app.locals._ = _

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://webmanage:" + db_password + "@events.1rpsho3.mongodb.net/?appName=Events", { useNewUrlParser: true });


const eventSchema = {
  eventDescription: String,
  eventImage: Number,
  eventLink: String,
  eventStart: String,
  eventEnd: String,
  eventLocation: String,
  eventTitle: String,
}


const Post = mongoose.model("events", eventSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    console.log(posts);
    res.render("home", { homeStartingContent: homeStartingContent, posts: posts });
  })
})

app.get("/about", (req, res) => {
  res.render('about')
})

app.get("/contact", (req, res) => {
  res.render('contact', { contactContent: contactContent })
})

app.get("/compose", (req, res) => {
  res.render('compose')
})

app.post("/compose", (req, res) => {
  //{postTitle: req.body.postTitle, postBody: req.body.postBody}
  const post = new Post({
    eventTitle: req.body.eventTitle,
    eventDescription: req.body.eventDescription,
    eventImage: req.body.eventImage,
    eventLink: req.body.eventLink,
    eventStart: req.body.eventStart,
    eventEnd: req.body.eventEnd,
    eventLocation: req.body.eventLocation
  })
  post.save(err => {
    if (!err) {
      res.redirect("/");
    }
  });
})

app.get("/posts/:postId", (req, res) => {
  const requestedId = _.toString(req.params.postId);
  Post.findOne({ _id: requestedId }, (err, post) => {
    console.log(post);
    res.render('post', { post: post })
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
