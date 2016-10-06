
$(document).one("pagecreate", "#viewInitial1-1", function(){
    
    $("#viewInitial1-1").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function doLogin() {
                var args = [];
                args[0] = "initialSuccess"; //登入成功後調用的 call back function name, set in APP's index.js
                args[1] = device.uuid; //uuid
                window.plugins.qlogin.openCertificationPage(null, null, args);
            }
            
            function checkAppVersion() {
                
                var self = this;
                
                this.successCallback = function(data) {
                    
                    loadingMask("hide");
                    
                    var resultcode = data['result_code'];
                    
                    if (resultcode == 1)
                    {
                        //alert("need to update");
                        //alert(data['message']);

                        // do update process
                        // .....

                        // for testing
                        doLogin();
                    }
                    else if (resultcode == 000913)
                    {
                        //alert("up to date");
                        //alert(data['message']);

                        doLogin();
                    }
                    
                };
                
                this.failCallback = function(data) {};
                
                var __construct = function() {
                    
                    // fix me !!! need to get device type and app version
                    apiCheckAppVersion(self.successCallback, self.failCallback, "android", "1");
                }();
            }

            /********************************** page event *************************************/
            $("#viewInitial1-1").one("pagebeforeshow", function(event, ui) {
            
            });

            $("#viewInitial1-1").one("pageshow", function(event, ui) {
                
                setTimeout(function(){
                    checkAppVersion();
                    loadingMask("show");
                }, 2000);
            });

            /********************************** dom event *************************************/
        }
    });

});