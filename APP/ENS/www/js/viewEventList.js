
$("#viewEventList").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        window.getAuthority = function() {

            var self = this;
            //Data Life-Cycle: none
            var dataLifeCycle = 0;
            var queryData = '<LayoutHeader><emp_no>' + loginData["emp_no"] + '</emp_no></LayoutHeader>';

            this.successCallback = function(data, dataExist) {
                dataExist = dataExist || false;
                var resultCode = data['ResultCode'];

                if (resultCode === 1) {
                    if (!dataExist) {
                        processLocalData.storeData("getAuthority", dataLifeCycle, data);
                    }

                    var dataContent = data["Content"];
                    var RoleList = dataContent["RoleList"];
                    loginData["RoleList"] = [];

                    for (var i=0; i<RoleList.length; i++) {
                        loginData["RoleList"].push(RoleList[i]);
                    }

                    var EventList = new getEventList();

                    var basicInfo = new getBasicInfo();
                }
            };

            this.failCallback = function(data) {};

            this.callAPI = function() {
                CustomAPI("POST", true, "getAuthority", self.successCallback, self.failCallback, queryData, "");
            };

            var __construct = function() {
                processLocalData.checkLifeCycle("getAuthority", self.callAPI, self.successCallback);
            }();

        };

        function getEventList(eventType) {

            var self = this;

            //queryData Type: (According to Dropdown List [Event Type])
            //value:0 [All Event] >       <emp_no>0407731</emp_no>
            //value:1 [undone Event] >    <event_status>0</event_status><emp_no>0407731</emp_no>
            //value:2 [done Event] >      <event_status>1</event_status><emp_no>0407731</emp_no>
            //value:3 [emergency Event] > <event_type_parameter_value>1</event_type_parameter_value><emp_no>0407731</emp_no>
            //value:4 [normal Event] >    <event_type_parameter_value>2</event_type_parameter_value><emp_no>0407731</emp_no>
            var queryDataParameter = "<emp_no>" + loginData["emp_no"] + "</emp_no>";

            if (eventType === "1") {
                queryDataParameter = "<event_status>0</event_status>" + queryDataParameter;
            } else if (eventType === "2") {
                queryDataParameter = "<event_status>1</event_status>" + queryDataParameter;
            } else if (eventType === "3") {
                queryDataParameter = "<event_type_parameter_value>1</event_type_parameter_value>" + queryDataParameter;
            } else if (eventType === "4") {
                queryDataParameter = "<event_type_parameter_value>2</event_type_parameter_value>" + queryDataParameter;
            }

            var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultCode = data['ResultCode'];

                if (resultCode === 1) {
                    $(".event-list-no-data").hide();
                } else if (resultCode === "014904") {
                    //No Event exist
                    $("#eventListNoDataPopup").popup("open");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "getEventList", self.successCallback, self.failCallback, queryData, "");
            }();

        }

        function getBasicInfo() {

            var self = this;

            var queryDataParameter = "<emp_no>" + loginData["emp_no"] + "</emp_no>";

            var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];

                if (resultCode === 1) {
                    var dataContent = data["Content"];

                    loginData["BasicInfo"] = {
                        user: [],
                        userDetail: {},
                        function: {},
                        location: {}
                    };

                    for (var i=0; i<dataContent.length; i++) {

                        //Function
                        var functionName = dataContent[i].function.trim();
                        if (loginData["BasicInfo"]["function"][functionName] == undefined) {
                            loginData["BasicInfo"]["function"][functionName] = [];
                        }

                        //Location
                        var locationName = dataContent[i].location.trim();
                        if (loginData["BasicInfo"]["location"][locationName] == undefined) {
                            loginData["BasicInfo"]["location"][locationName] = [];
                        }

                        for (var j=0; j<dataContent[i].user_list.length; j++) {
                            //All User
                            if (loginData["BasicInfo"]["user"].indexOf(dataContent[i].user_list[j].login_id) == -1) {
                                loginData["BasicInfo"]["user"].push(dataContent[i].user_list[j].login_id);
                                loginData["BasicInfo"]["userDetail"][dataContent[i].user_list[j].login_id] = dataContent[i].user_list[j];
                            }

                            //All Functon
                            if (loginData["BasicInfo"]["function"][functionName].indexOf(dataContent[i].user_list[j].login_id) == -1) {
                                loginData["BasicInfo"]["function"][functionName].push(dataContent[i].user_list[j].login_id);
                            }

                            //All Location
                            if (loginData["BasicInfo"]["location"][locationName].indexOf(dataContent[i].user_list[j].login_id) == -1) {
                                loginData["BasicInfo"]["location"][locationName].push(dataContent[i].user_list[j].login_id);
                            }
                        }

                        //Sort User ID
                        loginData["BasicInfo"]["function"][functionName].sort();
                        loginData["BasicInfo"]["location"][locationName].sort();

                    }

                    //Sort User ID
                    loginData["BasicInfo"]["user"].sort();

                    memberListView("location");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "getBasicInfo", self.successCallback, self.failCallback, queryData, "");
            }();

        }

        function memberListView(sortType) {

            var eventMemberDataListHTML = $("template#tplEventMemberDataList").html();
            $("#eventMemberTypeContent").siblings().remove();

            if (sortType === "userDetail") {
                var eventMemberDataList = $(eventMemberDataListHTML);
                eventMemberDataList.find(".title").html("管理員");

                var eventMemberDataListView = eventMemberDataList.find("ul");
                var eventMemberData = "";

                $.each(loginData["BasicInfo"][sortType], function(key, user) {
                    eventMemberData += "<li>" + key + "</li>";
                });

                eventMemberDataListView.html(eventMemberData);
                $("#memberDiv").append(eventMemberDataList);
            } else {
                $.each(loginData["BasicInfo"][sortType], function(key, user) {
                    var eventMemberDataList = $(eventMemberDataListHTML);
                    eventMemberDataList.find(".title").html(key);

                    var eventMemberDataListView = eventMemberDataList.find("ul");
                    var eventMemberData = "";
                    for (var i=0; i<user.length; i++) {
                        eventMemberData += "<li>" + user[i] + "</li>";
                    }
                    eventMemberDataListView.html(eventMemberData);

                    $("#memberDiv").append(eventMemberDataList);
                });
            }

            $(".event-member-data-list ul li:last-child").css({
                "margin-bottom": 0
            });
        }

        /********************************** page event *************************************/
        $("#viewEventList").one("pagebeforeshow", function(event, ui) {

            //UI Tab
            var tabData = {
                navbar: {
                    button: [{
                        href: "reportDiv",
                        text: "通報動態"
                    }, {
                        href: "memberDiv",
                        text: "成員"
                    }]
                },
                content: [{
                    id: "reportDiv"
                }, {
                    id: "memberDiv"
                }],
                attr: {
                    id: "tabEventList"
                }
            };

            tplJS.Tab("viewEventList", "contentEventList", "append", tabData);

            //UI Dropdown List : Event Type
            var eventTypeData = {
                id: "eventType",
                option: [{
                    value: "0",
                    text: "全部"
                }, {
                    value: "1",
                    text: "未完成"
                }, {
                    value: "2",
                    text: "完成"
                }, {
                    value: "3",
                    text: "緊急通報"
                }, {
                    value: "4",
                    text: "一般通報"
                }]
            };

            $("#reportDiv").append('<div id="eventTypeContent"></div>');
            tplJS.DropdownList("viewEventList", "eventTypeContent", "append", "typeA", eventTypeData);

            //Event List Msg
            /*
            var eventListMsgHTML = $("template#tplEventListMsg").html();

            for (var i=0; i<1; i++) {
                var eventListMsg = $(eventListMsgHTML);
                $("#reportDiv").append(eventListMsg);
            }
            */

            //UI Dropdown List : Event Member Type
            var eventMemberTypeData = {
                id: "eventMemberType",
                option: [{
                    value: "location",
                    text: "位置排序"
                }, {
                    value: "function",
                    text: "IT Function排序"
                }, {
                    value: "userDetail",
                    text: "成員排序"
                }]
            };

            $("#memberDiv").append('<div id="eventMemberTypeContent"></div>');
            tplJS.DropdownList("viewEventList", "eventMemberTypeContent", "append", "typeA", eventMemberTypeData);

            //Event List No Data Msg
            var eventListNoDataHTML = $("template#tplEventListNoData").html();

            var eventListNoData = $(eventListNoDataHTML);
            $("#reportDiv").append(eventListNoData);

            //Event Member List Popup
            var eventMemberListData = {
                id: "eventMemberList",
                content: $("template#tplEventMemberList").html()
            };

            tplJS.Popup("viewEventList", "contentEventList", "append", eventMemberListData);

            //Event Function List Popup
            var eventFunctionListData = {
                id: "eventFunctionList",
                content: $("template#tplEventFunctionList").html()
            };

            tplJS.Popup("viewEventList", "contentEventList", "append", eventFunctionListData);

            //Event List No Data Popup
            var eventListNoDataPopupData = {
                id: "eventListNoDataPopup",
                content: $("template#tplEventListNoDataPopup").html()
            };

            tplJS.Popup("viewEventList", "contentEventList", "append", eventListNoDataPopupData);

        });

        $("#viewEventList").on("pageshow", function(event, ui) {
            //Call API getAuthority
            var Authority = new getAuthority();
        });

        /********************************** dom event *************************************/

        //Tabs Change
        $(document).on("tabsactivate", "#tabEventList", function(event, ui) {
            if (ui.newPanel.selector === "#memberDiv") {
                $("#addEvent").hide();
            } else {
                $("#addEvent").show();
            }
        });

        //Event Type
        $(document).on("change", "#eventType", function() {
            $(".event-list-no-data").hide();
            loadingMask("show");
            var EventList = new getEventList($(this).val());
        });

        //Event Member List Popup
        $(document).on("click", ".event-list-msg-bottom .member, .event-list-msg-bottom .view", function() {
            $("#eventMemberList").popup("open");
        });

        $(document).on("click", "#eventMemberList .confirm", function() {
            $("#eventMemberList").popup("close");
        });

        //Event Function List Popup
        $(document).on("click", ".event-list-msg-bottom .member-done", function() {
            $("#eventFunctionList").popup("open");
        });

        $(document).on("click", "#eventFunctionList .confirm", function() {
            $("#eventFunctionList").popup("close");
        });

        //Event Content
        $(document).on("click", ".event-list-msg .description", function() {
            $.mobile.changePage('#viewEventContent');
        });

        //Event Add
        $(document).on("click", "#addEvent", function() {
            $.mobile.changePage('#viewEventAdd');
        });

        //Event No Data Popup
        $(document).on("click", "#eventListNoDataPopup .confirm", function() {
            $("#eventListNoDataPopup").popup("close");
            $(".event-list-no-data").show();
        });

        //Event Member List - Sort Type
        $(document).on("change", "#eventMemberType", function() {
            console.log($(this).val());
            memberListView($(this).val());
        });
    }
});
