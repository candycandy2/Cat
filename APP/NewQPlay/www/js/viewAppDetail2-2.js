
$(document).one("pagecreate", "#viewAppDetail2-2", function(){
    
    $("#viewAppDetail2-2").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
 
            function QueryAppDetail() {
                var self = this;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];
                    
                    if (resultcode == 1) {

                    } // if (resultcode == 1)
                    else {
                        
                    }
                }; 

                this.failCallback = function(data) {};

                var __construct = function() {
                    
                }();
            }

            /********************************** page event *************************************/
            $("#viewAppDetail2-2").on("pagebeforeshow", function(event, ui) {
                console.log("QueryAppDetail");
                QueryAppDetail();
            });

            $("#viewAppDetail2-2").one("pageshow", function(event, ui) {

            });

            /********************************** dom event *************************************/
        }
    });

});