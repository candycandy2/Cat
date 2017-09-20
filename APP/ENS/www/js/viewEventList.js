
$("#viewEventList").pagecontainer({
    create: function(event, ui) {

        window.tabActiveID = "#reportDiv";
        var callGetAuthority = false;
        var callBasicInfo = false;
        var eventListData;
        window.messageCountData;
        var openMemberList = false;

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

                    loginData["RoleList"] = {};

                    for (var i=0; i<data["Content"].length; i++) {
                        loginData["RoleList"][data["Content"][i].Project] = [];

                        for (var j=0; j<data["Content"][i].RoleList.length; j++) {
                            loginData["RoleList"][data["Content"][i].Project].push(data["Content"][i].RoleList[j]);
                        }

                        var basicInfo = new getBasicInfo(data["Content"][i].Project);
                    }

                    if (data["Content"].length === 1) {
                        //If count RoleList == 1, hide dropdown-list projectType
                        projectName = data["Content"][0].Project;
                        $("#projectType").hide();
                    }
                    changeProject("setOption");

                    //Set Event Type Selected Option
                    if (window.localStorage.getItem("eventType" + projectName) !== null) {
                        var EventList = new getEventList(window.localStorage.getItem("eventType" + projectName));
                    } else {
                        var EventList = new getEventList("1");
                    }

                    showEventAdd();
                } else if (resultCode === 014923) {
                    $("#noUseAuthorityPopup").popup("open");
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
            //value:0 [All Event] >    <emp_no>0407731</emp_no>
            //value:1 [undone Event] > <event_status>0</event_status><emp_no>0407731</emp_no>
            //value:2 [done Event] >   <event_status>1</event_status><emp_no>0407731</emp_no>
            var queryDataParameter = "<emp_no>" + loginData["emp_no"] + "</emp_no>";
            var eventTypeParameterValue = 0;

            if (eventType === "1") {
                queryDataParameter = "<event_status>0</event_status>" + queryDataParameter;
            } else if (eventType === "2") {
                queryDataParameter = "<event_status>1</event_status>" + queryDataParameter;
            }

            if (projectName === "ITS") {
                //value:3 [emergency Event] > <event_type_parameter_value>1</event_type_parameter_value><emp_no>0407731</emp_no>
                //value:4 [normal Event] >    <event_type_parameter_value>2</event_type_parameter_value><emp_no>0407731</emp_no>
                if (eventType === "3") {
                    eventTypeParameterValue = 1;
                } else if (eventType === "4") {
                    eventTypeParameterValue = 2;
                }
            } else if (projectName === "RM") {
                //value:3 [A Class Event] > <event_type_parameter_value>3</event_type_parameter_value><emp_no>0407731</emp_no>
                //value:4 [B Class Event] > <event_type_parameter_value>4</event_type_parameter_value><emp_no>0407731</emp_no>
                //value:5 [C Class Event] > <event_type_parameter_value>5</event_type_parameter_value><emp_no>0407731</emp_no>
                //value:6 [prevent Event] > <event_type_parameter_value>6</event_type_parameter_value><emp_no>0407731</emp_no>
                //value:7 [info share] >    <event_type_parameter_value>7</event_type_parameter_value><emp_no>0407731</emp_no>
                if (eventType !== "0" && eventType !== "1" && eventType !== "2") {
                    eventTypeParameterValue = eventType;
                }
            }

            if (eventTypeParameterValue != 0) {
                queryDataParameter = "<event_type_parameter_value>" + eventTypeParameterValue + "</event_type_parameter_value>" + queryDataParameter;
            }

            var queryData = "<LayoutHeader>" + queryDataParameter + "<project>" + projectName + "</project></LayoutHeader>";

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

        function getBasicInfo(project) {

            var self = this;

            var queryDataParameter = "<emp_no>" + loginData["emp_no"] + "</emp_no>";
            var queryData = "<LayoutHeader>" + queryDataParameter + "<project>" + project + "</project></LayoutHeader>";

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];

                if (resultCode === 1) {
                    //callBasicInfo = true;

                    var dataContent = data["Content"];

                    if (loginData["BasicInfo"] == undefined) {
                        loginData["BasicInfo"] = {};
                    }

                    loginData["BasicInfo"][project] = {
                        user: [],
                        userDetail: {},
                        function: {},
                        location: {},
                        locationFunction: {}
                    };

                    for (var i=0; i<dataContent.length; i++) {

                        //Function
                        var functionName = dataContent[i].function.toString().trim();
                        if (loginData["BasicInfo"][project]["function"][functionName] == undefined) {
                            loginData["BasicInfo"][project]["function"][functionName] = [];
                        }

                        //Location
                        var locationName = dataContent[i].location.toString().trim();
                        if (loginData["BasicInfo"][project]["location"][locationName] == undefined) {
                            loginData["BasicInfo"][project]["location"][locationName] = [];
                        }

                        //LocationFunciton
                        if (loginData["BasicInfo"][project]["locationFunction"][locationName] == undefined) {
                            loginData["BasicInfo"][project]["locationFunction"][locationName] = [];
                        }

                        for (var j=0; j<dataContent[i].user_list.length; j++) {
                            //All User
                            if (loginData["BasicInfo"][project]["user"].indexOf(dataContent[i].user_list[j].login_id) == -1) {
                                loginData["BasicInfo"][project]["user"].push(dataContent[i].user_list[j].login_id);
                                loginData["BasicInfo"][project]["userDetail"][dataContent[i].user_list[j].login_id] = dataContent[i].user_list[j];
                            }

                            //All Functon
                            if (loginData["BasicInfo"][project]["function"][functionName].indexOf(dataContent[i].user_list[j].login_id) == -1) {
                                loginData["BasicInfo"][project]["function"][functionName].push(dataContent[i].user_list[j].login_id);
                            }

                            //All Location
                            if (loginData["BasicInfo"][project]["location"][locationName].indexOf(dataContent[i].user_list[j].login_id) == -1) {
                                loginData["BasicInfo"][project]["location"][locationName].push(dataContent[i].user_list[j].login_id);
                            }
                        }

                        //All LocationFunciton
                        if (loginData["BasicInfo"][project]["locationFunction"][locationName].indexOf(dataContent[i].function) == -1) {
                            loginData["BasicInfo"][project]["locationFunction"][locationName].push(dataContent[i].function);
                        }

                        //Sort User ID
                        loginData["BasicInfo"][project]["function"][functionName].sort();
                        loginData["BasicInfo"][project]["location"][locationName].sort();

                    }

                    //Sort Function
                    var tempArr = [];
                    var tempObj = {};

                    $.each(loginData["BasicInfo"][project]["function"], function(key, user) {
                        tempArr.push(key);
                    });

                    tempArr.sort();

                    for (var i=0; i<tempArr.length; i++) {
                        tempObj[tempArr[i]] = loginData["BasicInfo"][project]["function"][tempArr[i]];
                    }

                    loginData["BasicInfo"][project]["function"] = tempObj;

                    //Sort User ID
                    loginData["BasicInfo"][project]["user"].sort();

                    //Event Member Sort Type
                    if (window.localStorage.getItem("eventMemberType") !== null) {
                        memberListView(window.localStorage.getItem("eventMemberType"), project);
                    } else {
                        memberListView("location", project);
                    }

                }

            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //if (!callBasicInfo) {
                    CustomAPI("POST", true, "getBasicInfo", self.successCallback, self.failCallback, queryData, "");
                //}
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
                getEventListFinish = true;

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
            var eventListMsgHTML = $("template#tplEventListMsg2").html();

            for (var i=0; i<eventListData.length; i++) {

                var eventListMsg = $(eventListMsgHTML);

                //Add ID
                eventListMsg.prop("id", "event-list-msg-" + eventListData[i].event_row_id);

                //Created User
                if (eventListData[i].updated_user === null) {
                    var eventOwner = eventListData[i].created_user;
                } else {
                    var eventOwner = eventListData[i].updated_user;
                }
                eventListMsg.find(".event-list-msg-top .name").html(eventOwner);

                //Create Datetime - Convert with TimeZone
                if (eventListData[i].updated_at === null) {
                    var eventDateTime = eventListData[i].created_at;
                } else {
                    var eventDateTime = eventListData[i].updated_at;
                }
                var tempDate = dateFormatYMD(eventDateTime);
                var createTime = new Date(tempDate);
                var createTimeConvert = createTime.TimeZoneConvert();
                createTimeConvert = createTimeConvert.substr(0, parseInt(createTimeConvert.length - 3, 10));
                eventListMsg.find(".event-list-msg-top .time").html(createTimeConvert);

                //Event ID Number
                eventListMsg.find(".event-list-msg-top .link .text").html(eventListData[i].event_row_id);

                //Event Title
                eventListMsg.find(".event-list-msg-top .description").html(eventListData[i].event_title);

                //Type:
                //ITS> 緊急通報 / 一般通報
                //RM> A級事件 / B級事件 / C級事件 / 預警事件 / 資訊分享
                var event_type = eventListData[i].event_type;
                var className;
                eventListMsg.find(".event-list-msg-top .link .icon").hide();
                if (event_type === "一般通報") {
                    className = "normal";
                } else if (event_type === "緊急通報") {
                    className = "urgent";
                } else if (event_type === "A級事件") {
                    className = "rm-a-class";
                } else if (event_type === "B級事件") {
                    className = "rm-b-class";
                } else if (event_type === "C級事件") {
                    className = "rm-c-class";
                } else if (event_type === "預警事件") {
                    className = "rm-prevent-event";
                } else if (event_type === "資訊分享") {
                    className = "rm-info-share";
                }
                eventListMsg.find(".event-list-msg-top .link ." + className).show();

                //Event Related Link
                if (eventListData[i].related_event_row_id !== 0) {
                    eventListMsg.find(".event-list-msg-top .link-event").data("value", eventListData[i].related_event_row_id);

                    var widthEventNumber = parseInt(eventListData[i].event_row_id.toString().length * 3 * document.documentElement.clientWidth / 100, 10);
                    var widthImg = parseInt(5 * document.documentElement.clientWidth / 100, 10);
                    if (event_type === "一般通報") {
                        widthImg = 0;
                    }
                    eventListMsg.find(".event-list-msg-top .link-event").css("margin-left", (widthEventNumber + widthImg) + "px");
                } else {
                    eventListMsg.find(".event-list-msg-top .link-event").hide();
                }

                //Status: 未完成 / 完成
                var event_status = eventListData[i].event_status;
                if (event_status === "完成") {
                    eventListMsg.find(".event-list-msg-top .event-status .done").show();
                    eventListMsg.find(".event-list-msg-top .event-status .unfinished").hide();
                }

                //User Count / Seen Count
                var userSeenCount = eventListData[i].user_count + "(" + eventListData[i].seen_count + "人已讀)";
                eventListMsg.find(".event-list-msg-bottom .member .text").html(userSeenCount);

                //Task finish Count
                var taskCount = eventListData[i].task_count + "(" + eventListData[i].task_finish_count + "項完成)"
                eventListMsg.find(".event-list-msg-bottom .member-done .text").html(taskCount);

                //Message Count
                var msgCount;
                for (j=0; j<messageCountData.length; j++) {
                    if (messageCountData[j]["target_id"] === eventListData[i].chatroom_id) {
                        msgCount = messageCountData[j]["count"];
                        break;
                    }
                }

                if (msgCount == 0) msgCount = "";
                eventListMsg.find(".message .count").html(msgCount);

                $("#reportDiv").append(eventListMsg);
            }

            loadingMask("hide");
            eventListData = null;

            //Scroll to the specific Event List position
            if (typeof eventRowID != 'undefined') {
                if (eventRowID != null) {
                    //If Project changed, eventRowID will not exist
                    if ($("#event-list-msg-" + eventRowID).length != 0) {
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
        }

        function memberListView(sortType, project) {

            var eventMemberDataListHTML = $("template#tplEventMemberDataList").html();
            $("#eventMemberTypeContent").siblings().remove();

            if (sortType === "user") {
                var eventMemberDataList = $(eventMemberDataListHTML);
                eventMemberDataList.find(".title").html("管理員");

                var eventMemberDataListView = eventMemberDataList.find("ul");
                var eventMemberData = "";

                for (var i=0; i<loginData["BasicInfo"][project][sortType].length; i++) {
                   eventMemberData += "<li>" + loginData["BasicInfo"][project][sortType][i] + "</li>";
                }

                eventMemberDataListView.html(eventMemberData);
                $("#memberDiv").append(eventMemberDataList);
            } else {
                $.each(loginData["BasicInfo"][project][sortType], function(key, user) {
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

            //Type:
            //ITS> 緊急通報 / 一般通報
            //RM> A級事件 / B級事件 / C級事件 / 預警事件 / 資訊分享
            var event_type = data.event_type;
            var className;

            eventMemberList.siblings(".header").find(".number .icon").hide();
            if (event_type === "一般通報") {
                className = "normal";
            } else if (event_type === "緊急通報") {
                className = "urgent";
            } else if (event_type === "A級事件") {
                className = "rm-a-class";
            } else if (event_type === "B級事件") {
                className = "rm-b-class";
            } else if (event_type === "C級事件") {
                className = "rm-c-class";
            } else if (event_type === "預警事件") {
                className = "rm-prevent-event";
            } else if (event_type === "資訊分享") {
                className = "rm-info-share";
            }
            eventMemberList.siblings(".header").find(".number ." + className).show();

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

            //Remove old popup
            $("#eventMemberList").popup("destroy").remove();
            $("#eventMemberList-option").popup("destroy").remove();

            //EventList / EventContent
            var eventMemberListData = {
                id: "eventMemberList",
                content: eventMemberList
            };

            tplJS.Popup(null, null, "append", eventMemberListData);

            $("#eventMemberList").popup("open");
            footerFixed();
            loadingMask("hide");

            //Center title content
            var widthImg = $(".event-member-list ." + className + " .img-text .img").width();
            var widthText = $(".event-member-list ." + className + " .img-text .text").width();
            $(".event-member-list .img-text").width(widthImg + widthText);
        };

        window.functionListPopup = function(data) {

            //Event Function List Popup
            var eventFunctionListHTML = $("template#tplEventFunctionList").html();
            var eventFunctionList = $(eventFunctionListHTML);

            //Type: 緊急通報 / 一般通報
            var event_type = data.event_type;
            var className;

            eventFunctionList.siblings(".header").find(".number .icon").hide();
            if (event_type === "一般通報") {
                className = "normal";
            } else if (event_type === "緊急通報") {
                className = "urgent";
            } else if (event_type === "A級事件") {
                className = "rm-a-class";
            } else if (event_type === "B級事件") {
                className = "rm-b-class";
            } else if (event_type === "C級事件") {
                className = "rm-c-class";
            } else if (event_type === "預警事件") {
                className = "rm-prevent-event";
            } else if (event_type === "資訊分享") {
                className = "rm-info-share";
            }
            eventFunctionList.siblings(".header").find(".number ." + className).show();

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
                    var userData = data.task_detail[i].close_task_user_id.split("\\");
                    eventFunctionListLi.find(".user").html(userData[1]);
                    eventFunctionListLi.find(".datetime").html(completeTimeText);
                } else {
                    //Before Done
                    var eventFunctionListLi = $(eventFunctionListBeforeHTML);
                    eventFunctionListLi.find(".user-datetime").remove();
                }
                eventFunctionListLi.find(".title").html(data.task_detail[i].task_location);
                eventFunctionListLi.find(".function").html(data.task_detail[i].task_function);

                eventFunctionList.siblings(".main").append(eventFunctionListLi);
            }

            //Remove old popup
            $("#eventFunctionList").popup("destroy").remove();
            $("#eventFunctionList-option").popup("destroy").remove();

            //EventList / EventContent
            var eventFunctionListData = {
                id: "eventFunctionList",
                content: eventFunctionList
            };

            tplJS.Popup(null, null, "append", eventFunctionListData);

            $("#eventFunctionList").popup("open");
            footerFixed();
            loadingMask("hide");

            //Center title content
            var widthImg = $(".event-member-list ." + className + " .img-text .img").width();
            var widthText = $(".event-member-list ." + className + " .img-text .text").width();
            $(".event-member-list .img-text").width(widthImg + widthText);
        };

        function showEventAdd() {
            //Only [admin] can Add New Event
            if (checkAuthority("admin")) {
                $("#addEvent").show();
            } else {
                $("#addEvent").hide();
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

                loadingMask("show");

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
                loadingMask("show");
                $(".loader").css("top", "0px");
                var eventDetail = new getEventDetail(eventID, action);
            }
        };

        window.changeTabToEventList = function() {
            $("#tabEventList a:eq(0)").addClass("ui-btn-active");
            $("#tabEventList a:eq(1)").removeClass("ui-btn-active");
            $("#tabEventList").tabs({ active: 0 });
            footerFixed();
        };

        function contactPopup(userID) {
            var memberDataExist = false;

            $.each(loginData["BasicInfo"][projectName]["userDetail"], function(user, detail) {
                if (user === userID) {
                    memberDataExist = true;

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

            if (memberDataExist) {
                if (checkPopupShown()) {
                    if (popupID === "eventMemberList") {
                        openMemberList = true;
                        $("#eventMemberList").popup("close");
                    } else {
                        openMemberList = false;
                    }
                }

                setTimeout(function(){
                    $("#contactUserPopup").popup("option", "dismissible", true);
                    $("#contactUserPopup").popup("open");
                }, 200);
            }
        }

        //Cehck User Project
        window.changeProject = function(action, val) {
            val = val || null;
            // ITS or RM

            if (action === "check") {
                if (!setProjectNameFromQPlay) {
                    if (window.localStorage.getItem("projectName") !== null) {
                        projectName = window.localStorage.getItem("projectName");
                    }
                }
            } else if (action === "setOption") {

                //projectSelect option
                $("#projectSelect .item").removeClass("select");
                $("#" + projectName).addClass("select");

                //Dropdown list
                $(".event-type").hide();

                if (projectName === "ITS") {
                    $("#eventTypeITS").show();
                } else if (projectName === "RM") {
                    $("#eventTypeRM").show();
                }

                //Page Title
                $("#viewEventList .ui-title").html(projectName);

            } else if (action === "change") {
                if (val !== projectName) {

                    //Update local storage
                    projectName = val;
                    window.localStorage.setItem("projectName", projectName);

                    changeProject("setOption");

                    if (window.localStorage.getItem("eventType" + projectName) !== null) {
                        var EventList = new getEventList(window.localStorage.getItem("eventType" + projectName));
                    } else {
                        var EventList = new getEventList("1");
                    }

                    //Set Active Tab
                    $("#tabEventList a:eq(0)").addClass("ui-btn-active");
                    $("#tabEventList a:eq(1)").removeClass("ui-btn-active");
                    $("#tabEventList").tabs({ active: 0 });

                    //Refresh Member List
                    if (window.localStorage.getItem("eventMemberType") !== null) {
                        memberListView(window.localStorage.getItem("eventMemberType"), projectName);
                    } else {
                        memberListView("location", projectName);
                    }

                    showEventAdd();
                }
            }

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

            //UI Dropdown List : Event Type for ITS
            if (window.localStorage.getItem("eventTypeITS") !== null) {
                var eventTypeDefaultVal = window.localStorage.getItem("eventTypeITS");
            } else {
                var eventTypeDefaultVal = "1";
            }

            var eventTypeData = {
                id: "eventTypeITS",
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
                defaultValue: eventTypeDefaultVal,
                attr: {
                    class: "event-type"
                }
            };

            $("#reportDiv").append('<div id="eventTypeContent"></div>');
            tplJS.DropdownList("viewEventList", "eventTypeContent", "append", "typeA", eventTypeData);

            //UI Dropdown List : Event Type for RM
            if (window.localStorage.getItem("eventTypeRM") !== null) {
                var eventTypeDefaultVal = window.localStorage.getItem("eventTypeRM");
            } else {
                var eventTypeDefaultVal = "1";
            }

            var eventTypeData = {
                id: "eventTypeRM",
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
                    text: "A級事件"
                }, {
                    value: "4",
                    text: "B級事件"
                }, {
                    value: "5",
                    text: "C級事件"
                }, {
                    value: "6",
                    text: "預警事件"
                }, {
                    value: "7",
                    text: "資訊分享"
                }],
                defaultValue: eventTypeDefaultVal,
                attr: {
                    class: "event-type"
                }
            };

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

            tplJS.Popup(null, null, "append", contactUserPopupData);

            //No Use Authority Popup
            var noUseAuthorityPopupData = {
                id: "noUseAuthorityPopup",
                content: $("template#tplNoUseAuthorityPopup").html()
            };

            tplJS.Popup(null, null, "append", noUseAuthorityPopupData);

            //Project Select Panel
            $("#projectSelect").panel({
                display: "overlay",
                swipeClose: false,
                dismissible: false,
                open: function() {
                    $(".ui-panel").css({
                        "min-height": "100vh",
                        "max-height": "100vh",
                        "touch-action": "none"
                    });

                    $("<div class='ui-panel-background'></div>").appendTo("body");

                    if (device.platform === "iOS") {
                        var heightView = parseInt(document.documentElement.clientHeight * 100 / 100, 10);
                        var heightPanel = heightView - 20;

                        $("#projectSelect").css({
                            'min-height': heightPanel + 'px',
                            'max-height': heightPanel + 'px',
                            'margin-top': '20px'
                        });
                    }

                    tplJS.preventPageScroll();
                },
                close: function() {
                    $(".ui-panel-background").remove();
                    tplJS.recoveryPageScroll();
                }
            });

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
                if (window.localStorage.getItem("eventType" + projectName) !== null) {
                    var EventList = new getEventList(window.localStorage.getItem("eventType" + projectName));
                } else {
                    var EventList = new getEventList("1");
                }
            }

            changeProject("setOption");

            footerFixed();

            //set padding bottom
            var paddingBottom = parseInt(document.documentElement.clientWidth * 18 / 100, 10);
            $("#viewEventList").css("padding-bottom", paddingBottom + "px");

            chatRoom.resetBadge();
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
        $(document).on("change", ".event-type", function() {
            $(".event-list-no-data").hide();
            loadingMask("show");

            var eventType = $("#eventType" + projectName).val();

            var EventList = new getEventList(eventType);

            //Remember Event Type
            window.localStorage.setItem("eventType" + projectName, eventType);
        });

        //Event Member List Popup - Member List & View List
        $(document).on("click", ".event-list-msg-bottom .member, .event-list-msg-bottom .view", function() {
            ahowEventData(this, "member");
        });

        $(document).on("click", "#eventMemberList .confirm", function() {
            $("#eventMemberList").popup("close");
            $("#eventMemberList").popup("destroy").remove();
            $("#eventMemberList-option").popup("destroy").remove();
            footerFixed();
        });

        //Event Member List Popup - open Mail / Tel
        $(document).on("click", "#eventMemberList .event-member-list .text", function() {
            var user = $(this).html();
            var userData = user.split('\\');
            var userID = userData[1];

            contactPopup(userID);
        });

        //Event Function List Popup
        $(document).on("click", ".event-list-msg-bottom .member-done", function() {
            ahowEventData(this, "function");
        });

        $(document).on("click", "#eventFunctionList .confirm", function() {
            $("#eventFunctionList").popup("close");
            $("#eventFunctionList").popup("destroy").remove();
            $("#eventFunctionList-option").popup("destroy").remove();
            footerFixed();
        });

        //Event Content
        $(document).on("click", ".event-list-msg .description, .event-list-msg .name-time, .event-list-msg .message", function() {
            ahowEventData(this);
            $.mobile.changePage('#viewEventContent');
        });

        //Event Related Content
        $(document).on("click", ".event-list-msg .link-event", function() {
            ahowEventData(this, "authority");
        });

        //Event Add
        $(document).on("click", "#addEvent", function() {
            loadingMask("show");
            $(".loader").css("top", "0px");
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
            memberListView($(this).val(), projectName);

            //Remember Event Member Sort Type
            window.localStorage.setItem("eventMemberType", $(this).val());
        });

        //Mail / Tel
        $(document).on("click", ".event-member-data-list ul li", function() {
            var userID = $(this).html();

            contactPopup(userID);
        });

        $(document).on("popupafterclose", "#contactUserPopup", function() {
            //Check if need to re-open eventMemberList
            if (openMemberList == true) {
                setTimeout(function(){
                    $("#contactUserPopup").popup("close");
                    $("#eventMemberList").popup("open");
                }, 200);
            } else {
                //Set Active Tab
                $("#tabEventList a:eq(1)").addClass("ui-btn-active");
                $("#tabEventList").tabs({ active: 1 });
            }
        });

        //Change project
        $(document).on("click", "#projectType", function() {
            $("#projectSelect").panel("open");
        });

        $(document).on("click", "#projectSelect .item", function() {
            var val = $(this).html();
            changeProject("change", val);
            $("#projectSelect").panel("close");
        });
    }
});
