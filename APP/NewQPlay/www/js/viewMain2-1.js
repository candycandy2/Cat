
$(document).one("pagecreate", "#viewMain2-1", function(){
    
    $("#viewMain2-1").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function QueryAppList() {
                var self = this;

                this.successCallback = function(data) {

                }; 

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("GET", "getAppList", self.successCallback, self.failCallback);
                }();

            }

            /********************************** page event *************************************/
            $("#viewMain2-1").one("pagebeforeshow", function(event, ui) {
                QueryAppList();
            });

            $("#viewMain2-1").one("pageshow", function(event, ui) {

            });

            /********************************** dom event *************************************/
        }
    });

});