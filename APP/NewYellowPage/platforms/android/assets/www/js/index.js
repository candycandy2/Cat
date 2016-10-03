
/*global variable*/

var pageList = ["viewDataInput", "viewQueryResult", "viewDetailInfo", "viewPhonebook"];

var loginData = {
    token:          "",
    token_valid:    "",
    uuid:           ""
};

window.initialSuccess = function(data) {
    
    //data return from [qplayApi/public/index.php/v101/qplay/login]
    loginData.token =       data.token;
    loginData.token_valid = data.token_valid;
    loginData.uuid =        data.uuid;
    console.log("Allen------------initial");
    console.log(window);
    var companyData = new QueryCompanyData();
    
}
//console.log($.mobile.pageContainer.pagecontainer("getActivePage"));


/*
$(document).on("pagecreate", function(){
    
    //console.log($.mobile.pageContainer.pagecontainer("getActivePage"));
    console.log("Allen-----------1");
    window.initialSuccess = function(data) {
        
        console.log("Allen-----------2");
        //if (data !== undefined) {
            /*
            rsDataFromServer.token_valid = data['token_valid'];
            rsDataFromServer.token = data['token'];
            rsDataFromServer.uuid = data['uuid'];
            rsDataFromServer.redirect = data['redirect-uri'];
            
            rsDataFromServer.token_valid = "1475394411";
            rsDataFromServer.token = "57ee186b03987";
            rsDataFromServer.uuid = "b58ef4d9ea42943b";

            /*
            $("#viewIndex").pagecontainer({
                create: function(event, ui) {
                    console.log("----pagecreate----index");
                    
                    $(":mobile-pagecontainer").pagecontainer("load", "view/viewQueryResult.html");
                    $(":mobile-pagecontainer").pagecontainer("load", "view/viewDetailInfo.html");
                    $(":mobile-pagecontainer").pagecontainer("load", "view/viewPhonebook.html");

                    $.mobile.page.prototype.options.domCache = true;

                    $("#viewIndex").on("pagebeforeshow", function(event, ui) {
                        
                    });

                    $("#viewIndex").on("pageshow", function(event, ui) {
                        console.log("show----index");
                    });

                    
                    function QueryCompanyData() {
                        
                        var self = this;

                        this.successCallback = function(data) {
                            var resultcode = data['ResultCode'];
                            
                            if (resultcode === "1" || resultcode === "1906") {
                                var dataContent = data['Content'];
                                
                                for (var i=2; i<dataContent.length; i++) { // ignore 0 and 1, 0: "All Company", 1: ""
                                    var companyname = dataContent[i].CompanyName;
                                    $('#Company').append('<option value="' + companyname + '">' + companyname + '</option>');
                                }
                            }
                        };

                        this.failCallback = function(data) {
                            
                        };

                        var __construct = function() {
                            QPlayAPI("POST", "QueryCompanyData", self.successCallback, self.failCallback);
                        }();

                    }

                    var companyData = new QueryCompanyData();

                    $("#cleanQuery").on("click", function() {
                        var company = $("select#Company"); 
                        company[0].selectedIndex = 0; 
                        company.selectmenu("refresh");

                        $("#viewIndex input[type=text]").val("");
                    });

                    $("#callQuery").on("click", function() {

                    });

                    $('#viewIndex').keypress(function(event){
                        if (event.keyCode === 13) // keyCode of 'Enter' key is 13
                        {
                            //getEmployeeData();
                        }
                    });
                }
            });
            

        //}
        if (!initializeAPP) {
            $(":mobile-pagecontainer").pagecontainer("load", "view/viewDataInput.html");
            $(":mobile-pagecontainer").pagecontainer("load", "view/viewQueryResult.html");
            $(":mobile-pagecontainer").pagecontainer("load", "view/viewDetailInfo.html");
            $(":mobile-pagecontainer").pagecontainer("load", "view/viewPhonebook.html");

            $.mobile.page.prototype.options.domCache = true;

            $(":mobile-pagecontainer").pagecontainer("change", $("#viewDataInput"));
        }
    };

    //initialSuccess();

    var app = {
        // Application Constructor
        initialize: function() {
            this.bindEvents();
            console.log("Allen-----------4");
        },
        // Bind Event Listeners
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        onDeviceReady: function() {
            app.receivedEvent('deviceready');
            
            //[device] data ready to get on this step.

            //check data(token, token_value, ...) on web-storage
            /*
            if (data ok) {
                initialSuccess();
            } else {
                call APP QPlay to check data
            }
            
            
            //scheme not work now, so use QLogin to get token
            /*
            var args = [];
            args[0] = "initialSuccess";
            args[1] = device.uuid;

            window.plugins.qlogin.openCertificationPage(null, null, args);
            
            if (device.platform === "iOS") {
                $('.page-header, .page-main').addClass('ios-fix-overlap');
                $('.ios-fix-overlap-div').css('display','block');
            }
            console.log("-----------device ready");
            //$(":mobile-pagecontainer").pagecontainer("change", "#viewDataInput");
        },
        // Update DOM on a Received Event
        receivedEvent: function(id) {

        }
    };

    if (!initializeAPP) {
        app.initialize();
        initializeAPP = true;
    }
    
});
*/

