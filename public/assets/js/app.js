$(document).ready(function(){

console.log("We are in app.JS-------");


$(".comment").click(function(){
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("data-id");
      
        // Now make an ajax call for the Article
        $.ajax({
          method: "GET",
          url: "/articles/" + thisId
        })
          // With that done, add the note information to the page
          .then(function(data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      
            // If there's a note in the article
            if (data.comment) {
              // Place the title of the note in the title input
              $("#titleinput").val(data.comment.title);
              // Place the body of the note in the body textarea
              $("#bodyinput").val(data.comment.body);
              $("#notes").append("<button data-id='" + data.comment._id + "' id='delete'>Delete comment</button>");
            }
          });
      });


})


$(document).on("click", "#savenote", function() {
    console.log("---------"+"save button has been clicked"+"------------");

// stuck here need to grab values from buttons
var thisId = $(this).attr("data-id");

// Run a POST request to change the note, using what's entered in the inputs
$.ajax({
  method: "POST",
  url: "/articles/" + thisId,
  data: {
    // Value taken from title input
    title: $("#titleinput").val(),
    // Value taken from note textarea
    body: $("#bodyinput").val()
  }
})
  // With that done
  .then(function(data) {
    // Log the response
    console.log(data);
    // Empty the notes section
    $("#notes").empty();
  }); 
  
  $("#titleinput").val("");
  $("#bodyinput").val("");
})

$(document).on("click", "#delete", function() {
    console.log("---------"+"delete button has been clicked"+"------------");

// stuck here need to grab values from buttons
var thisId = $(this).attr("data-id");

// Run a POST request to change the note, using what's entered in the inputs
$.ajax({
  method: "Post",
  url: "/comments/" + thisId,
  
})
.then(function(data){
    console.log("======", data,"===========")
})
});

