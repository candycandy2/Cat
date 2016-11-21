
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
                        
                        $('#appcontent').html(""); // empty html content
                        var carouselItem;
                        
                        var carousel_Settings = {
                            touchDrag: false,
                            mouseDrag: false,
                            loop:false,
                            nav:false,
                            margin:0,
                            responsive:{
                                0:{
                                    items:1
                                },
                                100:{
                                    items:2
                                },
                                350:{
                                    items:4
                                }
                            }
                        };
                        
                        for (var categoryindex=0; categoryindex<appcategorylist.length; categoryindex++) {
                            var catetoryname = appcategorylist[categoryindex].app_category;
                            $('#appcontent').append('<h4>' + catetoryname + '</h4>');
                            $('#appcontent').append('<div class="owl-carousel owl-theme"' + 'id=qplayapplist' + categoryindex.toString() + '></div>');
                            var owl = $("#qplayapplist"+ categoryindex.toString()), i = 0, textholder, booleanValue = false;
                            //init carousel
                            owl.owlCarousel(carousel_Settings);
                          
                            for (var appindex=0; appindex<applist.length; appindex++) {
                                var appcategory = applist[appindex].app_category;
                                if (appcategory == catetoryname){

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
                              
                                    carouselItem = "<div class=\"owl-item\"><a value=" + appindex.toString() + " id=\"application" + appindex.toString() + "\"  href=\"#appdetail2-2\"><img src=\"" + applist[appindex].icon_url + "\" style=\"width:50px;height:50px;\"></a><p style=\"font-size:0.8em;margin-top:0px;text-align:center;\">" + packagename + "</p></div>";
                              
                                    $("#qplayapplist"+ categoryindex.toString()).owlCarousel('add', carouselItem).owlCarousel('refresh');
                              
                                    // fix me !!!!
                                    //if (packagename == "benq.qplay") {
                                    //    app.changeLevel(applist[appindex].security_level);
                                    //}
                                } // if (appcategory == catetoryname)
                            } // for appindex
                        } // for categoryindex

                        $('a[id^="application"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            
                            selectAppIndex = this.getAttribute('value');
                            $.mobile.changePage('#viewAppDetail2-2');
                        });
                    } // if (resultcode == 1)
                    else {
                        alert(data['message']);
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

                        $('#logoutConfirm').popup('close');

                        //clear data
                        appApiPath = "qplayApi";
                        qplayAppKey = "appqplay";

                        //logout can not clear messagecontent
                        var messagecontent = window.localStorage.getItem("messagecontent");

                        var loginData = {
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

                        app.initialize();
                    }
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "logout", self.successCallback, self.failCallback, null, queryStr);
                }();
            }

            /********************************** page event *************************************/
            $("#viewMain2-1").one("pagebeforeshow", function(event, ui) {
                var appList = new QueryAppList();
            });

            $("#viewMain2-1").on("pagebeforeshow", function(event, ui) {
                if (loginData["msgDateFrom"] === true) {
                    var messageList = new QueryMessageList();
                }
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