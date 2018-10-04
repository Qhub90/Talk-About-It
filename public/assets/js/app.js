$(document).ready(function(){

console.log("We are in app.JS-------");


$(".saveArticle").click(function(){
console.log("---------"+"button has been clicked"+"------------");
    var thisTitle = $.parseJSON($(this).attr("data-title").val());
    var thisLink = $.parseJSON($(this).attr("data-link").val());
console.log("This is the Title" + thisTitle);
console.log("This is the Link" + thisLink);

    $.ajax({
        method: "POST",
        url: "/MyArticles",
        data: {
          // Value taken from title input
          title: thisTitle,
          // Value taken from note textarea
          link: thisLink
        }
      })    
})


});