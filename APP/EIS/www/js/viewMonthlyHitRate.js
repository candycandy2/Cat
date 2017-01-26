$(document).one("pagebeforecreate", function(){
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
});

$(document).one("pagecreate", "#viewMonthlyHitRate", function(){

    $("#viewMonthlyHitRate").pagecontainer({
        create: function(event, ui) {       
        }
    });
});
