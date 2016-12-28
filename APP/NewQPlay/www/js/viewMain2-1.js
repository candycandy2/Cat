
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

                            if (categoryindex > 0) {
                                content += '<hr class="app-list-hr">';
                            }
                            content += '<span class="app-list-category">' + catetoryName + '</span>';
                            content += '<div id="qplayapplist' + categoryindex + '" class="app-list-scroll-area"><div id="qplayapplistContent' + categoryindex + '" style="width:auto;">';

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
                            var catetoryAPPWidth = (catetoryAPPCount * pageWidth * 0.25) + (catetoryAPPCount * (pageWidth * 0.04));
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

                    loadingMask("hide");

                    if (window.localStorage.getItem("firstInitial") === "true") {
                        if (doHideInitialPage) {
                            doHideInitialPage = false;
                            refreshPage();
                            window.localStorage.setItem("firstInitial", "false");
                        }
                    } else {
                        $("#appcontent").show();
                        openAppDetailCheck();
                    }
                }; 

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("GET", "getAppList", self.successCallback, self.failCallback);
                }();

            }

            function doLogOut() {
                var self = this;

                //need User AD Account
                var queryStr = "&domain=" + loginData.domain + "&loginid=" + loginData.loginid;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];

                    if (resultcode == 1) {

                        //clear data
                        appApiPath = "qplayApi";
                        qplayAppKey = "appqplay";

                        //logout can not clear messagecontent / pushToken / msgDateFrom
                        var messagecontent = window.localStorage.getItem("messagecontent");
                        var pushToken = window.localStorage.getItem("pushToken");
                        var storeMsgDateFrom = false;

                        if (window.localStorage.getItem("msgDateFrom") !== null) {
                            var msgDateFrom = window.localStorage.getItem("msgDateFrom");
                            storeMsgDateFrom = true;
                        }

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
                            openMessage:         false
                        };

                        window.localStorage.clear();

                        window.localStorage.setItem("messagecontent", messagecontent);
                        window.localStorage.setItem("pushToken", pushToken);

                        if (storeMsgDateFrom) {
                            window.localStorage.setItem("msgDateFrom", msgDateFrom);
                        }

                        $.mobile.changePage('#viewNotSignedIn');
                        $("#viewMain2-1").removeClass("ui-page-active");
                        $("#viewNotSignedIn").addClass("ui-page-active");

                        loadingMask("hide");
                        app.initialize();
                    }
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "logout", self.successCallback, self.failCallback, null, queryStr);
                }();
            }

            function refreshPage() {
                $.mobile.changePage('#viewMain2-1', {
                    allowSamePageTransition : true,
                    transition              : 'none',
                    showLoadMsg             : false,
                    reloadPage              : true
                });

                $("#appcontent").hide();
                $.mobile.changePage('#viewMain2-1');

                openAppDetailCheck();
            }

            function openAppDetailCheck() {
                //For other APP doing update
                if (loginData['openAppDetailPage'] === true) {
                    for (var appindex=0; appindex<applist.length; appindex++) {
                        if (applist[appindex].package_name == "com.qplay." + openAppName) {
                            selectAppIndex = appindex;
                            $.mobile.changePage('#viewAppDetail2-2');

                            loginData['openAppDetailPage'] = false;
                        }
                     }
                }
            }
            /********************************** page event *************************************/
            $("#viewMain2-1").on("pagebeforeshow", function(event, ui) {

            });

            $("#viewMain2-1").on("pageshow", function(event, ui) {
                loadingMask("show");
                var appList = new QueryAppList();

                $('#logoutConfirm').popup('close');
            });

            /********************************** dom event *************************************/
            $("#logout").on("click", function() {
                $('#logoutConfirm').popup('open');
            });

            $("#logoutConfirm #cancel").on("click", function() {
                $('#logoutConfirm').popup('close');
            });

            $("#logoutConfirm #confirm").on("click", function() {

                $('#logoutConfirm').popup('close');
                loadingMask("show");

                var logout = new doLogOut();
            });

            $("#newseventspage").on("click", function() {
                $.mobile.changePage('#viewNewsEvents2-3');
            });
        }
    });

});