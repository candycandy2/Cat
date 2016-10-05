
$(document).one("pagecreate", "#viewInitial1-1", function(){
    
    $("#viewInitial1-1").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function checkAppVersion() {
                
                var self = this;
                
                this.successCallback = function(data) {
                    
                    loadingMask("hide");
                    
                    var resultcode = data['result_code'];
                    
                    if (resultcode == 1)
                    {
                        //alert("need to update");
                        alert(data['message']);

                        // do update process
                        // .....

                        // for testing
                        //doLoginFunction();
                    }
                    else if (resultcode == 000913)
                    {
                        //alert("up to date");
                        alert(data['message']);

                        //doLoginFunction();
                    }
                    
                };
                
                this.failCallback = function(data) {};
                
                var __construct = function() {
                    apiCheckAppVersion(self.successCallback, self.failCallback, "android", "1");
                }();
            }

            /********************************** page event *************************************/
            $("#viewInitial1-1").one("pagebeforeshow", function(event, ui) {
            
            });

            $("#viewInitial1-1").one("pageshow", function(event, ui) {
                loadingMask("show");
                setTimeout(function(){
                    checkAppVersion();
                    
                }, 3000);
            });

            /********************************** dom event *************************************/
        }
    });

});