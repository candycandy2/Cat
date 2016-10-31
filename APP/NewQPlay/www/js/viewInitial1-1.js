
$(document).one("pagecreate", "#viewInitial1-1", function(){
    
    $("#viewInitial1-1").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            window.checkAppVersion = function() {
                var self = this;
                
                this.successCallback = function(data) {
                    loadingMask("hide");
                    loginData['callCheckAPPVer'] = false;
                    
                    var resultcode = data['result_code'];

                    if (resultcode == 1) // need to update app
                    {
                        // do update process
                        // .....

                        // for testing
                        if (getDataFromServer) {
                            getServerData();
                        } else {

                            getMessageList();

                            if (loginData["openMessage"] === true) {
                                $.mobile.changePage("#viewWebNews2-3-1");
                            } else {
                                loginData["openMessage"] = true;
                                $.mobile.changePage('#viewMain2-1');
                            }
                        }
                    }
                    else if (resultcode == 000913) // app is up to date
                    {
                        if (getDataFromServer) {
                            getServerData();
                        } else {

                            getMessageList();

                            if (loginData["openMessage"] === true) {
                                $.mobile.changePage("#viewWebNews2-3-1");
                            } else {
                                loginData["openMessage"] = true;
                                $.mobile.changePage('#viewMain2-1');
                            }
                        }
                    }
                    else
                    {

                    }
                    
                };
                
                this.failCallback = function(data)
                {
                    loadingMask("hide");
                };
                
                var __construct = function() {
                    apiCheckAppVersion(self.successCallback, self.failCallback, device.platform, "1");
                }();
            }

            /********************************** page event *************************************/
            $("#viewInitial1-1").one("pagebeforeshow", function(event, ui) {
            
            });

            $("#viewInitial1-1").one("pageshow", function(event, ui) {
                
            });

            /********************************** dom event *************************************/
        }
    });

});