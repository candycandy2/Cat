
$("#viewEventList").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.getEventList = function() {
            
            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
                //loadingMask("hide");
            }();

        };

        function eventMemberListPopup() {
            var data = {
                id: "eventMemberList",
                content: $("template#tplEventMemberList").html()
            };

            tplJS.Popup("viewEventList", "contentEventList", "append", data);
        }

        function eventFunctionListPopup() {
            var data = {
                id: "eventFunctionList",
                content: $("template#tplEventFunctionList").html()
            };

            tplJS.Popup("viewEventList", "contentEventList", "append", data);
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
                }, {
                    value: "0",
                    text: "全部##"
                }, {
                    value: "1",
                    text: "未完成##"
                }, {
                    value: "2",
                    text: "完成##"
                }, {
                    value: "3",
                    text: "緊急通報##"
                }, {
                    value: "4",
                    text: "一般通報##"
                }]
            };

            $("#reportDiv").append('<div id="eventTypeContent"></div>');
            tplJS.DropdownList("viewEventList", "eventTypeContent", "append", "typeA", eventTypeData);

            //Event List Msg
            var eventListMsgHTML = $("template#tplEventListMsg").html();

            for (var i=0; i<1; i++) {
                var eventListMsg = $(eventListMsgHTML);
                $("#reportDiv").append(eventListMsg);
            }

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

        });

        $("#viewEventList").on("pageshow", function(event, ui) {

            //Event Member List Popup
            eventMemberListPopup();

            //Event Function List Popup
            eventFunctionListPopup();
        });

        /********************************** dom event *************************************/

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
    }
});
