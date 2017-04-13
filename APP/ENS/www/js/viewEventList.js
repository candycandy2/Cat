
$("#viewEventList").pagecontainer({
    create: function(event, ui) {

        window.tabActiveID = "#reportDiv";
        var callGetAuthority = false;
        var callBasicInfo = false;
        var eventListData;
        window.messageCountData;

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
                    callGetAuthority = true;

                    if (!dataExist) {
                        processLocalData.storeData("getAuthority", dataLifeCycle, data);
                    }

                    var dataContent = data["Content"];
                    var RoleList = dataContent["RoleList"];
                    loginData["RoleList"] = [];

                    for (var i=0; i<RoleList.length; i++) {
                        loginData["RoleList"].push(RoleList[i]);
                    }

                    //Set Event Type Selected Option
                    if (window.localStorage.getItem("eventType") !== null) {
                        var EventList = new getEventList(window.localStorage.getItem("eventType"));
                    } else {
                        var EventList = new getEventList();
                    }
                    var basicInfo = new getBasicInfo();

                    showEventAdd();
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

            eventType = eventType || null;
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

                var resultCode = data['ResultCode'];
                var chatroomIDList = [];

                if (resultCode === 1) {
                    $(".event-list-no-data").hide();

                    eventListData = data['Content'];

                    for (var i=0; i<data['Content'].length; i++) {
                        //Chatroom ID
                        if (data['Content'][i].chatroom_id !== null && data['Content'][i].chatroom_id.length != 0) {
                            chatroomIDList.push(data['Content'][i].chatroom_id);
                        }
                    }

                    //Update Message Count
                    getMessageCount(chatroomIDList);

                } else if (resultCode === "014904") {
                    //Clear Event List Data
                    $("#reportDiv .event-list-msg").remove();

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
                    callBasicInfo = true;

                    var dataContent = data["Content"];

                    loginData["BasicInfo"] = {
                        user: [],
                        userDetail: {},
                        function: {},
                        location: {},
                        locationFunction: {}
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

                        //LocationFunciton
                        if (loginData["BasicInfo"]["locationFunction"][locationName] == undefined) {
                            loginData["BasicInfo"]["locationFunction"][locationName] = [];
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

                        //All LocationFunciton
                        if (loginData["BasicInfo"]["locationFunction"][locationName].indexOf(dataContent[i].function) == -1) {
                            loginData["BasicInfo"]["locationFunction"][locationName].push(dataContent[i].function);
                        }

                        //Sort User ID
                        loginData["BasicInfo"]["function"][functionName].sort();
                        loginData["BasicInfo"]["location"][locationName].sort();

                    }

                    //Sort Function
                    var tempArr = [];
                    var tempObj = {};

                    $.each(loginData["BasicInfo"]["function"], function(key, user) {
                        tempArr.push(key);
                    });

                    tempArr.sort();

                    for (var i=0; i<tempArr.length; i++) {
                        tempObj[tempArr[i]] = loginData["BasicInfo"]["function"][tempArr[i]];
                    }

                    loginData["BasicInfo"]["function"] = tempObj;

                    //Sort User ID
                    loginData["BasicInfo"]["user"].sort();

                    //Event Member Sort Type
                    if (window.localStorage.getItem("eventMemberType") !== null) {
                        memberListView(window.localStorage.getItem("eventMemberType"));
                    } else {
                        memberListView("location");
                    }

                }

            };

            this.failCallback = function(data) {};

            var __construct = function() {
                if (!callBasicInfo) {
                    CustomAPI("POST", true, "getBasicInfo", self.successCallback, self.failCallback, queryData, "");
                }
            }();

        }

        function getMessageCount(chatroomIDList) {
            var self = this;

            var queryDataParameter = "<emp_no>" + loginData["emp_no"] + "</emp_no>";
            var chatroomListParameter = "<chatroom_list>";

            for (var i=0; i<chatroomIDList.length; i++) {
                var queryDataObj = {
                    chatroom_id: chatroomIDList[i]
                };
                chatroomListParameter += processLocalData.createXMLDataString(queryDataObj);
            }
            chatroomListParameter += "</chatroom_list>";

            var queryData = "<LayoutHeader>" + queryDataParameter + chatroomListParameter + "</LayoutHeader>";

            this.successCallback = function(data) {
                var resultCode = data['ResultCode'];
                var openEventDetail = false;

                if (resultCode === "014901") {
                    messageCountData = data['Content'];

                    if (openEventFromQPlay) {
                        openEventDetail = true;
                    } else {
                        eventListView();
                    }
                } else {
                    if (openEventFromQPlay) {
                        openEventDetail = true;
                    }
                }

                if (openEventDetail) {
                    //Open Event Detail from QPlay
                    var eventDetail = new getEventDetail(eventRowID);
                    $.mobile.changePage('#viewEventContent');

                    openEventFromQPlay = false;
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "getMessageCount", self.successCallback, self.failCallback, queryData, "");
            }();

        }

        function eventListView() {
            //Clear Event List Data
            $("#reportDiv .event-list-msg").remove();

            //Event List Msg
            var eventListMsgHTML = $("template#tplEventListMsg").html();

            for (var i=0; i<eventListData.length; i++) {

                var eventListMsg = $(eventListMsgHTML);

                //Add ID
                eventListMsg.prop("id", "event-list-msg-" + eventListData[i].event_row_id);

                //Created User
                eventListMsg.find(".event-list-msg-top .name").html(eventListData[i].created_user);

                //Create Datetime - Convert with TimeZone
                var tempDate = dateFormatYMD(eventListData[i].created_at);
                var createTime = new Date(tempDate);
                var createTimeConvert = createTime.TimeZoneConvert();
                createTimeConvert = createTimeConvert.substr(0, parseInt(createTimeConvert.length - 3, 10));
                eventListMsg.find(".event-list-msg-top .time").html(createTimeConvert);

                //Event ID Number
                eventListMsg.find(".event-list-msg-top .link .text").html(eventListData[i].event_row_id);

                //Event Related Link
                eventListMsg.find(".event-list-msg-top .link .text").html(eventListData[i].event_row_id);

                if (eventListData[i].related_event_row_id !== 0) {
                    eventListMsg.find(".event-list-msg-top .link-event").data("value", eventListData[i].related_event_row_id);
                } else {
                    eventListMsg.find(".event-list-msg-top .link-event").hide();
                }

                //Event Title
                eventListMsg.find(".event-list-msg-top .description").html(eventListData[i].event_title);

                //Type: 緊急通報 / 一般通報
                var event_type = eventListData[i].event_type;
                if (event_type === "一般通報") {
                    eventListMsg.find(".event-list-msg-top .link .normal").show();
                    eventListMsg.find(".event-list-msg-top .link .urgent").hide();
                }

                //Status: 未完成 / 完成
                var event_status = eventListData[i].event_status;
                if (event_status === "完成") {
                    eventListMsg.find(".event-list-msg-top .event-status .done").show();
                    eventListMsg.find(".event-list-msg-top .event-status .unfinished").hide();
                }

                //User Count
                eventListMsg.find(".event-list-msg-bottom .member .text").html(eventListData[i].user_count);

                //Seen Count
                eventListMsg.find(".event-list-msg-bottom .view .text").html(eventListData[i].seen_count);

                //Task finish Count
                eventListMsg.find(".event-list-msg-bottom .member-done .text").html(eventListData[i].task_finish_count);

                //Message Count
                var msgCount = 0;
                for (j=0; j<messageCountData.length; j++) {
                    if (messageCountData[j]["target_id"] === eventListData[i].chatroom_id) {
                        msgCount = messageCountData[j]["count"];
                        break;
                    }
                }
                eventListMsg.find(".event-list-msg-bottom .message .text").html(msgCount);

                $("#reportDiv").append(eventListMsg);
            }

            loadingMask("hide");
            eventListData = null;

            //Scroll to the specific Event List position
            if (typeof eventRowID != 'undefined') {
                if (eventRowID != null) {
                    var headerHeight = $("#viewEventList .page-header").height();
                    var scrollPageTop = $("#event-list-msg-" + eventRowID).offset().top - headerHeight;
                    if (device.platform === "iOS") {
                        scrollPageTop -= 20;
                    }

                    $('html, body').animate({
                        scrollTop: scrollPageTop
                    }, 0);
                }
            }
        }

        function memberListView(sortType) {

            var eventMemberDataListHTML = $("template#tplEventMemberDataList").html();
            $("#eventMemberTypeContent").siblings().remove();

            if (sortType === "user") {
                var eventMemberDataList = $(eventMemberDataListHTML);
                eventMemberDataList.find(".title").html("管理員");

                var eventMemberDataListView = eventMemberDataList.find("ul");
                var eventMemberData = "";

                for (var i=0; i<loginData["BasicInfo"][sortType].length; i++) {
                   eventMemberData += "<li>" + loginData["BasicInfo"][sortType][i] + "</li>"; 
                }

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

        window.memberListPopup = function(data) {

            //Event Member List Popup
            var eventMemberListHTML = $("template#tplEventMemberList").html();
            var eventMemberList = $(eventMemberListHTML);

            //Type: 緊急通報 / 一般通報
            var event_type = data.event_type;
            if (event_type === "一般通報") {
                eventMemberList.siblings(".header").find(".number .normal").show();
                eventMemberList.siblings(".header").find(".number .urgent").hide();
            }

            //Event ID Number
            eventMemberList.siblings(".header").find(".number .text").html(data.event_row_id);

            //Event Title
            eventMemberList.siblings(".header").find(".title").html(data.event_title);

            //Event Description
            eventMemberList.siblings(".header").find(".description").html(data.event_desc);

            //Event Member List Li - Before & Atfer
            eventMemberList.siblings(".main").find("li").remove();

            var eventMemberListBeforeHTML = eventMemberList.siblings(".main").find("template#tplEventMemberListBefore").html();
            var eventMemberListAfterHTML = eventMemberList.siblings(".main").find("template#tplEventMemberListAfter").html();

            for (var i=0; i<data.user_event.length; i++) {
                if (data.user_event[i].read_time === 0) {
                    //Before Read
                    var eventMemberListLi = $(eventMemberListBeforeHTML);
                } else {
                    //After Read
                    var eventMemberListLi = $(eventMemberListAfterHTML);
                }
                eventMemberListLi.find(".text").html(data.user_event[i].login_id);
                eventMemberList.siblings(".main").append(eventMemberListLi);
            }

            //EventList / EventContent
            var eventMemberListData = {
                id: "eventMemberList",
                content: eventMemberList
            };

            tplJS.Popup(null, null, "append", eventMemberListData);

            $("#eventMemberList").popup("open");
            footerFixed();
        };

        window.functionListPopup = function(data) {

            //Event Function List Popup
            var eventFunctionListHTML = $("template#tplEventFunctionList").html();
            var eventFunctionList = $(eventFunctionListHTML);

            //Type: 緊急通報 / 一般通報
            var event_type = data.event_type;
            if (event_type === "一般通報") {
                eventFunctionList.siblings(".header .number .normal").show();
                eventFunctionList.siblings(".header .number .urgent").hide();
            }

            //Event ID Number
            eventFunctionList.siblings(".header").find(".number .text").html(data.event_row_id);

            //Event Title
            eventFunctionList.siblings(".header").find(".title").html(data.event_title);

            //Event Description
            eventFunctionList.siblings(".header").find(".description").html(data.event_desc);

            //Event Function List Li - Before & Atfer
            eventFunctionList.siblings(".main").find("li").remove();

            var eventFunctionListBeforeHTML = eventFunctionList.siblings(".main").find("template#tplEventFunctionListBefore").html();
            var eventFunctionListAfterHTML = eventFunctionList.siblings(".main").find("template#tplEventFunctionListAfter").html();

            for (var i=0; i<data.task_detail.length; i++) {
                if (data.task_detail[i].task_status === "完成") {
                    //After Done
                    var completeTime = new Date(data.task_detail[i].close_task_date * 1000);
                    var completeTimeText = completeTime.getFullYear() + "/" + padLeft(parseInt(completeTime.getMonth() + 1, 10), 2) + "/" +
                    padLeft(completeTime.getUTCDate(), 2) + " " + padLeft(completeTime.getHours(), 2) + ":" +
                    padLeft(completeTime.getMinutes(), 2);

                    var eventFunctionListLi = $(eventFunctionListAfterHTML);
                    eventFunctionListLi.find(".user").html(data.task_detail[i].close_task_user_id);
                    eventFunctionListLi.find(".datetime").html(completeTimeText);
                } else {
                    //Before Done
                    var eventFunctionListLi = $(eventFunctionListBeforeHTML);
                }
                eventFunctionListLi.find(".title").html(data.task_detail[i].task_location);
                eventFunctionListLi.find(".function").html(data.task_detail[i].task_function);

                eventFunctionList.siblings(".main").append(eventFunctionListLi);
            }

            //EventList / EventContent
            var eventFunctionListData = {
                id: "eventFunctionList",
                content: eventFunctionList
            };

            tplJS.Popup(null, null, "append", eventFunctionListData);

            $("#eventFunctionList").popup("open");
            footerFixed();
        };

        function showEventAdd() {
            //Only [admin] can Add New Event
            if (checkAuthority("admin")) {
                $("#addEvent").show();
            }
        }

        window.ahowEventData = function(dom, action) {
            action = action || null;
            var openData = false;

            if (action === "member" || action === "function") {
                //Only [admin] & [supervisor] can read (member) & (function)
                if (checkAuthority("admin") || checkAuthority("supervisor")) {
                    var eventID = $(dom).parent().siblings(".event-list-msg-top").find(".link .normal .text").html();
                    openData = true;
                }
            } else if (action === "authority" || action === "authority2") {

                function callback(readAuthority) {
                    if (readAuthority) {
                        //can read
                        $.mobile.changePage('#viewEventContent');
                    } else {
                        //can not read
                        $("#eventRelatedNoAuthorityPopup").popup("open");
                    }
                }

                if (action === "authority") {
                    var eventRelatedID = $(dom).data("value");
                } else if (action === "authority2") {
                    var eventRelatedID = $(dom).html();
                }

                var eventDetail = new getEventDetail(eventRelatedID, "authority", callback);
            } else {
                var eventID = $(dom).parent().find(".link .normal .text").html();
                openData = true;
            }

            if (openData) {
                var eventDetail = new getEventDetail(eventID, action);
            }
        };

        window.changeTabToEventList = function() {
            $("#tabEventList a:eq(0)").addClass("ui-btn-active");
            $("#tabEventList a:eq(1)").removeClass("ui-btn-active");
            $("#tabEventList").tabs({ active: 0 });
            footerFixed();
        };

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
            if (window.localStorage.getItem("eventType") !== null) {
                var eventTypeDefaultVal = window.localStorage.getItem("eventType");
            } else {
                var eventTypeDefaultVal = "0";
            }

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
                }],
                defaultValue: eventTypeDefaultVal
            };

            $("#reportDiv").append('<div id="eventTypeContent"></div>');
            tplJS.DropdownList("viewEventList", "eventTypeContent", "append", "typeA", eventTypeData);

            //UI Dropdown List : Event Member Type
            if (window.localStorage.getItem("eventMemberType") !== null) {
                var eventMemberTypeDefaultVal = window.localStorage.getItem("eventMemberType");
            } else {
                var eventMemberTypeDefaultVal = "location";
            }

            var eventMemberTypeData = {
                id: "eventMemberType",
                option: [{
                    value: "location",
                    text: "位置排序"
                }, {
                    value: "function",
                    text: "IT Function排序"
                }, {
                    value: "user",
                    text: "成員排序"
                }],
                defaultValue: eventMemberTypeDefaultVal
            };

            $("#memberDiv").append('<div id="eventMemberTypeContent"></div>');
            tplJS.DropdownList("viewEventList", "eventMemberTypeContent", "append", "typeA", eventMemberTypeData);

            //Event List No Data Msg
            var eventListNoDataHTML = $("template#tplEventListNoData").html();

            var eventListNoData = $(eventListNoDataHTML);
            $("#reportDiv").append(eventListNoData);

            //Event List No Data Popup
            var eventListNoDataPopupData = {
                id: "eventListNoDataPopup",
                content: $("template#tplEventListNoDataPopup").html()
            };

            tplJS.Popup("viewEventList", "contentEventList", "append", eventListNoDataPopupData);

            //Event Related No Authority Popup
            var eventRelatedNoAuthorityPopupData = {
                id: "eventRelatedNoAuthorityPopup",
                content: $("template#tplEventRelatedNoAuthorityPopup").html()
            };

            tplJS.Popup(null, null, "append", eventRelatedNoAuthorityPopupData);

            //Contact User Popup
            var contactUserPopupData = {
                id: "contactUserPopup",
                content: $("template#tplContactUserPopup").html()
            };

            tplJS.Popup("viewEventList", "contentEventList", "append", contactUserPopupData);

        });

        $("#viewEventList").on("pageshow", function(event, ui) {
            prevPageID = "viewEventList";

            //Set Active Tab
            $("#tabEventList a:eq(0)").addClass("ui-btn-active");
            $("#tabEventList").tabs({ active: 0 });

            //Call API getAuthority
            if (!callGetAuthority) {
                var Authority = new getAuthority();
            } else {
                loadingMask("show");

                //Set Event Type Selected Option
                if (window.localStorage.getItem("eventType") !== null) {
                    var EventList = new getEventList(window.localStorage.getItem("eventType"));
                } else {
                    var EventList = new getEventList();
                }
            }

            footerFixed();
        });

        /********************************** dom event *************************************/

        //Tabs Change
        $(document).on("tabsactivate", "#tabEventList", function(event, ui) {
            tabActiveID = ui.newPanel.selector;

            if (ui.newPanel.selector === "#memberDiv") {
                $("#addEvent").hide();
            } else {
                showEventAdd();
            }
        });

        //Event Type
        $(document).on("change", "#eventType", function() {
            $(".event-list-no-data").hide();
            loadingMask("show");

            var EventList = new getEventList($(this).val());

            //Remember Event Type
            window.localStorage.setItem("eventType", $(this).val());
        });

        //Event Member List Popup - Member List & View List
        $(document).on("click", ".event-list-msg-bottom .member, .event-list-msg-bottom .view", function() {
            ahowEventData(this, "member");
        });

        $(document).on("click", "#eventMemberList .confirm", function() {
            $("#eventMemberList").popup("close");
            $("#eventMemberList").remove();
            footerFixed();
        });

        //Event Function List Popup
        $(document).on("click", ".event-list-msg-bottom .member-done", function() {
            ahowEventData(this, "function");
        });

        $(document).on("click", "#eventFunctionList .confirm", function() {
            $("#eventFunctionList").popup("close");
            $("#eventFunctionList").remove();
            footerFixed();
        });

        //Event Content
        $(document).on("click", ".event-list-msg .description", function() {
            ahowEventData(this);
            loadingMask("show");
            $.mobile.changePage('#viewEventContent');
        });

        //Event Related Content
        $(document).on("click", ".event-list-msg .link-event", function() {
            ahowEventData(this, "authority");
            loadingMask("show");
        });

        //Event Add
        $(document).on("click", "#addEvent", function() {
            loadingMask("show");
            $.mobile.changePage('#viewEventAdd');
        });

        //Event No Data Popup
        $(document).on("click", "#eventListNoDataPopup .confirm", function() {
            $("#eventListNoDataPopup").popup("close");
            $(".event-list-no-data").show();
            loadingMask("hide");
            footerFixed();
        });

        //Event Related No Authority Popup
        $(document).on("click", "#eventRelatedNoAuthorityPopup .confirm", function() {
            $("#eventRelatedNoAuthorityPopup").popup("close");
            footerFixed();
        });

        //Event Member List - Sort Type
        $(document).on("change", "#eventMemberType", function() {
            memberListView($(this).val());

            //Remember Event Member Sort Type
            window.localStorage.setItem("eventMemberType", $(this).val());
        });

        //Mail / Tel
        $(document).on("click", ".event-member-data-list ul li", function() {
            var userID = $(this).html();

            $.each(loginData["BasicInfo"]["userDetail"], function(user, detail) {
                if (user === userID) {
                    $("#contactUserPopup #userName").html(detail["login_id"]);
                    $("#contactUserPopup #extNo").html(detail["user_ext_no"]);
                    $("#contactUserPopup a").css("color", "#38c");

                    var mailTo = "#";
                    var tel = "#";

                    if (detail["email"] !== null) {
                        mailTo = "mailto:" + detail["email"] + "?subject=ENS";
                    } else {
                        $("#contactUserPopup #mail").css("color", "#d6d6d6");
                    }

                    if (detail["user_ext_no"] !== null) {
                        tel = "tel:" + detail["user_ext_no"];
                    } else {
                        $("#contactUserPopup #tel").css("color", "#d6d6d6");
                    }

                    $("#contactUserPopup #mail").prop("href", mailTo);
                    $("#contactUserPopup #tel").prop("href", tel);
                }
            });

            $("#contactUserPopup").popup("option", "dismissible", true);
            $("#contactUserPopup").popup("open");
        });

        $(document).on("popupafterclose", "#contactUserPopup", function() {
            //Set Active Tab
            $("#tabEventList a:eq(1)").addClass("ui-btn-active");
            $("#tabEventList").tabs({ active: 1 });
        });
    }
});
