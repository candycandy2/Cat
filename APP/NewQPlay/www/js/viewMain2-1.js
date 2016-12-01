
$(document).one("pagecreate", "#viewMain2-1", function(){
    
    $("#viewMain2-1").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function QueryAppList() {
                var self = this;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];
                    
                    if (resultcode == 1) {
                        var responsecontent = data['content'];
                        appcategorylist = responsecontent.app_category_list;
                        applist = responsecontent.app_list;
                        appmultilang = responsecontent.multi_lang;
                        
                        $('#appcontent').html("");

                        for (var categoryindex=0; categoryindex<appcategorylist.length; categoryindex++) {
                            var catetoryName = appcategorylist[categoryindex].app_category;
                            var catetoryID = appcategorylist[categoryindex].category_id;
                            var content = "";
                            var catetoryAPPCount = 0;

                            content += '<h4 style="clear:both;">' + catetoryName + '</h4>';
                            content += '<div id="qplayapplist' + categoryindex + '" class="app-list-scroll-area"><div id="qplayapplistContent' + categoryindex + '">';

                            for (var appindex=0; appindex<applist.length; appindex++) {
                                var appcategory = applist[appindex].app_category_id;

                                if (appcategory == catetoryID){

                                    catetoryAPPCount++;

                                    //Multi Language
                                    for (var i=0; i<appmultilang.length; i++) {
                                        if (appmultilang[i].project_code == applist[appindex].app_code) {
                                            if (appmultilang[i].lang == "zh-tw") {
                                                var packagename = appmultilang[i].app_name;
                                            }
                                        }
                                    }

                                    var appurl = applist[appindex].url;
                                    var appurlicon = applist[appindex].icon_url;

                                    content += "<div class='app-list-item'><a value=" + appindex.toString() + " id='application" + appindex.toString() + "'  href='#appdetail2-2'>";
                                    content += "<img src='" + applist[appindex].icon_url + "' style='width:25vw;'></a>";
                                    content += "<p class='app-list-name'>" + packagename + "</p></div>";
                                }

                                if (parseInt(appindex + 1, 10) == applist.length) {
                                    content += '</div></div>';
                                    $('#appcontent').append(content);
                                }
                            }

                            //auto set with of qplayapplistContent
                            var pageWidth = $("#viewMain2-1").width();
                            //Add (APP width) and (Margin width)
                            var catetoryAPPWidth = (catetoryAPPCount * pageWidth * 0.25) + (catetoryAPPCount * 10);
                            $("#qplayapplistContent" + categoryindex).css("width", catetoryAPPWidth + "px");
                        }

                        $('a[id^="application"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            
                            selectAppIndex = this.getAttribute('value');
                            $.mobile.changePage('#viewAppDetail2-2');
                        });

                    } else {

                    }
                }; 

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("GET", "getAppList", self.successCallback, self.failCallback);
                }();

            }

            function doLogOut() {
                var self = this;

                //需要 User AD Account
                var queryStr = "&domain=" + loginData.domain + "&loginid=" + loginData.loginid;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];

                    if (resultcode == 1) {

                        //clear data
                        appApiPath = "qplayApi";
                        qplayAppKey = "appqplay";

                        //logout can not clear messagecontent / pushToken
                        var messagecontent = window.localStorage.getItem("messagecontent");
                        var pushToken = window.localStorage.getItem("pushToken");

                        loginData = {
                            versionName:         "",
                            versionCode:         "",
                            deviceType:          "",
                            pushToken:           "",
                            token:               "",
                            token_valid:         "",
                            uuid:                "",
                            checksum:            "",
                            domain:              "",
                            emp_no:              "",
                            loginid:             "",
                            messagecontent:      null,
                            msgDateFrom:         null,
                            doLoginDataCallBack: false,
                            callCheckAPPVer:     false,
                            callQLogin:          false,
                            openMessage:         false
                        };

                        window.localStorage.clear();

                        window.localStorage.setItem("messagecontent", messagecontent);
                        window.localStorage.setItem("pushToken", pushToken);

                        app.initialize();
                    }
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "logout", self.successCallback, self.failCallback, null, queryStr);
                }();
            }

            /********************************** page event *************************************/
            $("#viewMain2-1").on("pagebeforeshow", function(event, ui) {
                if (loginData["msgDateFrom"] === true) {
                    var messageList = new QueryMessageList();
                }
                var appList = new QueryAppList();
            });

            $("#viewMain2-1").on("pageshow", function(event, ui) {
                $('#logoutConfirm').popup('close');
            });

            /********************************** dom event *************************************/
            $("#logout").on("click", function(){
                $('#logoutConfirm').popup('open');
            });

            $("#logoutConfirm #cancel").on("click", function(){
                $('#logoutConfirm').popup('close');
            });

            $("#logoutConfirm #confirm").on("click", function(){

                $('#logoutConfirm').popup('close');
                loadingMask("show");

                var logout = new doLogOut();
            });

            $("#newseventspage").on("click", function(){
                /*
                if (loginData["msgDateFrom"] === null) {
                    //var messageList = new QueryMessageList();
                    $('#selectMsgDateFrom').popup('open');
                }
                */
                $.mobile.changePage('#viewNewsEvents2-3');
            });
            /*
            $("#selectMsgDateFrom").on("click", function(){
                msgDateFromType = $('input[name=selectDateFrom]:checked').val();
                var messageList = new QueryMessageList();
            });
            */
        }
    });

});