var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs  = require('express-handlebars');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3001;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/Talkdb");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Talkdb";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// At the root scrape the data from website

app.get("/", function(req, res){

    res.render("index")

  axios.get("http://www.chicagotribune.com/news/local/politics/").then(function(response){

    var $ = cheerio.load(response.data);

    $("li h3").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

          db.Articles.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log("-------Line 59 " + dbArticle + "------");
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          }) 
        });

  });

})

app.get("/articles", function(req, res){

    db.Articles.find({})
          .then(function(data){
              res.render("index", {Articles : data})
          })
          .catch(function(err){
              res.json(err);
          });
});




// I changed the one above
app.get("/articles/:id", function(req, res){
    
    db.Articles.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })

   
})

app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        console.log("-------")
        return db.Articles.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  app.post("/comments/:id", function(req, res){
      console.log("-----WE are Deleting-----")
    // db.Comment.findByIdAndDelete({_id: req.params.id})
    console.log(req.params.id)
    db.Comment.findByIdAndDelete(req.params.id)
    .then(function(err, data) {        
        if(err) {
            return err;
        }

        console.log(data)
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(data);
    })

   
})





// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  