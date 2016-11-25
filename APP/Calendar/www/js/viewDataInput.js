$(document).one("pagecreate", "#viewDataInput", function() {

    $("#menu").on("click", function() {
        $("#img1").attr("src","img/2016_meal_1121-1.png");
        $("#img2").attr("src","img/2016_meal_1121-2.png");
    });

    $("#calendar").on("click", function() {
        $("#img1").attr("src","img/2016.png");
        $("#img2").attr("src","img/");
    });

});
