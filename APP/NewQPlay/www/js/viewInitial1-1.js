
$(document).one("pagecreate", "#viewInitial1-1", function(){
    
    $("#viewInitial1-1").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            window.checkAppVersion = function() {
                var self = this;
                var queryStr = "&package_name=com.qplay." + appKey + "&device_type=" + device.platform + "&version_code=" + loginData["versionCode"];
                
                this.successCallback = function(data) {
                    loadingMask("hide");
                    loginData['callCheckAPPVer'] = false;
                    
                    var resultSuccess = false;
                    var resultcode = data['result_code'];

                    if (resultcode == 1) {
                        // need to update app
                        resultSuccess = true;
                    } else if (resultcode == 000913) {
                        // app is up to date
                        resultSuccess = true;
                    } else {

                    }

                    if (resultSuccess) {
                        if (getDataFromServer) {
                            getServerData();
                        } else {

                            getMessageList();

                            if (loginData['doLoginDataCallBack'] === true) {
                                getLoginDataCallBack();
                            } else {
                                if (window.localStorage.getItem("openMessage") === "true") {
                                    $.mobile.changePage("#viewWebNews2-3-1");
                                } else {
                                    $.mobile.changePage('#viewMain2-1');
                                }
                            }
                        }
                    }
                };

                this.failCallback = function(data) {
                    loadingMask("hide");
                };

                var __construct = function() {
                    QPlayAPI("GET", "checkAppVersion", self.successCallback, self.failCallback, null, queryStr);
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