$(document).one("pagebeforecreate", function(){
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
});

$(document).one("pagecreate", "#viewHitRate", function(){

    $("#viewHitRate").pagecontainer({
        create: function(event, ui) {
        }
    });

});