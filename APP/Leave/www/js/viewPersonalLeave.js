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
    defaultValue: 1
};


$("#viewPersonalLeave").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        // window.APIRequest = function() {
            
        //     var self = this;

        //     this.successCallback = function(data) {
        //         loadingMask("hide");

        //         var resultcode = data['ResultCode'];
        //         //do something
        //     };

        //     this.failCallback = function(data) {};

        //     var __construct = function() {
        //         //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
        //     }();

        // };

        // function initSlider() {
        //     if(personalLeaveDateExist) {   
        //         var index = 0;
        //         year = thisYear-1;
        //         month = thisMonth;
        //         while(index < 13) {
        //             monthlyPageDateList += "<div>" + monTable[month] + year + "</div>";
        //             monthlyPageDate[index] = month + "." + year;
        //             if(month == 12){
        //                 year++;
        //                 month = 0;
        //             }
        //             month++;
        //             index++;
        //         }
        //         $(".personalLeaveSlider").html("");
        //         $(".personalLeaveSlider").append(monthlyPageDateList).enhanceWithin();
        //     }
        //     personalLeaveDateExist = false;
        //     if($(".personalLeaveSlider").hasClass("slick-slider") || $(".personalLeaveSlider").hasClass("slick-initialized")){
        //         $(".personalLeaveSlider").slick("unslick");
        //     }
        //     $(".personalLeaveSlider").slick({
        //         initialSlide: 0,
        //         autopaly: false,
        //         dots: false,
        //         responseive: [{
        //             breakpoint: 500,
        //             settings: {
        //                 arrows: true,
        //                 infinite: false,
        //                 slidesToShow: 2,
        //                 slidesToScroll: 2
        //             }
        //         }],
        //         infinite: false
        //     });
        // }

        $(document).ready(function() {
            $("#viewPersonalLeave #myCalendar").zabuto_calendar({
                language: "en",
                show_previous: true,
                show_next: true,
                cell_border: true,
                show_days: true,
                weekstartson: 0,
                nav_icon: {
                    prev: '<i class="fa fa-chevron-circle-left"></i>',
                    next: '<i class="fa fa-chevron-circle-right"></i>'
                }
            });
        });

        /********************************** page event *************************************/
        $("#viewPersonalLeave").on("pagebeforeshow", function(event, ui) {
            $("#tab-1").show();
            $("#tab-2").hide();
            tplJS.DropdownList("viewPersonalLeave", "leaveType", "prepend", "typeA", leaveTypeData);
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
    }
});
