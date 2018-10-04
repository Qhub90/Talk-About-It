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

          db.Article.create(result)
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

    db.Article.find({})
          .then(function(data){
              res.render("scraped", {Articles : data})
          })
          .catch(function(err){
              res.json(err);
          });
});

app.post("/myarticles", function(req, res){
    db.MyArticles.create(results)
    .then(function(data){
        console.log("-------85" + data+"---------")
    })
    .catch(function(err){
        return res.json(err);
    })

})


// I changed the one above
app.get("/MyArticles", function(req, res){
    
    db.MyArticle.find({})
          .then(function(data){
              res.render("", {Articles : data})
          })
          .catch(function(err){
              res.json(err);
          });
})









// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  