var leaveTypeData = {
    id: "eventType",
    option: [{
        value: "0",
        text: "去年特休"
    }, {
        value: "1",
        text: "去年彈休"
    }, {
        value: "2",
        text: "本期特休"
    }, {
        value: "3",
        text: "生理假"
    }],
    defaultValue: 0
};

var agentData = {
    id: "agent",
    option: [{
        value: "0",
        text: "請選擇"
    }, {
        value: "1",
        text: "去年彈休"
    }, {
        value: "2",
        text: "本期特休"
    }, {
        value: "3",
        text: "生理假"
    }],
    defaultValue: 0
};


$("#viewPersonalLeave").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        /*window.APIRequest = function() {
            
            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };*/

        $(document).ready(function() {
            $("#viewPersonalLeave #myCalendar").calendar({
                language: "default",
                show_previous: true,
                show_next: true,
                show_days: true,
                weekstartson: 0,
                nav_icon: {
                    prev: '<img src="img/pre.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                },
            });
        });

        /********************************** page event *************************************/
        $("#viewPersonalLeave").on("pagebeforeshow", function(event, ui) {
            $("#tab-1").show();
            $("#tab-2").hide();
            if(lastPageID === "viewPersonalLeave") {
                tplJS.DropdownList("viewPersonalLeave", "leaveType", "prepend", "typeA", leaveTypeData);
                $("#eventType-option #eventType-option-list").css("height", "55VW");

                tplJS.DropdownList("viewPersonalLeave", "agent", "prepend", "typeA", agentData);
                $("#agent-option #agent-option-list").css("height", "55VW");
            }
            $("label[for=viewPersonalLeave-tab-1]").addClass('ui-btn-active');
            $("label[for=viewPersonalLeave-tab-2]").removeClass('ui-btn-active');
        });

        $("#viewPersonalLeave").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewPersonalLeave").keypress(function(event) {

        });

        $(".page-tabs #viewPersonalLeave-tab-1").on("click", function() {
            $("#tab-1").show();
            $("#tab-2").hide();
        });

        $(".page-tabs #viewPersonalLeave-tab-2").on("click", function() {
            $("#tab-1").hide();
            $("#tab-2").show();
        });

        $("#leaveType").on("click", function() {
            
        });

        $("#infoTitle-1").on("click", function() {
            if($("#infoContent-1").css("display") === "none") {
                $("#infoContent-1").slideDown(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_up.png");
            }else if($("#infoContent-1").css("display") === "block") {
                $("#infoContent-1").slideUp(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_down.png")
            }
        });

        $("#infoTitle-2").on("click", function() {
            if($("#infoContent-2").css("display") === "none") {
                $("#infoContent-2").slideDown(500);
                $("#infoTitle-2").find(".listDown").attr("src", "img/list_up.png")
            }else if($("#infoContent-2").css("display") === "block") {
                $("#infoContent-2").slideUp(500);
                $("#infoTitle-2").find(".listDown").attr("src", "img/list_down.png")
            }
        });

        $("#infoTitle-3").on("click", function() {
            if($("#infoContent-3").css("display") === "none") {
                $("#infoContent-3").slideDown(500);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_up.png")
            }else if($("#infoContent-3").css("display") === "block") {
                $("#infoContent-3").slideUp(500);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_down.png")
            }
        });
    }
});
