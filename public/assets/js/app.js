$(document).ready(function(){

console.log("We are in app.JS-------");


$(".saveArticle").click(function(){
console.log("---------"+"button has been clicked"+"------------");

// stuck here need to grab values from buttons
    var thisTitle = $(this).attr("data-title");
    var thisLink = $(this).attr("data-link");
console.log("This is the Title: " + thisTitle);
console.log("This is the Link: " + thisLink);

    $.ajax({
        method: "POST",
        url: "/myarticles",
        data: {
          // Value taken from title input
          title: thisTitle,
          // Value taken from note textarea
          link: thisLink
        }
      })    
})


});