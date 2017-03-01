
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

            tplJS.DropdownList("viewEventList", "reportDiv", "append", eventTypeData);

            //Event List Msg
            var eventListMsgHTML = $("template#tplEventListMsg").html();

            for (var i=0; i<5; i++) {
                var eventListMsg = $(eventListMsgHTML);
                $("#reportDiv").append(eventListMsg);
            }

        });

        $("#viewEventList").on("pageshow", function(event, ui) {
            //$('#deleteConfirm').popup('open');
            //$('#tplOptionTest').popup('open');
        });

        /********************************** dom event *************************************/
        $(document).on("click", "#tabEventList", function() {

        });

    }
});
