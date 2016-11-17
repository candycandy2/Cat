
$(document).one("pagecreate", "#viewInitial1-1", function(){
    
    $("#viewInitial1-1").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            window.checkAppVersion = function() {
                var self = this;
                
                this.successCallback = function(data) {
                    loadingMask("hide");
                    loginData['callCheckAPPVer'] = false;
                    
                    var resultSuccess = false;
                    var resultcode = data['result_code'];

                    if (resultcode == 1) // need to update app
                    {
                        // do update process
                        resultSuccess = true;
                    }
                    else if (resultcode == 000913) // app is up to date
                    {
                        resultSuccess = true;
                    }
                    else
                    {

                    }

                    if (resultSuccess) {
                        if (getDataFromServer) {
                            getServerData();
                        } else {
                            var doReNewToken = new reNewToken();
                        }
                    }
                };
                
                this.failCallback = function(data)
                {
                    loadingMask("hide");
                };
                
                var __construct = function() {
                    apiCheckAppVersion(self.successCallback, self.failCallback, device.platform, loginData["versionCode"]);
                }();
            }

            function reNewToken() {
                var self = this;

                this.successCallback = function(data) {
                    var resultSuccess = false;
                    var resultcode = data['result_code'];

                    if (resultcode == 1) {
                        loginData["token"] = data['content'].token;
                        loginData["token_valid"] = data['content'].token_valid;

                        window.localStorage.setItem("token", data['content'].token);
                        window.localStorage.setItem("token_valid", data['content'].token_valid);

                        getMessageList();

                        if (loginData['doLoginDataCallBack'] === true) {
                            getLoginDataCallBack();
                        } else {
                            if (window.localStorage.getItem("openMessage") === "true") {
                                $.mobile.changePage("#viewWebNews2-3-1");
                            } else {
                                window.localStorage.getItem("openMessage") === "false";
                                loginData["openMessage"] = false;

                                $.mobile.changePage('#viewMain2-1');
                            }
                        }

                    } else {
                        //other case
                    }
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "renewToken", self.successCallback, self.failCallback, null, null);
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