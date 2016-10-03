
$(document).one("pagecreate", "#viewPhonebook", function(){
    
    $("#viewPhonebook").pagecontainer({
        create: function(event, ui) {
            console.log("----pagecreate----Phonebook");
            
            $("#viewPhonebook").on("pageshow", function(event, ui){
                console.log("show----Phonebook");
            });
        }
    });
    
});
