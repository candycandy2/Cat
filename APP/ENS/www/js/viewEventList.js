
$("#viewEventList").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        window.getAuthority = function() {

            var self = this;
            //Data Life-Cycle: 7 Days
            var dataLifeCycle = 604800;
            var queryData = '<LayoutHeader><emp_no>' + loginData["emp_no"] + '</emp_no></LayoutHeader>';

            this.successCallback = function(data, dataExist) {
                dataExist = dataExist || false;
                var resultCode = data['ResultCode'];

                if (resultCode === 1) {
                    if (!dataExist) {
                        processLocalData.storeData("getAuthority", dataLifeCycle, data);
                    }

                    var dataContent = data["Content"];

                    var EventList = new getEventList();
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

                var basicInfo = new getBasicInfo();
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

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "getBasicInfo", self.successCallback, self.failCallback, queryData, "");
            }();

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
                    value: "0",
                    text: "位置"
                }, {
                    value: "1",
                    text: "IT Function"
                }, {
                    value: "2",
                    text: "管理員"
                }]
            };

            $("#memberDiv").append('<div id="eventMemberTypeContent"></div>');
            tplJS.DropdownList("viewEventList", "eventMemberTypeContent", "append", "typeA", eventMemberTypeData);

            //Event Member Data List
            var eventMemberDataListHTML = $("template#tplEventMemberDataList").html();

            var eventMemberDataList = $(eventMemberDataListHTML);
            $("#memberDiv").append(eventMemberDataList);

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
    }
});
