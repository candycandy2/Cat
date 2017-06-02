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

        function initSlider() {
            if(personalLeaveDateExist) {   
                var index = 0;
                year = thisYear-1;
                month = thisMonth;
                while(index < 13) {
                    monthlyPageDateList += "<div>" + monTable[month] + year + "</div>";
                    monthlyPageDate[index] = month + "." + year;
                    if(month == 12){
                        year++;
                        month = 0;
                    }
                    month++;
                    index++;
                }
                $(".personalLeaveSlider").html("");
                $(".personalLeaveSlider").append(monthlyPageDateList).enhanceWithin();
            }
            personalLeaveDateExist = false;
            if($(".personalLeaveSlider").hasClass("slick-slider") || $(".personalLeaveSlider").hasClass("slick-initialized")){
                $(".personalLeaveSlider").slick("unslick");
            }
            $(".personalLeaveSlider").slick({
                initialSlide: 0,
                autopaly: false,
                dots: false,
                responseive: [{
                    breakpoint: 500,
                    settings: {
                        arrows: true,
                        infinite: false,
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }],
                infinite: false
            });
        }

        $(document).ready(function() {
            $("#myCalendar").zabuto_calendar({
                language: "en",
            });
        });

        /********************************** page event *************************************/
        $("#viewPersonalLeave").on("pagebeforeshow", function(event, ui) {
            $("#tab-1").show();
            $("#tab-2").hide();
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

        $(document).on("click", "#title-1", function() {
            if($("#infoContent-1").css("display") === "none") {
                $("#infoContent-1").slideDown(500);
                $("#title-1").find(".listDown").attr("src", "img/list_up.png");
            }else if($("#infoContent-1").css("display") === "block") {
                $("#infoContent-1").slideUp(500);
                $("#title-1").find(".listDown").attr("src", "img/list_down.png")
            }
        });

        $(document).on("click", "#title-2", function() {
            if($("#infoContent-2").css("display") === "none") {
                $("#infoContent-2").slideDown(500);
                $("#title-2").find(".listDown").attr("src", "img/list_up.png")
            }else if($("#infoContent-2").css("display") === "block") {
                $("#infoContent-2").slideUp(500);
                $("#title-2").find(".listDown").attr("src", "img/list_down.png")
            }
        });
    }
});
